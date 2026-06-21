from fastapi import APIRouter, Request, WebSocket
from db.mongo import driver_details,user_ride_requestforDriver
from router.websocket_driver import active_driver_connections;

router = APIRouter()

@router.post("/create-ride-request")
async def create_ride_request(request: Request):
    try:
        data = await request.json()
        print("Received ride request data:", data)

        pickup = data.get("pickup")
        drop = data.get("drop")
        fare = data.get("fare")
        user_id=data.get("userId")

        if not pickup or not drop:
            return {"message": "Pickup and drop locations are required", "status": 400}

        ride_request = {
            "pickup": pickup,
            "drop": drop,
            "fare": fare,
            "user_id":user_id,
            "status": "pending",
            "accepted_by": None
        }

        print("Creating ride request with data:", ride_request)
        result = await user_ride_requestforDriver.insert_one(ride_request)

        ride_request_id = str(result.inserted_id)
        print("Ride request created with ID:", ride_request_id)

        # SEND TO ALL ACTIVE DRIVERS
        ride_payload = {
            "type": "NEW_RIDE_REQUEST",
            "ride_request_id": ride_request_id,
            "pickup": pickup,
            "drop": drop,
            "fare": fare,
            "status": "pending"
        }

        print("Active drivers currently connected:", list(active_driver_connections.keys()))

        for driver_id, websocket in active_driver_connections.items():
            try:
                await websocket.send_json(ride_payload)
                print(f"Ride request sent to driver {driver_id}")
            except Exception as e:
                print(f"Failed to send ride request to driver {driver_id}: {e}")

        return {
            "message": "Ride request created successfully",
            "status": 200,
            "ride_request_id": ride_request_id
        }

    except Exception as e:
        print("Error creating ride request:", e)
        return {"message": "Failed to create ride request", "status": 500}