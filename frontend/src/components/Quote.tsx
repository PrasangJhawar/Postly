import React from 'react'

const Quote = () => {
  return <div className='bg-slate-200 h-screen flex justify-center flex-col'>
      <div className='flex justify-center'>
        <div className='max-w-lg'>
          <div className='text-3xl font-bold mb-4'>
            "The customer service I received was exceptional. I wish my team could do it."
          </div>
          <div className='max-w-lg text-xl font-semibold'>
            Elon Musk
          </div>
          <div className='max-w-lg  text-xl font-semibold text-slate-400'>
            CEO | Tesla
          </div>
        </div>
      </div>
    </div>
}

export default Quote