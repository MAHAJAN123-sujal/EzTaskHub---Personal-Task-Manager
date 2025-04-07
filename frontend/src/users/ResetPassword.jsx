import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-hot-toast'
const ResetPassword = () => {
  const [data,setData] = useState({
      email:"",
      password:""
    })
    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
      e.preventDefault();
      try{
        const res = await axiosInstance.post('/user/reset-password',data);
        if(res.data.success){
          sessionStorage.removeItem('reset-token');
          toast.success(res.data.message)
          navigate('/login');
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
    <div className="relative bg-gradient-to-b from-black to-gray-200 min-h-screen flex items-center justify-center">
        <div className="relative bg-gray-600 flex flex-col gap-8 items-center justify-center border-2 border-gray-900 rounded-xl shadow-lg md:p-20 xs:p-10 p-5">
          <h1 className="text-center text-3xl font-bold my-2 text-white font-serif">Reset Password</h1>

          <form onSubmit={handleSubmit}>
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
                <button type='submit' className='rounded-lg p-2 text-xl bg-orange-700 text-white hover:bg-gray-900 w-full'>Reset</button>
              </div>

          </form>
      </div>
    </div>
  )
}

export default ResetPassword
