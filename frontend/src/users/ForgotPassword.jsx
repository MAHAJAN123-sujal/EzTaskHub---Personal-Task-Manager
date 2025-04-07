import React, { useEffect, useState } from 'react'
import OtpVerify from './OtpVerify'
import {Loader} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email,setEmail] = useState("");
  const [sendOtp,setSendOtp] = useState(false);
  const [sendingOtp,setSendingOtp] = useState(false);
  const [timer,setTimer] = useState(30);
  const [success,setSuccess]=useState(false);

  const handleSetOtp = async(e) =>{
    e.preventDefault();

    if(!email){
      toast.error('Enter Email');
      return;
    }
    setSendOtp(true);
    setSendingOtp(true);
    setTimer(30);

    try{
      const res = await axiosInstance.post('/user/forgot-password',{email});
      setSendingOtp(false)
      if(res.data.success){
        setSuccess(true);
        console.log(success);
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data.message)
        setSendOtp(false);
        return;
      }
    }
    catch(error){
      console.log(error);
      toast.error(error.response.data.message)
      setSendOtp(false);
      return;

    }
    setTimeout(()=>{
      setSendOtp(false)
      setSendingOtp(false)
    },30000)
  }

  useEffect(()=>{
    if(sendOtp && timer>0){
      const interval = setInterval(()=>{
        setTimer((prev)=> prev-1)
      },1000)

      return ()=> clearInterval(interval)
    }
  },[sendOtp ,timer])
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-gray-400">
      <div className="relative bg-gray-700 font-serif flex flex-col gap-5 p-5 md:pd-10 xl:pd-18 border-2 border-gray-600 rounded-xl">
        <h1 className="text-center text-3xl font-bold my-2 text-white font-serif">Reset Password</h1>

        <form onSubmit={handleSetOtp}>
              <div className="flex flex-col gap-1">
                <label htmlFor='email' className='text-white text-lg'>Enter your Email</label>
                <input type='email' id='email' className='rounded-lg outline-none p-2' value={email}placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/>
              </div>


            <div className="my-6 flex items-center justify-center flex-col gap-1">
              <button type='submit' className={`${(!sendOtp)?'rounded-lg p-2 text-xl bg-orange-800 text-white hover:bg-orange-600 w-full':`${sendingOtp?'bg-orange-400 cursor-none rounded-lg p-2 text-xl text-white w-full':`bg-green-500 cursor-none rounded-lg p-2 text-xl text-white w-full`}`}`} disabled={sendOtp}>
                  {(!sendOtp) && 
                  <p>Send OTP</p>
                  }
                  {(sendOtp && sendingOtp) && 
                    <div className="flex gap-3">
                      <Loader className='size-4 animate-spin'/>
                      <p>Sendind OTP</p>
                    </div>
                  }
                  {(sendOtp && !sendingOtp) &&
                  <p>Sent OTP</p>
                  }
              </button>
              {sendOtp && 
                <h1 className="text-gray-200 text-md">Resend OTP in {timer} secs</h1>
              }
            </div>
        </form> 

        {success && <OtpVerify email={email}/>}
      </div>
    </div>
  )
}

export default ForgotPassword
