import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './register.css'

function Register() {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  let navigate = useNavigate();
  const [errorMessageName, setErrorMessageName] = useState('')
  const [errorMessageEmail, setErrorMessageEmail] = useState('')
  const [errorMessagePass, setErrorMessagePass] = useState('')
  const [errorMessagePass2, setErrorMessagePass2] = useState('')
  let ename, eemail, epass, epass2 = true

  const nameCheck = ()=>{
    const validateName=()=>{
      if(String(name.current.value).match(/^[a-zA-Z\-]+$/))
        return true
      else
        return false
    }

    if(!validateName()){
      ename = true
      setErrorMessageName("Only Characters A-Z, a-z and '-' are  acceptable.")
    }
    else{
      ename = false
      setErrorMessageName("")
    }

  }
  const emailCheck = ()=>{
    const validateEmail = () => {
      if(String(email.current.value).match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ))
        return true
      else
        return false
    };
   
    if(!validateEmail()){
      eemail = true
      setErrorMessageEmail("Email is not valid")
    }
    else{
      eemail = false
      setErrorMessageEmail("")
    }
  }
  const passCheck = ()=>{
    if(password.current.value?.length <6){
      epass = true
      setErrorMessagePass("Password can not be less than 6 character")
    }
    else{
      epass = false
      setErrorMessagePass("")
    }
  }
  const pass2Check = ()=>{
    if(password.current.value === confirmPassword.current.value){
      epass2 = false
      setErrorMessagePass2("")
    }
    else{
      epass2 = true
      setErrorMessagePass2("Password does not match")
    }
  }

  const formValidation = ()=>{
    if(name.current.value ===''){
      ename = true
      setErrorMessageName("Name can not be empty")
    }
    else{
      nameCheck()
    }
    
  
    if(email.current.value ===''){
      eemail = true
      setErrorMessageEmail("Email can not be empty")
    }
    else{
      emailCheck()
    }
      
    
    if(password.current.value ===''){
      epass = true
      setErrorMessagePass("Password can not be empty")
    }
    else{
      passCheck()
    }
    
    if(confirmPassword.current.value ===''){
      epass2  =true
      setErrorMessagePass2("Confirm Password can not be empty")
    }
    else{
      pass2Check()
    }
  }


  const errorContainer = ()=>{
    if(ename || eemail || epass || epass2)
      return true
    else
      return false
  }
  const handleRegisterClick = async  (e)=>{
    e.preventDefault()
    const userInfo = {
      name: name.current.value,
      email: email.current.value,
      password: password.current.value
    }

    formValidation()
    if(!errorContainer()){
      const reg = await axios.post('https://mchat-api.herokuapp.com/auth/register', userInfo)
      reg && navigate('/login')
    }
  }

  return (
    <div className='registerContainer'>
        <div className='registerSection'>
            <h2>Register</h2>
            <input type = 'text' placeholder='Enter Name' className='inputname' ref = {name}/>
              <small >{errorMessageName}</small>
            <input type = 'text' placeholder='Enter Email' className='inputemail' ref = {email}/>
              <small >{errorMessageEmail}</small>
            <input type = "text" placeholder='Enter Password' className='inputpass' ref = {password}/>
              <small >{errorMessagePass}</small>
            <input type = "text" placeholder='Confirm Password' className='inputpass2' ref = {confirmPassword}/>
              <small >{errorMessagePass2}</small>
            <button className='registerBtn' onClick={handleRegisterClick}>Register</button>
            <div className="logintoaccount">
            <Link to ='/login'>Already Member? Login</Link>
          </div>
        </div>
    </div>
  )
}

export default Register