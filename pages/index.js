import React, { useState, useContext } from 'react'
import dynamic from 'next/dynamic'
import { _AppContext, project_name } from './_app'
const BestFood = dynamic(() => import('/components/BestFood'))
const BestBlog = dynamic(() => import('/components/BestBlog'))
const CusImage = dynamic(() => import("/components/cusImage.js"))
const CusInput = dynamic(() => import("/components/cusInput"))
const MultiCard = dynamic(() => import("/components/MultiCard"))
const IndexNCDS = dynamic(() => import("/components/IndexNCDS"))


export default function Index() {
  const { setTitle, setDefaultSelectedKeys } = useContext(_AppContext)
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [pageSelect, setPageSelect] = useState(0)
  // Fetch First Time
  // if(!data) return null
  setDefaultSelectedKeys("/")
  setTitle(project_name)
  return (
    <div className="flex flex-col w-full h-full min-h-screen gap-3  sm:mx-auto mx-0"
      initial="hidden"
      animate="visible">
        {/* Menu */}
      <div className={`flex gap-2 mt-6 flex-row flex-wrap w-11/12  mx-auto`}>
        <button className={`bg-blue-900 text-white hover:bg-blue-700 py-3 px-4 ${pageSelect === 0 && "bg-blue-700"}`} 
          onClick={()=>setPageSelect(0)}>โรคไม่ติดต่อเรื้อรัง</button>
        <button className={`bg-blue-900 text-white hover:bg-blue-700 py-3 px-4 ${pageSelect === 1 && "bg-blue-700"}`} 
          onClick={()=>setPageSelect(1)}>อาหารและบทความ</button>
      </div>
      {pageSelect === 0 &&<hr/>}
      {/* content */}
      <div className="relative">
        <div className="flex flex-col gap-3 p-3 ">
          {pageSelect === 0 && <div className="w-full lg:w-2/3 mx-auto h-60 sm:h-very-super"><CusImage src="NCDs-1536x864.jpg" /></div>}
          {pageSelect === 0 && <IndexNCDS />}
          {pageSelect === 1 && <>
            <hr />
            <h1 className="ml-10 text-blue-900 text-2xl lg:text-4xl underline mb-6">อาหารและบทความ</h1>
            <CusInput data={data} setData={setData} loading={loading} setLoading={setLoading} />
            <MultiCard loading={loading} data={data} setData={setData} title={"ผลการค้นหา"} />
          </>}
        </div>
        {/* {loading && <div className="absolute top-0 left-0 z-10"><Spin size="large" /></div>} */}
      </div>
      {pageSelect === 1 && <div className='mx-0'>
        <BestFood title="อาหารยอดนิยม" />
        <BestBlog title="บทความยอดนิยม" />
      </div>}

    </div>
  )
}


