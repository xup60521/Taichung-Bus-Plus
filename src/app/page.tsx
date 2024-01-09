import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='w-screen h-screen flex justify-center items-center bg-slate-800'>
      <div className='text-center text-white flex flex-col gap-4'>
        <h1 className='text-3xl font-mono'>Taichung Bus Plus</h1>
        <Link href={"/bus"}>---點擊進入---</Link>
      </div>
    </main>
  )
}
