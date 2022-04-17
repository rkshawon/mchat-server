import axios from 'axios'
import './oldconversation.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'
import { Context } from '../../context/AuthContext';
import profile from '../avater.jpg'

function Oldfriendlist({c, userid}) {
    const socketRef = useRef()
    const [friend, setFriend] = useState({})
    const [onlineUser, setOnlineUser] = useState()
    const {user} = useContext(Context)


    useEffect(()=>{
        socketRef.current = io()
        socketRef.current.emit('sendUserData',{
          user
        })// eslint-disable-next-line react-hooks/exhaustive-deps
      },[])

    useEffect( ()=>{
        const frnd = c.members.find(m=> m!==userid)
        //console.log(frnd, "fdfd");
        const getUser = async ()=>{
            const getFriendinfo = await axios.get('https://mchat-api.herokuapp.com/auth/'+frnd)
            //console.log("fdata",getFriendinfo.data);
            setFriend(getFriendinfo.data)
        }
        getUser()

        socketRef.current.on("userList", userList =>{
            //console.log('add',userList);
            setOnlineUser(userList)
          })
          socketRef.current.on("filteredUsers", filterList=>{
            //console.log('dis',datalist);
            setOnlineUser(filterList)
          })
    },[userid,c])

   

  return (
      <div className="namepic">
          <img src={profile} className={onlineUser?.some((ou) => ou.uid === friend._id ) ? "onlineUser" : 'pic'}/>
          <div className="friendsname">{friend?.name}</div>
      </div>
  )
}

export default Oldfriendlist