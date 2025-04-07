import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-hot-toast'

const Regsiter = () => {
  const [data,setData] = useState({
    name:"",
    email:"",
    password:""
  })
  const navigate = useNavigate()

  const handleRegister = async(e) =>{
    e.preventDefault();
    console.log('button clicked');

    try{
      const res = await axiosInstance.post('/user/register',data);
      console.log(res.data.message);
      if(res.data.success){
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
    <div className="bg-gradient-to-r from-gray-800 to-gray-200 min-h-screen flex items-center justify-center">
      <div className="lg:h-1/2 ">
        <div className="min-w-full bg-gray-500 flex flex-col gap-8 items-center justify-center border-2 border-white rounded-xl shadow-xl md:p-20 xs:p-10 p-5">
          <h1 className="text-center text-3xl font-bold my-2 text-white font-serif">Register Page</h1>

          <form onSubmit={handleRegister}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor='name'>Name</label>
                  <input type='name' id='name' className='rounded-lg outline-none p-2' value={data.name} placeholder="Enter your name" onChange={(e)=>setData({...data, name:e.target.value})}/>
                </div>

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
                <button type='submit' className='rounded-lg p-2 text-xl bg-gray-700 text-white hover:bg-gray-900 w-full'>Register</button>
              </div>

          </form>

          <div className="text-md flex gap-1">
            <p className='text-black'>Account have an account,</p>
            <button type='button' onClick={()=> navigate('/login')} className="text-blue-900 hover:text-white text-lg">Login Here</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Regsiter
