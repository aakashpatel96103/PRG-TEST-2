from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import __name__
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, Token
from ..auth import hash_password, create_access_token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(username=user.username, password_hash=hash_password(user.password))
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    found = db.query(User).filter(User.username == user.username).first()
    if not found or found.password_hash != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"access_token": create_access_token(found.username), "token_type": "bearer"}
