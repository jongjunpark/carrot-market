import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className='bg-slate-400 py-20 px-10 flex flex-col gap-10'>
      <div className='bg-white p-10 rounded-2xl shadow-xl'>
        <span className="font-semibold text-3xl">Select Item</span>
        <div className="flex justify-between">
          <span className='text-gray-500'>Grey Chair</span>
          <span>$19</span>
        </div>
      </div>
      <div className='bg-white p-10 rounded-2xl shadow-xl'></div>
      <div className='bg-white p-10 rounded-2xl shadow-xl'></div>
      <div className='bg-white p-10 rounded-2xl shadow-xl'></div>
      <div className='bg-white p-10 rounded-2xl shadow-xl'></div>
    </div>
  )
}

export default Home
