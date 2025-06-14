import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
})
const User=mongoose.model("User",UserSchema)
// module.exports=User
export {User}