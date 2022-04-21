import React, { useState, useEffect } from 'react'
import { Carousel, Divider, Tooltip, Spin, Select, notification } from 'antd';
import router from 'next/router';
import dynamic from 'next/dynamic'
import { noti } from '/components/noti.js';
const BestFood = dynamic(() => import('../components/BestFood'))
const BestBlog = dynamic(() => import('../components/BestBlog'))
const CustImage = dynamic(() => import("/components/cusImage.js"))
const CusInput = dynamic(() => import("/components/cusInput"))
const MultiCard = dynamic(() => import("/components/MultiCard"))

const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore"),
  { ssr: false })
const DisplayBlogReadMore = dynamic(() => import("/components/displayBlogReadMore"),
  { ssr: false })
export default function Index() {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  // Fetch First Time
  // if(!data) return null
  return (
    <div className="flex flex-col w-full h-full min-h-screen gap-3  sm:mx-auto mx-0"
      initial="hidden"
      animate="visible">
      <div className="relative">
        <div className="flex flex-col gap-3 p-3 ">
          <CusInput data={data} setData={setData} loading={loading} setLoading={setLoading} />
          <MultiCard loading={loading} data={data} title={"ผลการค้นหา"} />
        </div>
        {/* {loading && <div className="absolute top-0 left-0 z-10"><Spin size="large" /></div>} */}
      </div>
      <div className=' mx-0'>
        <BestFood />
        <BestBlog />
      </div>

    </div>
  )
}


