import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-hot-toast'

const LoginPage = () => {
  const [data,setData] = useState({
    email:"",
    password:""
  })
  const navigate = useNavigate()

  const handleLogin = async(e) =>{
    e.preventDefault();
    console.log('button clicked');
    try{
      const res = await axiosInstance.post('/user/login',data);
      // console.log(res);
      if(res.data.success){
        localStorage.setItem('token',res.data.token);
        toast.success(res.data.message)
        navigate('/pending-tasks');
      }
      else{
        toast.error(res.data.message)
        return;
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message)
      return;
    }
  }
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-200 min-h-screen flex items-center justify-center">
      <div className="lg:h-1/2 ">
        <div className="min-w-full bg-gray-500 flex flex-col gap-8 items-center justify-center border-2 border-white rounded-xl shadow-lg md:p-20 xs:p-10 p-5">
          <h1 className="text-center text-3xl font-bold my-2 text-white font-serif">Login Page</h1>

          <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor='email'>Email</label>
                  <input type='email' id='email' className='rounded-lg outline-none p-2' value={data.email} placeholder="Enter your email" onChange={(e)=>setData({...data, email:e.target.value})}/>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor='password'>Password</label>
                  <input type='password' id='password' className='rounded-lg outline-none p-2' value={data.password} placeholder="********" onChange={(e)=>setData({...data, password:e.target.value})}/>
                </div>
              </div>

              <div className="my-6 flex items-center justify-center">
                <button type='submit' className='rounded-lg p-2 text-xl bg-gray-700 text-white hover:bg-gray-900 w-full'>Login</button>
              </div>

          </form>

        <div className="flex-col gap-2">

          <div className="text-md flex gap-1 mb-2">
            <p className='text-black'>Account not Cretaed yet,</p>
            <button type='button' onClick={()=> navigate('/register')} className="text-blue-900 hover:text-white text-lg">Register Here</button>
          </div>
          <div className="text-md flex gap-1">
            <p className='text-black'>Forgot Password, Click to </p>
            <button type='button' onClick={()=> navigate('/forgot-password')} className="text-red-900 hover:text-white text-lg">Reset Password</button>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
