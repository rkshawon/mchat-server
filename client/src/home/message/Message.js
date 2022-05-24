import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'
import { Context } from '../../context/AuthContext';
import './message.css'
import MessageDisplay from './MessageDisplay'
import {BiSend, BiMenu} from "react-icons/bi"
import {FiLogOut} from "react-icons/fi"
import {CgProfile} from "react-icons/cg"

function Message({messageDisplay, conversation, openMenu}) {
  const [singleMgs, setSingleMgs] = useState([])
  const {user} = useContext(Context)
  const [text, setText] = useState('')
  const [activeUser, setActiveUser] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const socketRef = useRef()
  const scrollRef = useRef()
  const idToSend = conversation?._id

  const mgstoDisplay = conversation?.members?.find(f=> f !== user._id)

  useEffect(()=>{
    setSingleMgs(messageDisplay);
  },[messageDisplay])

  useEffect(()=>{
    socketRef.current = io()
    socketRef.current.on("getMessage", (data) =>{
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        recieverId: data.recieverId,
        receiverSocketId: data.receiverSocketId
      })
    })
  },[])

  useEffect(()=>{
    arrivalMessage && arrivalMessage.recieverId === user._id && mgstoDisplay === arrivalMessage?.sender &&
    setSingleMgs([...singleMgs, arrivalMessage])
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[arrivalMessage])
useEffect(()=>{
  const getOnscreenUserinfo = async ()=>{
    if(mgstoDisplay){
      const onScreenUser = await axios.get('https://mchat-api.herokuapp.com/auth/' + mgstoDisplay)
        setActiveUser(onScreenUser.data)
    }
  }
  getOnscreenUserinfo()
},[mgstoDisplay])

  const logOut = ()=>{
    localStorage.clear();
    //dispatch({type: "LOGOUT"})
  }
  const reciever = conversation.members?.find(m=> m !== user._id)
  const sendMessage = async ()=>{
    if(text.length > 0 && activeUser){
      const messageToSend = {
        conversationId: idToSend,
        senderId: user._id,
        text: text
      }
      socketRef.current.emit("sendMessage",{
        senderId: user._id,
        recieverId: reciever,
        text:text
      })
        await axios.post("https://mchat-api.herokuapp.com/message", messageToSend)
        setSingleMgs([...singleMgs, messageToSend])
        setText('')
    }
  }
    useEffect(()=>{
      scrollRef?.current?.scrollIntoView()
    },[text, singleMgs])

  return ( 
      <div className="messageContainer">
        <div className="username">
          <div className='name'> <BiMenu onClick={openMenu}  className="menu"/> <CgProfile/> <div> {activeUser.name}</div></div>
          <a href ="/login" style={{ color:'inherit', textDecoration:'inherit'}}><div className='logout' onClick={logOut}><FiLogOut size="1.5em" /></div></a>
       </div>
        <div className="messagefield">
         {singleMgs &&
           singleMgs.map((smgs, index)=>{
             return(
              <div  key={index} ref={scrollRef} className={smgs.senderId === user._id ? "owntextmessage" : "textmessage"}>
                <MessageDisplay  singlemgs = {smgs} user={user}/>
              </div>
              )
           }) 
         }
         {activeUser?.name?.length? '': <h1>Start Conversation</h1>}
        </div>
        <div className="footer">
          <textarea className='textarea' value={text} onChange={(e)=>setText(e.target.value)} placeholder = "Write your message"
          onKeyDown= {(e)=>{
            if(e.key==="Enter"){
              e.preventDefault()
              sendMessage()
          }}} 
          ></textarea>
          <button className="button" onClick={sendMessage}> <BiSend className='bicon' />
          </button>
        </div>
      </div>
  )
}
export default Message