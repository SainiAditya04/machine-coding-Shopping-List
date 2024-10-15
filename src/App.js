import React, { useEffect, useState } from 'react'
import { FOOD_API } from './constant'

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [list, setList] = useState([]);
  const [bucketList, setBucketList] = useState([]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetchFoodAPI();
    }
    else {
      setList([]);
    }

  }, [searchQuery]);

  async function fetchFoodAPI() {
    try {
      const response = await fetch(FOOD_API + searchQuery);
      const data = await response.json();
      setList(data);
    }
    catch (error) {
      console.log("ERROR WHILE FETCHING FOOD API");
    }
  }

  function handleAddShopping(e){
    const idx = e.target.getAttribute('data-id');
    if(idx){
      const obj = {
        id: Date.now(),
        data: list[idx],
        isDone: false
      }

      const copyBucket = [...bucketList];
      copyBucket.push(obj);
      setBucketList(copyBucket);
    }
  }

  function handleTick(id){
    const copyBucketList = [...bucketList];
    const newBucketList = copyBucketList.map((item) => {
      if(item.id === id){
        item.isDone = !item.isDone;
      }

      return item;
    });

    setBucketList(newBucketList);
  }

  function handleCross(id){
    const copyBucketList = [...bucketList];
    const newBucketList = copyBucketList.filter((item) => {
      return item.id !== id;
    })

    setBucketList(newBucketList);
  }

  return (
    <div className='w-screen h-screen bg-gray-200 flex flex-col items-center'>

      <input
        type='text'
        placeholder='enter food items here'
        className='w-[400px] rounded-md p-3 outline-none shadow-md shadow-gray-300'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {
        searchQuery.length > 1 &&
        <div
          className='w-[400px] max-h-[290px] rounded-md bg-gray-100 shadow-md shadow-gray-300 flex flex-col overflow-y-scroll'
          onClick = {handleAddShopping}
        >
          {
            list.map((item, index) => {
              return <div 
              className='hover:bg-gray-200 p-2 cursor-pointer'
              data-id = {index}
              >
                {item}
              </div>
            })
          }
        </div>
      }

      {/* Bucket list  */}
      <div className='flex flex-col gap-5 m-5'>
        {
          bucketList.map((item) => {
            return <div className='flex items-center justify-between w-[300px] p-2 bg-slate-300 text-lg'>
              <button onClick={() => handleTick(item.id)}>✅</button>
              {
                item.isDone ? <p className='line-through text-gray-500'>{item.data}</p> : <p>{item.data}</p>
              }
              <button onClick={() => handleCross(item.id)}>❌</button>
            </div>
          })
        }
      </div>

    </div>
  )
}

export default App


