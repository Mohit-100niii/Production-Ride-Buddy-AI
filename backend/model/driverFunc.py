from typing import Optional

from pydantic import BaseModel, EmailStr


class UpdateStatusRequest(BaseModel):
    email: EmailStr
    status: bool 


class AcceptRideRequest(BaseModel):
    ride_request_id: str
    driver_id: str