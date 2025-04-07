import React, { useState, useEffect, useCallback } from 'react'
import CreateTaskForm from '../components/CreateTaskForm'
import {CirclePlus,CircleOff,Loader} from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import EditableTaskBox from '../components/EditableTaskBox'
import CategoryFilter from '../components/CategoryFilter'
import SortByTimeRemaining from '../components/SortByTimeRemaining'

const PendingTasks = () => {
  const [openDialog,setOpenDialog] = useState(false)
  const [isFetchingTasks,setIsFetchingTasks] = useState(false)
  const [tasks,setTasks] = useState([])
  const [filteredTasks,setFilteredTasks] = useState([])
  const [sortedTasks,setSortedTasks] = useState([])

  useEffect(()=>{
    const handleEsc = (event)=>{
      if(event.key ==="Escape"){
        setOpenDialog(false);
      }
    }

    document.addEventListener('keydown',handleEsc)
    return () => document.removeEventListener('keydown',handleEsc)
  },[])
  
  
  const fetchingTasks = async() =>{
    try{
      setIsFetchingTasks(true)
      const res = await axiosInstance.post('/task/fetch-task-byStatus',{status:'pending'});
      // console.log(res);
      if(res.data.success){
        setTasks(res.data.tasks)
        setFilteredTasks(res.data.tasks)
        setSortedTasks(res.data.tasks)
      }
      setIsFetchingTasks(false)
    }
    catch(error){
      console.log(error);
    }
  }
  useEffect(()=>{
    fetchingTasks()
  },[])


  const handleSetSortedTasks = useCallback((sortedTasks) =>{
    setSortedTasks(sortedTasks);
  },[])
  const handleSetFilteredTasks = useCallback((FilteredTasks) =>{
    setFilteredTasks(FilteredTasks)
    setSortedTasks(FilteredTasks);
  },[])
  return (
    <div className='relative p-6 md:p-10'>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:justify-between">
          <CategoryFilter tasks={tasks} onFilter={handleSetFilteredTasks}/>
          <button className="text-white bg-black border-gray-400 hover:bg-gray-800 flex gap-1 p-3 items-center justify-center rounded-xl" onClick={() => setOpenDialog(true)}>
            <CirclePlus className='size-4'/>
            <p className='text-lg'>New Task</p>
          </button>
        </div>
        <SortByTimeRemaining tasks={filteredTasks} onFilter={handleSetSortedTasks}/>
      </div>

      <div className="mt-5 border-t-2 border-black"/>

      {!isFetchingTasks ?(
        <div className="flex flex-col gap-2">
          {sortedTasks.length>0 ?(
            sortedTasks.map((task) =>(
              <EditableTaskBox key={task._id} task={task} fetchingTasks={fetchingTasks} />
            ))
          ):(
            <div className="flex items-center justify-center gap-2">
              <CircleOff className='size-6'/>
              <p className='text-3xl text-gray-800'>No Pending tasks</p>
            </div>
          )}
        </div>
      ):(
        <div className="flex flex-col gap-2">
          <Loader className='size-6 animate-spin'/>
          <p className='text-3xl text-gray-800'>Loading Tasks</p>
        </div>
      )}

      {openDialog && (
        <div className="fixed flex items-center justify-center inset-0 shadow-lg  bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-gradient-to-b from-gray-500 to-white p-8 shadow-xl rounded-xl md:w-96 w-52 flex flex-col gap-3">
            <div className="flex justify-end">
              <button className='w-8 font-semibold text-xl hover:text-2xl' onClick={()=> setOpenDialog(false)}>X</button>
            </div>
            <CreateTaskForm fetchingTasks={fetchingTasks} onClose={()=> setOpenDialog(false)}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingTasks
