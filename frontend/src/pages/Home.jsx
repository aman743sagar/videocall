import React, { useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css"
import { Button, IconButton, TextField } from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore';
import { useContext } from 'react'
import { AuthContext } from '../context/Authcontext'
import AnimationIcon from '@mui/icons-material/Animation';
import VideoChatIcon from '@mui/icons-material/VideoChat';

const Home = () => {
    let navigate=useNavigate()
    const [meetingCode, setMeetingCode]= useState("")

    const{addHistory}=useContext(AuthContext)

    let handleVideoCall=async()=>{
      let meeting=  await addHistory(meetingCode)
      console.log(meeting);
        navigate(`/${meetingCode}`)

    }
  return (  
    <>
    <div className='navBar' style={{backgroundColor:"whitesmoke" , height:'80px'}}>
        <div style={{display:'flex', alignItems:'center'}}>
            <h1  style={{fontWeight:'400'}}>Hii welcome in My <VideoChatIcon/> Video app </h1>
        </div>

        <div style={{display:'flex', alignItems:'center'}}>
            <IconButton onClick={()=>{
                navigate('/history')
            }}>
                 <RestoreIcon/>
                 <p>History</p>
            </IconButton>
            <Button  onClick={()=>{
                localStorage.removeItem("token")
                navigate('/auth ')
            }}>
               Logout
            </Button>

        </div>

    </div>
    <div className="meetContainer">
        <div className="leftPanel">
            <div>
                <h2 style={{marginBottom:'15px',color:'black'}}>Connect With Your Friend&Family</h2>
                <div style={{display:'flex', gap:'10px'}}>
                    <TextField id='outlined-basic' label="Meeting Code" variant='outlined' onChange={e=>setMeetingCode(e.target.value)}></TextField>
                    <Button onClick={handleVideoCall} variant='contained'>join</Button>
                </div>
            </div>
        </div>
        <div className='rightPanel'>
            <img src='/image/vido1.png'/>
        </div>
    </div>
    </>
  )
}

export default withAuth(Home)