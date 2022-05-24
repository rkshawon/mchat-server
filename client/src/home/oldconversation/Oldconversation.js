import { Context } from '../../context/AuthContext';
import './oldconversation.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
import Oldfriendlist from './Oldfriendlist';
import {BiConversation} from "react-icons/bi"


function Oldconversation({getMgsfromOdlconversation, Con, menuOnOff}) {
  const [conversation, setConversation] = useState([])
  const [chat, setChat] = useState()
  const [newUser, setNewUser] = useState()
  const {user} = useContext(Context)
  const socketRef = useRef()

  useEffect(()=>{
    socketRef.current = io()
    socketRef.current.emit('sendUserData',{
      user
    })
    socketRef.current.emit("newUser", {
      newUser: false
    })
    socketRef.current.on("newuser",(newuser)=>{
      setNewUser(newuser)
    })


    const getallUsers = async ()=>{
      const getalluser = await axios.get("https://mchat-api.herokuapp.com/allusers")
      const owninfo = await axios.get("https://mchat-api.herokuapp.com/allusers/"+user._id)
      getalluser.data.map( async u =>{
        const startConversation = {
          senderId: user._id,
          receiverId: u._id
        }
        owninfo.data.firstTime && user._id !== u._id && await axios.post("https://mchat-api.herokuapp.com/conversation", startConversation)
      })
      await axios.put("https://mchat-api.herokuapp.com/allusers/"+user?._id)
    }
    getallUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    socketRef.current.emit("sendId",user?._id)
    socketRef.current.on("getUsers", users=>{
    })
  },[user])

  useEffect(()=>{
    let now = new Date().getTime()
    const getConversation = async ()=>{

    if(new Date().getTime() - now > 2000){
      clearInterval(getConversation);
      return
    }
     const res = await axios.get('https://mchat-api.herokuapp.com/conversation/'+user?._id)
     setConversation(res.data)
   }
   setInterval(getConversation, 500)
  },[user?._id])

  useEffect(()=>{
    const getConversation = async ()=>{
     const res = await axios.get('https://mchat-api.herokuapp.com/conversation/'+user?._id)
     setConversation(res.data)
   }
   setTimeout(getConversation, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newUser])

  useEffect(()=>{
    const getMessage = async ()=>{
      const mgs = await axios.get("https://mchat-api.herokuapp.com/message/"+chat?._id)
      getMgsfromOdlconversation(mgs.data)
    }
    getMessage()
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[chat])

  return (
    <div className={menuOnOff === true?'oldconversation':'oldconversation menuHide'}>
      <div className='oldconversationheader'>
        <BiConversation className='conicon'/>
        <h3>Friends</h3>
      </div>
      <div className="conversationContainer">
        {conversation.map((c, index)=>{
         return(
         <div key={index} onClick={()=>{setChat(c); Con(c) }}>
            <Oldfriendlist c={c} userid = {user._id}/>
          </div>
         )
        })}
        </div>
      </div> 
  )
}

export default Oldconversation