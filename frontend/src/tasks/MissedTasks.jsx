import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { CircleOff, Loader } from 'lucide-react';
import ReadOnlyTaskBox from '../components/ReadOnlyTaskBox'
import CategoryFilter from '../components/CategoryFilter';
import SortByDeadline from '../components/SortByDeadline';

const MissedTasks = () => {
  const [tasks,setTasks] = useState([])
  const [isFetchingTasks,setIsFetchingTasks] = useState(false);
  const [filteredTasks,setFilteredTasks] = useState([]);
  const [sortedTasks,setSortedTasks] = useState([]);

  const fetchingTasks = async(status) =>{
    try{
        setIsFetchingTasks(true)
        const res = await axiosInstance.post('/task/fetch-task-byStatus',{status:status});
        // console.log(res);
        if(res.data.success){
          setTasks(res.data.tasks)
        }
      }
      catch(error){
        console.log(error);
      }
      finally{
        setIsFetchingTasks(false)
      }
  }

  useEffect(()=>{
    fetchingTasks('missed')
  },[])

   const handleSetFilteredTasks = useCallback((filteredTasks)=>{
        setFilteredTasks(filteredTasks)
        setSortedTasks(filteredTasks)
      },[])
      const handleSetSortedTasks = useCallback((sortedTasks)=>{
        setSortedTasks(sortedTasks)
      },[])
  return (
    <div className='relative p-6 md:p-10'>
      <div className="flex flex-col md:flex-row md:justify-between">
        <CategoryFilter tasks={tasks} onFilter={handleSetFilteredTasks}/>
        <SortByDeadline tasks={filteredTasks} onFilter={handleSetSortedTasks}/>
      </div>
        

      <div className="mt-5 border-t-2 border-black"/>

      {!isFetchingTasks ?(
        <div className="flex flex-col gap-2">
          {sortedTasks.length>0 ?(
            sortedTasks.map((task) =>(
              <ReadOnlyTaskBox key={task._id} task={task} fetchingTasks={fetchingTasks} status='missed'/>
            ))
          ):(
            <div className="flex items-center justify-center gap-2">
              <CircleOff className='size-6'/>
              <p className='text-3xl text-gray-800'>No Missed tasks</p>
            </div>
          )}
        </div>
      ):(
        <div className="flex flex-col gap-2">
          <Loader className='size-6 animate-spin'/>
          <p className='text-3xl text-gray-800'>Loading Tasks</p>
        </div>
      )}
    </div>

  )
}

export default MissedTasks
