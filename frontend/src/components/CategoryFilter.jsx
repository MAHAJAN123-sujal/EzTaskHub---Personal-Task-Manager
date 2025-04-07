import React, { useEffect, useState } from 'react'

const CategoryFilter = ({tasks,onFilter}) => {
    const categories = ['sports','academics','work','personal','other'];
    const [selectedCategories,setSelectedCategories] = useState([]);

    const handleChangeCategories = (category) =>{
        setSelectedCategories((prev)=> prev.includes(category)
        ? prev.filter((c) => c!==category)
        :[...prev,category])

        // console.log(selectedCategories)
    }

    useEffect(()=>{
        const filteredTasks = (selectedCategories.length>0)
        ? tasks.filter((task)=>selectedCategories.includes(task.category))
        : tasks;

        onFilter(filteredTasks)
    },[selectedCategories,tasks,onFilter])
  return (
    <div className='flex flex-col gap-1'>
      <h1 className="text-2xl">Select Category</h1>
      <div className="flex gap-2">
            {categories.map((cat)=>(
                    <label className='text-lg font-serif' key={cat}>
                        <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={()=> handleChangeCategories(cat)} />
                        {cat}
                    </label>
            ))}
      </div>
    </div>
  )
}

export default CategoryFilter
