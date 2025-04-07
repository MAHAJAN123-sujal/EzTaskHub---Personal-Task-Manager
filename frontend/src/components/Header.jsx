import React, { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import {CircleUserRound, LogOutIcon} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-hot-toast'

const Header = () => {
  const navigate = useNavigate()
  const {user} = useContext(UserContext) || {}

  const handleLogout = async(e) =>{
    e.preventDefault()
    try{
      localStorage.removeItem('token');
      const res = await axiosInstance.post('/user/logout');

      if(res.data.success){
        localStorage.removeItem('token');
        toast.success(res.data.message);
        navigate('/login');
      }
    }
    catch(error){
      console.log(error);
      toast.error(error.response.data.message)
    }

  }
  return (
    <div className='w-full flex p-5 md:justify-between bg-black text-white font-serif md:flex-row flex-col'>
      <div className="flex gap-2 md:gap-4 justify-center itmes-center">
        <button className='text-xl hover:border-b-2 hover:border-white p-2' onClick={()=>navigate('/pending-tasks')}>Pending Tasks</button>
        <button className='text-xl hover:border-b-2 hover:border-white p-2' onClick={()=>navigate('/missed-tasks')}>Missed Tasks</button>
        <button className='text-xl hover:border-b-2 hover:border-white p-2' onClick={()=>navigate('/completed-tasks')}>Completed Tasks</button>
      </div>
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-xl border-b border-white rounded-xl p-4">Hi,{user?.name || 'user'}</h1>
        <button onClick={()=>navigate('/profile')} className='text-2xl'>
          <CircleUserRound className='size-6'/>
        </button>

        <button onClick={handleLogout} className='border-2 border-white bg-red-700 text-white p-2 rounded-xl hover:bg-white hover:text-red-700 hover:border-red-700 font-serif flex gap-1 items-center justify-center'>
          <p className="text-xl ">Logout</p>
          <LogOutIcon className='size-4'/>
        </button>

      </div>
    </div>
  )
}

export default Header
