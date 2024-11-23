import React, { useState } from 'react'

const NotificationCard = () => {
    const[name, setName] = useState('You got job request form shubham')

    const AcceptJobRequest = () =>{

    }
    
    const RejectJobRequest = () =>{

    }
    

  return (
    <div className='block font-sans items-center rounded-2xl p-3 bg-purple-100 m-2 round-2xl'>
      <p className='ml-2 mr-10 mt-1 items-center mb-2 w-auto h-auto font-bold'>
            {name}
      </p>

      <div className='inline-flex space-x-2'>
        <button className='w-100 h-auto bg-green-500 px-3 py-2 rounded-3xl text-white font-semibold hover:bg-green-700' onClick={AcceptJobRequest}>Accept</button>
        <button className='w-100 h-auto bg-red-500 px-3 py-2 rounded-3xl text-white font-semibold hover:bg-red-700' onClick={RejectJobRequest}>Reject</button>
      </div>

    </div>
  )
}

export default NotificationCard