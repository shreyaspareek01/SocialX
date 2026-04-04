import psycopg
from psycopg.rows import dict_row 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
from . import models
from .database import engine 
from .config import settings
from .routers import posts,users,auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
while True:
    try:
        conn = psycopg.connect(host=settings.database_hostname,dbname=settings.database_name,user=settings.database_username,password=settings.database_password, port=settings.database_port)
        cursor = conn.cursor(row_factory=dict_row)
        print("Database connected!")
        break
    except Exception as error:
        print("Connecting to database failed")
        print("Error: ",error)
        time.sleep(2)


my_posts = [{"id":1,"title":"Post1","content":"content1"},{"id":2,"title":"Post2","content":"content2 "}]

def get_post_by_id(id):
    for post in my_posts:
        if(post["id"]==id):
            return post

def get_post_index(id):
    for index,post in enumerate(my_posts):
        if(post["id"]==id):
            return index

app.include_router(posts.router)
app.include_router(users.router)
app.include_router(auth.router)


@app.get("/")
async def root():
    return {"message":"Welcome to my API!!!"}




