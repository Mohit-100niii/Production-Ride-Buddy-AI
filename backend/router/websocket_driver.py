from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

active_driver_connections = {}

@router.websocket("/ws-driver/")
async def driver_websocket(websocket: WebSocket):
    driver_id = websocket.query_params.get("driverid")
    print(f" File - Websocket_driver.py - WebSocket connection attempt from driver_id: {driver_id}")

    if not driver_id:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    active_driver_connections[driver_id] = websocket
    print (f" File - Websocket_driver.py - Driver {driver_id} connected. Total drivers: {len(active_driver_connections)}")
    print (active_driver_connections)  # Debug: Print active connections
   

    await websocket.send_json({
        "type": "CONNECTED",
        "message": f"Driver {driver_id} connected successfully"
    })

    try:
        while True:
            data = await websocket.receive_text()
            print("Received:", data)
    except WebSocketDisconnect:
        active_driver_connections.pop(driver_id, None)
        print(f"Driver {driver_id} disconnected")