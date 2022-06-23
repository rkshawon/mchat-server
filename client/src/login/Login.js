import React, { useContext, useRef, useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../context/AuthContext';

function Login() {
  const email = useRef();
  const password = useRef();
  const {dispatch} = useContext(Context);
  let navigate = useNavigate();
  const [errorMessageEmail, setErrorMessageEmail] = useState('')
  const [errorMessagePass, setErrorMessagePass] = useState('')
  const [serverError, setServerError] = useState('')
  let eemail, epass = true


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

  const formValidation = ()=>{
    if(email.current.value ===''){
      eemail = true
      setErrorMessageEmail("Email can not be empty")
    }
  else
    emailCheck()
  
    if(password.current.value ===''){
      epass = true
      setErrorMessagePass("Password can not be empty")
    }
  else
    passCheck()
  }

  const errorContainer = ()=>{
    if(eemail || epass)
      return true
    else
      return false
  }

  const handleLoginClick = async  (e)=>{
    e.preventDefault()
    formValidation()
    dispatch({ type: "LOGIN_START" });
    try {
      if(!errorContainer()){
      const res = await axios.post("https://mchat-api.herokuapp.com/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      res.data && navigate('/')
    }
    } catch (err) {
      setServerError("Username or password not valid")
      dispatch({ type: "LOGIN_FAILURE" });
    }
  }
  return (
    <div className='loginContainer'>
        <div className='loginSection'>
            <h2>Login</h2>
            <input type = 'text' placeholder='email' className='userinput' ref = {email}
              onClick= {()=>{setErrorMessageEmail(''); setServerError('')}}/>
            <small >{errorMessageEmail}</small>
            <input type = "password" placeholder='password' className='passinput' ref = {password}
              onClick= {()=>{setErrorMessagePass(''); setServerError('')}}/>
            <small >{errorMessagePass}</small>
            <button className='loginBtn' onClick={handleLoginClick} >Login</button>
          <div className="createNewid">
            <Link to ='/register'>Create New Account</Link>
            <small className="small">{serverError}</small>
          </div>
        </div>
    </div>
  )
}

export default Login