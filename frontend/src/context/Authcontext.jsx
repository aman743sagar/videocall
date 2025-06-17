import { createContext, useContext, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import httpStatus from 'http-status';



export const AuthContext=createContext({})


const client =axios.create({
    baseURL:'https://videocall-i6i5.onrender.com'
})


export const  AuthProvider=({children})=>{
    const authContext=useContext(AuthContext);
    const [userData, setUserData]= useState();
    const router =useNavigate();



    const handleRegister=async ( name, username,password)=>{
        try {
            let request=await client.post("/register",{
                name:name,
                username:username,
                password:password
            })
            if (request.status===httpStatus.CREATED) {
                return request.data.message
            }


        } catch (error) {
            throw  error
        }
    }

    const handleLogin=async (username,password)=>{
        try {
            let request=await client.post("/login",{
                username:username,
                password:password
            })
            console.log(request.data);
            if (request.status===httpStatus.OK) {
                localStorage.setItem("token",request.data.token)
                router("/home")
            }
        } catch (error) {
            throw error
        }

    }
    const getHistoryUser= async () =>{
        try {
            let request=await client.get('/get_all_activity',{
                params:{
                    token:localStorage.getItem("token")

                }
            })
            return request.data
        } catch (error) {
         throw error
        }
    }

    const addHistory= async (meetingCode)=>{
         try {
            let  request= await client.post('/add_to_activity',{
                token:localStorage.getItem("token"),
                meeting_code:meetingCode
            })
            return request
         } catch (error) {
            throw error
         }

    }

    const data={
        userData, setUserData,addHistory, handleRegister, handleLogin ,getHistoryUser
    }

     return(
        <AuthContext.Provider value={data}>
           {children}
        </AuthContext.Provider>
     )

}
