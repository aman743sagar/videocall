import React from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Landing = () => {
  let routerTo= useNavigate()
  return (
    <div className='landingPageContainer'>
       <nav>
        <div className='navheader'>
            <h2> Your Video App</h2>
        </div>
        <div className='navlist'>
              <p onClick={()=>{
                routerTo('/kjlfdsa')
              }}>Login as guest</p>
              <p onClick={()=>{
                   routerTo('/auth')
              }}>Register</p>
              <button role='button'>
                <p onClick={()=>{
                   routerTo('/auth')
              }} >Login</p>
              </button>
        </div>
       </nav>


       <div className='landingMainContainer'>
        <div>
            <h1>Connect with your Loved ones </h1>
            <p>Cover a distance by Your video call</p>
            <div role='button' style={{textDecoration:'none'}}>
                <Link to={'/auth'}>Get Started</Link>
            </div>
        </div>
        <div>
            <img src="/image/mobile2.jpg" alt="" />
        </div>
       </div>

    </div>
  )
}

export default Landing