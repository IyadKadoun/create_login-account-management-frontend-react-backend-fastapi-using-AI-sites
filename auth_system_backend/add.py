from app.database import SessionLocal
from app.models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    db = SessionLocal()
    admin = User(
        username="admin",
        email="admin@example.com",
        password=pwd_context.hash("1"),  # ← Hash the password properly
        is_admin=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    db.close()
    print("Admin user created successfully!")
    
create_admin()