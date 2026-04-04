from pydantic import EmailStr
from datetime import datetime
from pydantic import BaseModel
from pydantic import ConfigDict


class PostBase(BaseModel):
    title:str
    content:str
    published:bool =  True
    model_config = ConfigDict(extra="forbid")

class PostCreate(PostBase):
    pass

class PostResponse(PostBase):
    id:int
    created_at:datetime
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    email:EmailStr  
    password:str

class UserResponse(BaseModel):
    id:int
    email:EmailStr
    created_at:datetime
    model_config = ConfigDict(from_attributes=True)
    