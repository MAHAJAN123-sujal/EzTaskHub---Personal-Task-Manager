import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../contexts/UserContext'
import axiosInstance from '../utils/axiosInstance'
import {Loader}  from 'lucide-react'

const Profile = () => {
  const [missedTasks,setMissedTasks] = useState(0)
  const [completedTasks,setCompletedTasks] = useState(0)
  const [pendingTasks,setPendingTasks] = useState(0)
  const [coins,setCoins] = useState(0)
  const [quote,setQuote] = useState("")
  const [summary,setSummary] = useState("")
  const [fetchingMotivation,setFetchingMotivation] = useState(false)
  const [fetchingSummary,setFetchingSummary] = useState(false)
  const {user} = useContext(UserContext)||{}

  useEffect(()=>{
    const getMotivation = async() =>{
      try{
        setFetchingMotivation(true);
        const res = await axiosInstance.get('/user/motivation')
        setFetchingMotivation(false);
        if(res.data.success){
          setQuote(res.data.motivation)
        }
      }
      catch(error){
        setQuote("Hard Work is key to success")
        console.log(error);
      }
    }
    const getSummary = async() =>{
      try{
        setFetchingSummary(true);
        const res = await axiosInstance.get('/user/summary')
        setFetchingSummary(false);
        if(res.data.success){
          setMissedTasks(res.data.missedTasks)
          setPendingTasks(res.data.pendingTasks)
          setCompletedTasks(res.data.completedTasks)
          setCoins(res.data.coins)
          setSummary(res.data.summary)
        }
      }
      catch(error){
        setSummary("Well Done, You are progressing. You are doing tasks on regular basis. You are an achiever")
        console.log(error);
      }
    }
    getMotivation()
    getSummary();
  },[user])
  return (
    <div className='flex flex-col md:pd-10 pd-7 gap-4 md:gap-8 items-center justify-center my-5'>
      <div className=" flex flex-col md:flex-row gap-4 md:gap-8 items-center">
        <div className="border border-purple-900 bg-purple-500 font-serif rounded-xl p-8 flex flex-col gap-3 text-white md:max-w-96">
          <h1 className="text-3xl text-center">Motivation for the hour</h1>
          <div className='border-2 border-white-t my-2'/>
          {fetchingMotivation ? (
            <div className="flex items-center justify-center text-xl">
              <Loader className='size-6 animate-spin'/>
              <p className="text-gray-800">Loading Motivation</p>
            </div>
          ):(
            <p className="text-lg">{quote}</p>
          )
          }
        </div>

        <div className="border border-blue-800 bg-blue-200 text-yellow-600 font-serif rounded-xl p-8 flex flex-col gap-1">
          <h1 className="text-3xl text-center ">Hello, {user?.name||'Guest'}</h1>
          <div className='border-2 border-white-t my-2'/>
          <p className="text-xl">Pending Tasks: {pendingTasks}</p>
          <p className="text-xl">Missed Tasks: {missedTasks}</p>
          <p className="text-xl">Completed Tasks: {completedTasks}</p>
          <p className="text-4xl text-yellow-500">Coins rewarded: {coins}</p>
        </div>
      </div>

      <div className="md:w-2/3 bg-gray-700 border-gray-900 rounded-xl p-5 text-white font-serif">
          <h1 className="text-2xl text-center">Your Summary</h1>
          <div className='border-2 border-white-t my-2'/>
          {fetchingSummary ? (
            <div className="flex items-center justify-center text-xl">
              <Loader className='size-6 animate-spin'/>
              <p className="text-gray-800">Loading Summary</p>
            </div>
          ):(
            <p className="text-2xl">{summary}</p>
          )
          }
      </div>
    </div>
  )
}

export default Profile
