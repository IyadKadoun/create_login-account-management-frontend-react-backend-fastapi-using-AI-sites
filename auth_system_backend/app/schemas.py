from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    REGULAR = "regular"

class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str
    is_admin: Optional[bool] = False

class UserUpdate(UserBase):
    email: Optional[str] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None