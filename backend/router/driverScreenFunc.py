from db.mongo import user_ride_requestforDriver, driver_details, driver_rides
from bson import ObjectId
from pydantic import BaseModel
from fastapi import APIRouter
from fastapi import APIRouter, Response
from model.driverFunc import AcceptRideRequest,UpdateStatusRequest
from fastapi import Request, HTTPException
from services.validatetoken import validate_token
from router.websocket_User import active_user_connections
from datetime import datetime

router = APIRouter()


@router.post("/update/status")
async def update_driver_status(request: Request):
    print("Enter in Update Driver Status of Driver Screen Func", request)
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"message": "Internal Server Error", "status": 500}

        token = auth_header.split(" ")[1]
        payload = await validate_token(token, "Driver")
        email = payload["email"]
        status_data = await request.json()
        status = status_data.get("status")
        print(f"Updating status for {email} to {status}")
        await driver_details.update_one(
            {"email": email},
            {"$set": {"isActive": status}}
        )
        return {"message": "Driver status updated successfully", "status": 200, "isActive": status}

    except Exception as e:
        print("Error updating driver status:", e)
        # return {"message": "Failed to update driver status"}
        return {"message": "Failed to update driver status", "status": 500}


@router.get("/get/status")
async def get_driver_status(request: Request):
    print("Enter in Get Driver Status of Driver Screen Func", request)
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return {"message": "Internal Server Error", "status": 500}

        token = auth_header.split(" ")[1]
        payload = await validate_token(token, "Driver")
        email = payload["email"]
        print(f"Fetching status for {email}")
        driver = await driver_details.find_one({"email": email})
        if not driver:
            return {"message": "Driver not found", "status": 404}

        return {"Status": driver.get("isActive"), "status": 200}
    except Exception as e:
        print("Error fetching driver status:", e)
        return {"message": "Failed to fetch driver status", "status": 500}


@router.post("/accept-ride")
async def accept_ride(data: AcceptRideRequest):
    print("Entered Accept Ride API")
    print("Incoming data:", data)
    try:
        # First get the ride request to find the user
        ride_request = await user_ride_requestforDriver.find_one(
            {"_id": ObjectId(data.ride_request_id)}
        )
        
        if not ride_request:
            return {
                "message": "Ride request not found",
                "status": 404
            }
        
        # Check if ride is still pending
        if ride_request.get("status") != "pending":
            return {
                "message": "Ride already accepted by another driver or not found",
                "status": 400
            }
        
        # Update ride status to accepted
        result = await user_ride_requestforDriver.update_one(
            {
                 "_id": ObjectId(data.ride_request_id),
                 "status": "pending"
             },
             {
                 "$set": {
                     "status": "accepted",
                     "accepted_by": data.driver_id
                 }
             }
         )
        


        if result.modified_count == 0:
             return {
                 "message": "Ride already accepted by another driver or not found",
                 "status": 400
             }
        
        # Store ride in driver_rides collection
        ride_record = {
            "driver_id": data.driver_id,
            "ride_request_id": str(data.ride_request_id),
            "user_id": ride_request["user_id"],
            "pickup": ride_request.get("pickup"),
            "drop": ride_request.get("drop"),
            "fare": ride_request.get("fare"),
            "distance": ride_request.get("distance"),
            "accepted_at": datetime.utcnow(),
            "status": "accepted"
        }
        await driver_rides.insert_one(ride_record)
        
        user_id = ride_request["user_id"]
        user_socket = active_user_connections.get(user_id)
        
        driver = await driver_details.find_one({"DriverID": data.driver_id})
        print(f"Driver details for {data.driver_id}:", driver)
        driver_name = driver.get("name") if driver else None
        driver_phone = driver.get("phone") if driver else None
        if user_socket:
            await user_socket.send_json({
                "type": "DRIVER_ASSIGNED",
                "rideId": data.ride_request_id,
                "driver": {
                    "id": data.driver_id,
                    "name": driver_name or data.driver_id,
                    "phone": driver_phone
                }
            })

        print (f"Ride {data.ride_request_id} accepted by driver {data.driver_id}")
        return {
            "message": "Ride accepted successfully",
            "status": 200
        }

    except Exception as e:
        print("Error accepting ride:", e)
        return {
            "message": "Failed to accept ride",
            "status": 500
        }
