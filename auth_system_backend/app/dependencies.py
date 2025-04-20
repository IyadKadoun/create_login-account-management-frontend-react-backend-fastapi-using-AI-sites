from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .database import get_db
from . import models, schemas, security
from jose import JWTError
from typing import Optional

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, form_data: OAuth2PasswordRequestForm):
    user = get_user_by_username(db, form_data.username)
    if not user or not security.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = security.decode_access_token(token)
    if username is None:
        raise credentials_exception
    user = get_user_by_username(db, username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not an admin user")
    return current_user