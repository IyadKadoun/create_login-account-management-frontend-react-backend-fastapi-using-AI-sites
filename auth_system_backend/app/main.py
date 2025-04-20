from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .database import get_db, engine
from . import models, schemas, security, dependencies
from typing import List
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = dependencies.authenticate_user(db, form_data)
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username, "is_admin": user.is_admin}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "is_admin": user.is_admin} # Return is_admin in the response

# مسار لإنشاء مستخدم جديد (للمديرين فقط)
@app.post("/users/", response_model=schemas.User, dependencies=[Depends(dependencies.get_current_admin_user)])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = dependencies.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    hashed_password = security.hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password, is_admin=user.is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# مسار لجلب جميع المستخدمين (للمديرين فقط)
@app.get("/users/", response_model=List[schemas.User], dependencies=[Depends(dependencies.get_current_admin_user)])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

# مسار لجلب مستخدم معين بواسطة ID (للمديرين فقط)
@app.get("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(dependencies.get_current_admin_user)])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

# مسار لتحديث مستخدم معين بواسطة ID (للمديرين فقط)
@app.put("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(dependencies.get_current_admin_user)])
def update_user(user_id: int, user: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(dependencies.get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Prevent non-admin users from changing their own admin status
    if not current_user.is_admin and user.is_admin is True:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to change admin status")

    for key, value in user.model_dump(exclude_unset=True).items():
        if key == "password" and value:
            setattr(db_user, key, security.hash_password(value))
        else:
            setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

# مسار لحذف مستخدم معين بواسطة ID (للمديرين فقط)
@app.delete("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(dependencies.get_current_admin_user)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(db_user)
    db.commit()
    return db_user