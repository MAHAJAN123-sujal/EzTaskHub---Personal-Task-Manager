import React, { useState } from 'react'
import {Loader} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

const OtpVerify = ({email}) => {
const [otp,setOtp] = useState("");
const [verifyOtp,setVerifyOtp] = useState(false)
const [verifyingOtp,setVerifyingOtp] = useState(false)
const navigate = useNavigate()

  const handleVerifyOtp = async(e) =>{
    e.preventDefault()
    setVerifyOtp(true)
    setVerifyingOtp(true)
    try{
      const res = await axiosInstance.post('/user/otp-verify',{email,otp})
      setVerifyingOtp(false);
      if(res.data.success){
        toast.success(res.data.message);
        sessionStorage.setItem('reset-token',res.data.token)
        navigate('/reset-password')
      }
    }
    catch(error){
      console.log(error)
      toast.error(error.response.data.message);
      setVerifyOtp(false)
      return;
    }
  }
  return (
    <div className='flex flex-col gap-5'>
      <div className="my-5 border-t border-gray-100"/>
      <h1 className="text-center text-3xl font-bold my-2 text-white font-serif">Verify OTP</h1>
      
      <form onSubmit={handleVerifyOtp}>
            <div className="flex flex-col gap-1">
              <label htmlFor='email' className='text-white text-lg'>Enter OTP</label>
              <input type='text' id='otp' className='rounded-lg outline-none p-2' value={otp}placeholder="Enter OTP" onChange={(e)=>setOtp(e.target.value)}/>
            </div>


          <div className="my-6 flex items-center justify-center flex-col gap-1">
            <button type='submit' className={`${(!verifyOtp)?'rounded-lg p-2 text-xl bg-orange-800 text-white hover:bg-orange-600 w-full':`${verifyingOtp?'bg-orange-400 cursor-none rounded-lg p-2 text-xl text-white w-full':`bg-green-500 cursor-none rounded-lg p-2 text-xl text-white w-full`}`}`} disabled={verifyOtp}>
                {(!verifyOtp) && 
                <p>Verify OTP</p>
                }
                {(verifyOtp && verifyingOtp) && 
                  <div className="flex gap-3">
                    <Loader className='size-4 animate-spin'/>
                    <p>Verifying OTP</p>
                  </div>
                }
                {(verifyOtp && !verifyingOtp) &&
                <p>Verified OTP</p>
                }
            </button>
          </div>
      </form> 
    </div>
  )
}

export default OtpVerify
