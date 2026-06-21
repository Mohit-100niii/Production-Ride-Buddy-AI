import bcrypt
from fastapi import APIRouter, Response
from pydantic import BaseModel, EmailStr
from db.mongo import driver_details, driver_rides
from services.generatetoken import create_jwt_token
from fastapi import Request, HTTPException
from services.validatetoken import validate_token
from fastapi.responses import JSONResponse
from model.auth_model import  RegisterRequestDriver ,LoginRequestDriver,DriverProfileResponse
import uuid

router = APIRouter()

@router.post("/register")
async def driver_registration(data: RegisterRequestDriver):
    try:
        print("Enter in Driver Register")
        existing_user = await driver_details.find_one({"email": data.email})
        if existing_user:
            return {"message": "User already exists"}  
        hashed_password = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt())

        driver_data = {
            "name": data.name,
            "email": data.email,
            "phone": data.phone,
            "password": hashed_password.decode("utf-8"),
            "country": data.country,
            "isDriver": data.isDriver,
            "DriverID":"D" + str(uuid.uuid4())[:8]
        }
        print(driver_data)
        await driver_details.insert_one(driver_data)
        return {"message": "Driver Registered Successfully", "status": 200}
    except Exception as e:
        print("❌ Error:", e)
        return {"error": str(e)}
    
    
@router.post("/login")
async def driver_login(data: LoginRequestDriver):
        try:
            print("Enter in Driver Login of Driver Auth")
            email = data.email
            existing_user = await driver_details.find_one({"email": email})
            if existing_user:
                flag = bcrypt.checkpw(
                    data.password.encode(), existing_user["password"].encode()
                )
                token = create_jwt_token(existing_user["email"])
                print(token)
                print(flag)
                if flag == False:
                    return {"message": "Please Enter correct Password !", "status": 404}
                else:
                    return {
                        "message": "Driver Login Successfully",
                        "status": 200,
                        "token": token,
                    }
        except Exception as e:
            print("Login Error", e)
            return {
                "message": "Server is Not Responsed , Please try again after some time",
                "status": 404,
            }
    
@router.get("/profile")
async def get_driver_profile(request: Request): 
    print("Enter in Get Driver Profile of Driver Auth",request)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):      
        return {"message":"Missing or Invalid Token","status":200}
    token = auth_header.split(" ")[1] 
    print(token)
    try:
        payload = await validate_token(token,"Driver")
        print(payload)
        return {"email": payload["email"], "name": payload["name"], "DriverID": payload["DriverID"], "status":200}
    except Exception as e:
       print("Error fetching driver profile:", e)
       return {
           "message":"Please Login Again",
           "status":404
       }

@router.get("/rides-history")
async def get_driver_rides_history(request: Request):
    print("Enter in Get Driver Rides History")
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):      
        return {"message":"Missing or Invalid Token","status":401}
    token = auth_header.split(" ")[1]
    try:
        payload = await validate_token(token,"Driver")
        driver_id = payload["DriverID"]
        
        # Query from driver_rides collection
        rides_cursor = driver_rides.find({"driver_id": driver_id})
        rides = await rides_cursor.to_list(length=None)
        
        # Convert ObjectId to string for JSON serialization
        for ride in rides:
            ride["_id"] = str(ride["_id"])
            if "accepted_at" in ride:
                ride["accepted_at"] = ride["accepted_at"].isoformat()
        
        return {
            "rides": rides,
            "totalRides": len(rides),
            "status": 200
        }
    except Exception as e:
        print("Error fetching driver rides history:", e)
        return {"message":"Failed to fetch rides history","status":500}

