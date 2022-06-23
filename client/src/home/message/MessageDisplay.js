import React from 'react'
import Time from 'react-time-format'
import './messagedisplay.css'

function MessageDisplay({singlemgs, user}) {
  
  return (
      <div className="messagebox">
        <span className={singlemgs.senderId !== user._id ? "mgs" : "ownmgs"}>{singlemgs.text} </span>
        <div className="time">
          <Time value={singlemgs.createdAt} format="YYYY/MM/DD hh:mm" />
        </div>
      </div>
  )
}

export default MessageDisplay