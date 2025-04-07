import axiosInstance from '../utils/axiosInstance'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const CreateTaskForm = ({fetchingTasks, onClose}) => {
    const [name,setName] = useState("")
    const [category,setCategory] = useState("")
    const [date, setDate] = useState("")
    const [hours,setHours] = useState("00")
    const [minutes,setMinutes] = useState("00")

    const categories = ['sports','academics','work','personal','other']
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const deadline = new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);
        try{
            const res = await axiosInstance.post('/task/add-task',{name,category,deadline});
            fetchingTasks()
            if(res.data.success){
                toast.success(res.data.message)
                onClose();
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

  return (
    <>
        <h2 className="text-3xl text-center my-2 font-semibold font-serif">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2'>
            <div className="flex flex-col gap-1.5">
                <label htmlFor='name' className='text-xl font-semibold font-serif'>Task Name</label>
                <input type='text' id='name' className='rounded-lg outline-none p-2' value={name} placeholder='Enter task Name' onChange={(e)=>setName(e.target.value)} required/>
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor='category' className='text-xl font-semibold font-serif'>Select Task Category</label>
                {categories.map((cat)=>(
                    <label key={cat} className='flex items-center gap-1'>
                        <input type='radio' name='category' checked={cat === category} onChange={()=> setCategory(cat)}/>
                        {cat}
                    </label>
                ))
                }
            </div>
            <div className="flex flex-col gap-1.5">
                <label htmlFor='deadline' className='text-xl font-semibold font-serif'>Task Deadline</label>
                <input type='date' id='date' value={date} onChange={(e)=> setDate(e.target.value)} 
                className='p-2 border rounded-lg w-full' required/>
            </div>

            <div className="flex gap-4">
                <select value={hours} onChange={(e)=>setHours(e.target.value)} className='border p-2 rounded-lg'>
                    {
                        Array.from({length:24},(_,i)=>(
                            <option key={i} value={String(i).padStart(2,"0")}>
                                {String(i).padStart(2,"0")}
                            </option>
                        ))
                    }
                </select>
                :
                <select value={minutes} onChange={(e)=>setMinutes(e.target.value)} className='border p-2 rounded-lg'>
                    {
                        Array.from({length:60},(_,i)=>(
                            <option key={i} value={String(i).padStart(2,"0")}>
                                {String(i).padStart(2,"0")}
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className="flex items-center justify-center my-2">
                <button type='submit' className='bg-black text-white border-gray-400 hover:bg-gray-800 flex gap-1 p-3 items-center justify-center rounded-xl'>Create Task</button>
            </div>
        </form>
    </>
  )
}

export default CreateTaskForm
