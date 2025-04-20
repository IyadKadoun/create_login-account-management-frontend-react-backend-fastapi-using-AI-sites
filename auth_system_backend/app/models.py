from sqlalchemy import Boolean, Column, Integer, String, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    email = Column(String)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.now())