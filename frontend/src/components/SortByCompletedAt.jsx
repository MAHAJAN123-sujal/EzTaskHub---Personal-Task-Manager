import React, { useEffect, useState } from 'react'

const SortByCompletedAt = ({tasks,onFilter}) => {
  const [sortedOrder,setSortedOrder] = useState('asc');
  
      useEffect(()=>{
        if(!tasks || tasks.length===0) return;
        const sortedTasks = [...tasks].sort((a,b)=>{
            const CompletionOfA = new Date(a.completedAt);
            const CompletionOfB = new Date(b.completedAt);
    
            return (sortedOrder=='asc')? (CompletionOfA-CompletionOfB) : (CompletionOfB-CompletionOfA);
          })
  
        onFilter(sortedTasks)
      },[sortedOrder,tasks,onFilter])
    return (
      <div className='flex flex-col gap-1'>
        <h1 className="text-xl">Arrange Tasks By Time of Completion:</h1>
        <div className="flex gap-2">
          <label className="text-md">
            <input type="radio" name="sortOrder" value="asc" checked={sortedOrder==='asc'} onChange={()=>setSortedOrder('asc')} />
            Ascending
          </label>
          <label className="text-md">
            <input type="radio" name="sortOrder" value="desc" checked={sortedOrder==='desc'} onChange={()=>setSortedOrder('desc')} />
            Descending
          </label>
        </div>
      </div>
    )
}

export default SortByCompletedAt
