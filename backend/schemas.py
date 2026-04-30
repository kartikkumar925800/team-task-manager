from pydantic import BaseModel, EmailStr
from typing import Optional
from models import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    role: RoleEnum = RoleEnum.MEMBER

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[RoleEnum] = None

from datetime import datetime
from typing import List, Optional
from models import StatusEnum

class ProjectBase(BaseModel):
    name: str
    description: str

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: str
    due_date: datetime

class TaskCreate(TaskBase):
    project_id: int
    assignee_id: int

class TaskUpdate(BaseModel):
    status: StatusEnum

class TaskResponse(TaskBase):
    id: int
    status: StatusEnum
    project_id: int
    assignee_id: int

    class Config:
        from_attributes = True