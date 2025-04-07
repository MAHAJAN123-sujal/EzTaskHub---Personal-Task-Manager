import React, { useEffect, useState } from 'react'
import {Edit,Trash,CheckCheck} from 'lucide-react'
import {toast} from 'react-hot-toast'
import axiosInstance from '../utils/axiosInstance'

const EditableTaskBox = ({task,fetchingTasks}) => {
    const [editData,setEditData] = useState({
        name:task.name,
        category:task.category,
        deadline:task.deadline
    })
    const categories = ['sports','academics','work','personal','other']
    const [date,setDate] = useState(new Date(task.deadline).toISOString().split('T')[0])
    const [hours,setHours] = useState(new Date(task.deadline).getHours())
    const [minutes,setMinutes] = useState(new Date(task.deadline).getMinutes())
    const [timeLeft,setTimeLeft] = useState({
        years:0,
        months:0,
        days:0,
        hours:0,
        mins:0,
        secs:0
    });
    const [openDialogBox,setOpenDialogBox] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);
    const [isMarkingCompleted,setIsMarkingCompleted] = useState(false);

    const handleEditTask = async() =>{
        try{
            // console.log(task);
            const res = await axiosInstance.put(`/task/edit-task/${task._id}`,editData)
            
            if(res.data.success){
                toast.success(res.data.message);
                fetchingTasks()
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const handleDeleteTask = async() =>{
        try{
            const res = await axiosInstance.delete(`/task/delete-task/${task._id}`)
            
            if(res.data.success){
                toast.success(res.data.message);
                fetchingTasks()
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const handleMarkCompleteTask = async() =>{
        try{
            const res = await axiosInstance.put(`/task/mark-completed/${task._id}`)
            
            if(res.data.success){
                toast.success(res.data.message);
                fetchingTasks()
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const handleDateUpdate = (e) =>{
        const newDate = e.target.value;
        setDate(newDate)
        updateDeadline(newDate,hours,minutes)
    }

    const handleHourUpdate = (e) =>{
        const newHours = e.target.value;
        setHours(newHours);
        updateDeadline(date,newHours,minutes)
    }

    const handleMinutesUpdate = (e) =>{
        const newMinutes = e.target.value
        setMinutes(newMinutes);
        updateDeadline(date,hours,newMinutes)
    }

    const updateDeadline = (newDate,newHours,newMinutes) =>{
        const updatedDeadline = new Date(`${newDate}T${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:00`);
        // console.log(updatedDeadline);
        setEditData((prev) => ({...prev, deadline:updatedDeadline.toISOString()}))
    }

    useEffect(()=>{
        const updateTimer = () =>{
            const currTime = new Date()
            const deadline = new Date(task.deadline);
            // console.log("currTime=",currTime)
            // console.log("deadline=",deadline)
            const diff = deadline-currTime;
            if (diff <= 0) {
                setTimeLeft({ years: 0, months: 0, days: 0, hrs: 0, mins: 0, secs: 0 });
            } 
            else {
                const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
                const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
                const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
                const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);
        
                setTimeLeft({ years, months, days, hrs, mins, secs });
            }
        }
        updateTimer()
        const timer = setInterval(updateTimer,1000)

        return () => clearInterval(timer);
    },[task.deadline]);
    
  return (
    <div className='flex flex-col gap-1 rounded-xl shadow-xl bg-yellow-400 p-4 md:p-8 relative my-2'>
        <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex-col gap-0.5">
                <h1 className="text-4xl text-white font-serif">{task.name}</h1>
                <p className="flex gap-1 text-md text-red-800">Category: {task.category}</p>
            </div>

            <div className=" flex gap-2">
                <button className='flex items-center justify-center gap-1 p-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl' 
                onClick={()=> {
                    setIsEditing(true)
                    setOpenDialogBox(true)
                }}>
                    <Edit className='size-4'/>
                    <p className="text-xl font-semibold font-serif">Edit</p>
                </button>

                <button className='flex items-center justify-center rounded-xl gap-1 p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white' 
                onClick={()=> {
                    setIsDeleting(true)
                    setOpenDialogBox(true)
                }}>
                    <Trash className='size-4'/>
                    <p className="text-xl font-semibold font-serif">Delete</p>
                </button>
            </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex gap-1 items-center justify-center">
                <h1 className="text-2xl ">Remaining Time:</h1>
                <div className="flex items-center justify-center gap-1">
                    {(timeLeft.years>0) && <h1>{timeLeft.years} Years</h1>}
                    {(timeLeft.months>0) && <h1>{timeLeft.months} months</h1>}
                    {(timeLeft.days>0) && <h1>{timeLeft.days} days</h1>}
                    {(timeLeft.hrs>0) && <h1>{timeLeft.hrs} hours</h1>}
                    {(timeLeft.mins>0) && <h1>{timeLeft.mins} mins</h1>}
                    {(timeLeft.secs>0) && <h1>{timeLeft.secs} secs</h1>}
                </div>
            </div>
            <button className='flex items-center justify-center rounded-xl gap-1 p-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white' 
            onClick={()=> {
                setIsMarkingCompleted(true)
                setOpenDialogBox(true)
            }}>
                <CheckCheck className='size-4'/>
                <p className="text-xl font-semibold font-serif">Mark Completed</p>
            </button>
        </div>

        {openDialogBox && (
            <div className="fixed flex items-center justify-center inset-0 shadow-lg  bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-gray-300 p-8 shadow-xl rounded-xl md:w-96 w-52 flex flex-col gap-3">
                    {isEditing && (
                    <>
                        <h1 className="text-xl font-semibold text-center">Edit Task</h1>
                        <div className="">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor='name' className='text-xl font-semibold font-serif'>Task Name</label>
                                <input type='text' id='name' className='rounded-lg outline-none p-2' value={editData.name} onChange={(e)=>setEditData((prev) => ({...prev,name:e.target.value}))}  required/>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor='category' className='text-xl font-semibold font-serif'>Select Task Category</label>
                                {categories.map((cat)=>(
                                    <label key={cat} className='flex items-center gap-1'>
                                        <input type='radio' name='category' checked={cat === editData.category} value={cat} onChange={(e)=>setEditData((prev) => ({...prev,category:e.target.value}))}  required/>
                                        {cat}
                                    </label>
                                ))
                                }
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor='deadline' className='text-xl font-semibold font-serif'>Task Deadline</label>
                                <input type='date' id='date' value={date} onChange={handleDateUpdate} 
                                className='p-2 border rounded-lg w-full' required/>
                            </div>

                            <div className="flex gap-4">
                                <select value={hours} onChange={handleHourUpdate} className='border p-2 rounded-lg'>
                                    {
                                        Array.from({length:24},(_,i)=>(
                                            <option key={i} value={String(i).padStart(2,"0")}>
                                                {String(i).padStart(2,"0")}
                                            </option>
                                        ))
                                    }
                                </select>
                                :
                                <select value={minutes} onChange={handleMinutesUpdate} className='border p-2 rounded-lg'>
                                    {
                                        Array.from({length:60},(_,i)=>(
                                            <option key={i} value={String(i).padStart(2,"0")}>
                                                {String(i).padStart(2,"0")}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button className='p-3 rounded-xl bg-green-700 text-white hover:bg-white hover:text-green-700' 
                            onClick={()=> {
                                handleEditTask()
                                setIsEditing(false)
                                setOpenDialogBox(false)
                            }}>
                                Save
                            </button>
                            <button className='p-3 rounded-xl bg-black text-white hover:bg-gray-900' 
                            onClick={()=> {
                                setIsEditing(false)
                                setOpenDialogBox(false)
                            }}>
                                Cancel
                            </button>
                        </div>
                    </>
                    )}

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

                    {isMarkingCompleted && (
                    <>
                        <h1 className="text-xl font-semibold text-center">Mark Task as Completed</h1>
                        <div className="flex justify-between items-center">
                            <button className='p-3 rounded-xl bg-blue-700 text-white hover:bg-white hover:text-red-700' 
                            onClick={()=> {
                                handleMarkCompleteTask()
                                setIsMarkingCompleted(false)
                                setOpenDialogBox(false)
                            }}>
                                Mark Completed
                            </button>
                            <button className='p-3 rounded-xl bg-black text-white hover:bg-gray-900' 
                            onClick={()=> {
                                setIsMarkingCompleted(false)
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

export default EditableTaskBox
