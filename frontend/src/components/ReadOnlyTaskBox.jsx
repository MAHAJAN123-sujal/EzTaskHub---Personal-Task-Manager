import React,{useState} from 'react'
import axiosInstance from '../utils/axiosInstance'
import {toast} from 'react-hot-toast'
import { Trash } from 'lucide-react';

const ReadOnlyTaskBox = ({task,fetchingTasks,status}) => {
    const [openDialogBox,setOpenDialogBox] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);
    
    const handleDeleteTask = async() =>{
        try{
            const res = await axiosInstance.delete(`/task/delete-task/${task._id}`)
            
            if(res.data.success){
                toast.success(res.data.message);
                fetchingTasks(status)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
  return (
    <div className={`flex flex-col gap-1 rounded-xl shadow-xl  p-4 md:p-8 relative my-2 ${(task.status==='missed')?'bg-blue-500':'bg-green-500'}`}>
            <div className="flex justify-between items-center">
                <div className="flex-col gap-0.5">
                    <h1 className="text-4xl text-white font-serif">{task.name}</h1>
                    <p className="flex gap-1 text-md text-red-800">Category: {task.category}</p>
                </div>
    
                <button className='flex items-center justify-center rounded-xl gap-1 p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white' 
                onClick={()=> {
                    setIsDeleting(true)
                    setOpenDialogBox(true)
                }}>
                    <Trash className='size-4'/>
                    <p className="text-xl font-semibold font-serif">Delete</p>
                </button>
            </div>
    
            <div className="flex justify-between items-center">
                {(task.status==='missed') ?(
                    <div className="flex gap-1 items-center justify-center">
                        <h1 className="text-2xl ">Task deadline:</h1>
                        <div className="flex items-center justify-center gap-1">
                        <h1 className="text-xl">{task.deadline.split('T')[0]}</h1>
                        <h1 className="text-md">{(task.deadline.split('T')[1]).split('.')[0]}</h1>
                        </div>
                    </div>

                ):(
                    <div className="flex gap-1 items-center justify-center">
                        <h1 className="text-2xl ">Task Completed At:</h1>
                        <div className="flex items-center justify-center gap-1">
                            <h1 className="text-xl">{task.completedAt.split('T')[0]}</h1>
                            <h1 className="text-md">{(task.completedAt.split('T')[1]).split('.')[0]}</h1>
                        </div>
                    </div>
                )}
            </div>
    
            {openDialogBox && (
                <div className="fixed flex items-center justify-center inset-0 shadow-lg  bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-gray-300 p-8 shadow-xl rounded-xl md:w-96 w-52 flex flex-col gap-3">
                        
    
                        {isDeleting && (
                        <>
                            <h1 className="text-xl font-semibold text-center">Do you really want to Delete Task?</h1>
                            <div className="flex justify-between items-center">
                                <button className='p-3 rounded-xl bg-red-700 text-white hover:bg-white hover:text-red-700' 
                                onClick={()=> {
                                    handleDeleteTask()
                                    setIsDeleting(false)
                                    setOpenDialogBox(false)
                                }}>
                                    Delete
                                </button>
                                <button className='p-3 rounded-xl bg-black text-white hover:bg-gray-900' 
                                onClick={()=> {
                                    setIsDeleting(false)
                                    setOpenDialogBox(false)
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </>
                        )}
    
                        
                    </div>
                </div>
            )}
        </div>
  )
}

export default ReadOnlyTaskBox
