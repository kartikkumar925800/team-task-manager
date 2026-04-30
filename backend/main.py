from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
from routers import projects, tasks

app.include_router(projects.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": "API is online"}