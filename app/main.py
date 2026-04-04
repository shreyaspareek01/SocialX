from fastapi import Depends
import psycopg
from psycopg.rows import dict_row 
from fastapi.exceptions import HTTPException
from typing import Optional
from fastapi import Body
from fastapi import FastAPI,status,Response
from fastapi.middleware.cors import CORSMiddleware
import time
from . import models
from .database import engine,get_db 
from sqlalchemy.orm import Session
from .schemas import PostCreate,PostResponse,UserCreate,UserResponse
from .config import settings

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

@app.get("/")
async def root():
    return {"message":"Welcome to my API!!!"}

@app.get("/posts",response_model=list[PostResponse])
async def get_posts(db: Session = Depends(get_db)):
    # cursor.execute("""SELECT * FROM posts""")
    # posts = cursor.fetchall()
    posts = db.query(models.Post).all()
    return posts 

@app.get("/posts/{id}",response_model=PostResponse)
async def get_post(id:int,db:Session = Depends(get_db)):
    # cursor.execute("""SELECT * FROM posts WHERE id=%s """,(id,))
    # post = cursor.fetchone()

    post = db.query(models.Post).filter(models.Post.id==id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Post with id:{id} not found!")
    return post

@app.post("/posts",status_code=status.HTTP_201_CREATED,response_model=PostResponse)
async def create_post(post:PostCreate,db:Session = Depends(get_db)):
    # cursor.execute("""INSERT INTO posts (title,content,published) VALUES (%s,%s,%s) RETURNING *""",(post.title,post.content,post.published))
    # created_post=cursor.fetchone()
    # conn.commit()
    new_post = models.Post(**post.dict());
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@app.delete("/posts/{id}",status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(id:int,db:Session=Depends(get_db)):
    # cursor.execute("""DELETE FROM posts WHERE id = %s RETURNING *""",(id,))
    # deleted_post = cursor.fetchone()
    post = db.query(models.Post).filter(models.Post.id==id)

    if post.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Post with id: {id} not found!")
    # conn.commit()
    post.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
   
@app.put("/posts/{id}",response_model=PostResponse)
async def update_post(id:int, post:PostCreate,db:Session=Depends(get_db)):
    # cursor.execute("""UPDATE posts SET title=%s,content=%s,published=%s WHERE id=%s RETURNING *""",(post.title,post.content,post.published,id,))
    # updated_post=cursor.fetchone()

    post_query = db.query(models.Post).filter(models.Post.id==id)

    if post_query.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"Post with id: {id} not found!")
    # conn.commit()

    post_query.update(post.dict(),synchronize_session=False)
    db.commit()
    return post_query.first()


@app.post("/users",status_code=status.HTTP_201_CREATED,response_model=UserResponse)
async def create_user(user:UserCreate,db:Session=Depends(get_db)):
    created_user=models.User(**user.dict())
    db.add(created_user)
    db.commit()
    db.refresh(created_user) 
    return created_user

@app.get("/users",status_code=status.HTTP_200_OK,response_model=list[UserResponse])
async def get_users(db:Session=Depends(get_db)):
    users=db.query(models.User).all()
    return users
