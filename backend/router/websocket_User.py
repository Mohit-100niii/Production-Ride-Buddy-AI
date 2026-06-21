from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from bson import ObjectId
from db.mongo import user_ride_requestforDriver

router = APIRouter()

# Store active user connections by user_id
active_user_connections = {}


@router.websocket("/ws-user/")
async def user_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for users to receive real-time ride updates
    Query params: userid, rideid, token
    """
    user_id = websocket.query_params.get("userid")
    ride_id = websocket.query_params.get("rideid")
    token = websocket.query_params.get("token")

    print(f"File - websocket_User.py - WebSocket connection attempt from user_id: {user_id}, ride_id: {ride_id}")

    if not user_id or not ride_id:
        await websocket.close(code=1008, reason="Missing user_id or ride_id")
        return

    if not token:
        await websocket.close(code=1008, reason="Missing token")
        return

    await websocket.accept()
    
    # Store the connection for this user
    active_user_connections[user_id] = websocket

    print(f"File - websocket_User.py - User {user_id} connected for ride {ride_id}. Total users: {len(active_user_connections)}")

    # Send confirmation message to user
    await websocket.send_json({
        "type": "CONNECTED",
        "message": f"User {user_id} connected successfully for ride {ride_id}",
        "user_id": user_id,
        "ride_id": ride_id
    })

    try:
        while True:
            data = await websocket.receive_json()
            print("Received from frontend:", data)
            message_type = data.get("type")

            # Handle USER_WAITING
            if message_type == "USER_WAITING":
                print(f"User {user_id} is waiting for driver")

            ride_info = None
            try:
                ride_info = await user_ride_requestforDriver.find_one({
                    "_id": ObjectId(ride_id)
                })
            except Exception as lookup_error:
                print(f"Invalid ride_id for lookup: {ride_id}", lookup_error)

            print("Ride info:", ride_info)

            if ride_info:
                if ride_info.get("status") == "accepted":
                    await websocket.send_json({
                        "type": "RIDE_ACCEPTED",
                        "status": ride_info.get("status"),
                        "accepted_by": ride_info.get("accepted_by"),
                        "ride_id": ride_id
                    })
                else:
                    await websocket.send_json({
                        "type": "WAITING",
                        "status": ride_info.get("status"),
                        "ride_id": ride_id
                    })
            else:
                await websocket.send_json({
                    "type": "ERROR",
                    "message": "Ride not found"
                })

    except WebSocketDisconnect:
        if user_id in active_user_connections:
            del active_user_connections[user_id]
        print(f"User {user_id} disconnected from ride {ride_id}")
        print(f"Remaining active users: {len(active_user_connections)}")
    except Exception as e:
        print(f"Error in user websocket {user_id}: {str(e)}")
        if user_id in active_user_connections:
            del active_user_connections[user_id]
