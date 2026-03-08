from motor.motor_asyncio import AsyncIOMotorClient  # ✅ correct async client
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["Voice-Ride-Booking"]
User_detail=db.User_detail
fare_rates_collection = db.fare_rates 
User_Ride_detail=db.user_ride_detail
User_last_Ride=db.User_last_detail

def connect_db():
    try:
        # The connection is established when the client is created
        client.admin.command('ping')  # Test the connection
        print("✅ Database is Connected Successfully")
        return db
    except Exception as e:
        print("❌ Database Connection Failed:", e)
        return None
