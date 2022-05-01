import React, { useState ,useContext } from 'react'
import dynamic from 'next/dynamic'
import { _AppContext ,project_name} from './_app'
const BestFood = dynamic(() => import('../components/BestFood'))
const BestBlog = dynamic(() => import('../components/BestBlog'))
const CustImage = dynamic(() => import("/components/cusImage.js"))
const CusInput = dynamic(() => import("/components/cusInput"))
const MultiCard = dynamic(() => import("/components/MultiCard"))
const IndexNCDS = dynamic(() => import("/components/IndexNCDS"))


export default function Index() {
  const {setTitle , setDefaultSelectedKeys} = useContext(_AppContext)
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  // Fetch First Time
  // if(!data) return null
  setDefaultSelectedKeys("/")
  setTitle(project_name)
  return (
    <div className="flex flex-col w-full h-full min-h-screen gap-3  sm:mx-auto mx-0"
      initial="hidden"
      animate="visible">
      <div className="relative">
        <div className="flex flex-col gap-3 p-3 ">
          <IndexNCDS/>
          <hr className="my-5 sm:my-10"/>
          <CusInput data={data} setData={setData} loading={loading} setLoading={setLoading} />
          <MultiCard loading={loading} data={data} setData={setData} title={"ผลการค้นหา"} />
        </div>
        {/* {loading && <div className="absolute top-0 left-0 z-10"><Spin size="large" /></div>} */}
      </div>
      <div className=' mx-0'>
        <BestFood title="อาหารยอดนิยม"/>
        <BestBlog title="บทความยอดนิยม"/>
      </div>

    </div>
  )
}


