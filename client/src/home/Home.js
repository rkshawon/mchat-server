import React, { useContext, useState } from 'react'
import { Context } from '../context/AuthContext'
import Login from '../login/Login'
import './home.css'
import Message from './message/Message'
import Oldconversation from './oldconversation/Oldconversation'

function Home() {
  const {user} = useContext(Context)
  const [message, setMessage] = useState()
  const [conversation, setConversation] = useState([])

  const getMessageAndC = (mgs)=>{
    setMessage(mgs)
  }
  const Con = (c)=>{
    setConversation(c)
  }
  
  return (
    user ?
    <div className='home'>
      <div className="homeContainer">
        <div className="appname">MChat</div>
        <Oldconversation getMgsfromOdlconversation= {getMessageAndC} Con = {Con}/>
        <Message messageDisplay = {message} conversation = {conversation}/>
      </div>
    </div> : <Login />
  )
}

export default Home