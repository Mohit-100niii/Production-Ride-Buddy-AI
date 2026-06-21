from typing import Optional

from pydantic import BaseModel, EmailStr

class RegisterRequestDriver(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    country: str
    isDriver: bool = True
    DriverID: Optional[str] = None
    isActive: Optional[bool] = False


class LoginRequestDriver(BaseModel):
    email: EmailStr
    password: str

class DriverProfileResponse(BaseModel):
    token: str