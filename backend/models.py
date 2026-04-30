from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum, DateTime
from sqlalchemy.orm import relationship
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"

class StatusEnum(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.MEMBER)
    
    projects = relationship("Project", back_populates="owner")
    tasks = relationship("Task", back_populates="assignee")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.TODO)
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"))
    
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")
