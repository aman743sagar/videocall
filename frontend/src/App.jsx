import { useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Authentication from './pages/authentication'
import { AuthProvider } from './context/Authcontext'
import VideoMeetComponent from './pages/VideoMeet'
import Home from './pages/Home'
import History from './pages/History'

function App() {


  return (
    <AuthProvider>
  <Routes>
    <Route path='/' element={<Landing/>}/>
    <Route path='/auth' element={<Authentication/>}/>
    <Route path='/home' element={<Home/>}/>
    <Route path='/history' element={<History/>}/>
    <Route path='/:url' element={<VideoMeetComponent/>}/>
  </Routes>
  </AuthProvider>
  )
}

export default App
