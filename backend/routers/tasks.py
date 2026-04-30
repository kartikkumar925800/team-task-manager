from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import models
import schemas
from database import get_db
from routers.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.RoleEnum.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create tasks")
    
    project = db.query(models.Project).filter(models.Project.id == task.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    assignee = db.query(models.User).filter(models.User.id == task.assignee_id).first()
    if not assignee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignee not found")

    db_task = models.Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        project_id=task.project_id,
        assignee_id=task.assignee_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == models.RoleEnum.ADMIN:
        return db.query(models.Task).all()
    return db.query(models.Task).filter(models.Task.assignee_id == current_user.id).all()

@router.patch("/{task_id}", response_model=schemas.TaskResponse)
def update_task_status(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if current_user.role != models.RoleEnum.ADMIN and db_task.assignee_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this task")
    
    db_task.status = task_update.status
    db.commit()
    db.refresh(db_task)
    return db_task
    
@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    query = db.query(models.Task)
    if current_user.role != models.RoleEnum.ADMIN:
        query = query.filter(models.Task.assignee_id == current_user.id)
        
    total_tasks = query.count()
    done_tasks = query.filter(models.Task.status == models.StatusEnum.DONE).count()
    in_progress = query.filter(models.Task.status == models.StatusEnum.IN_PROGRESS).count()
    todo_tasks = query.filter(models.Task.status == models.StatusEnum.TODO).count()
    
    now = datetime.utcnow()
    overdue_tasks = query.filter(models.Task.status != models.StatusEnum.DONE, models.Task.due_date < now).count()
    
    return {
        "total": total_tasks,
        "todo": todo_tasks,
        "in_progress": in_progress,
        "done": done_tasks,
        "overdue": overdue_tasks
    }