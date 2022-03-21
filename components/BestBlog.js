
import { Tooltip, Divider, Rate, Select, notification } from 'antd';

import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import Owl_Carousel from './Owl_Carousel';
import { useState, useEffect } from 'react'
const CustImage = dynamic(() => import("/components/cusImage.js"))


export default function DisplayBlogReadMore() {
  const [_data, setData] = useState()

  const router = useRouter()
  const fetchData = async () => {
    const data = await fetch(`/api/getBlogs?BestBlog=${true}`).then(async res => {
      if (res.ok) {
        const _ = await res.json()
        return _
      } else notification.error({ message: `ไม่สามารถดึงข้อมูลบทความ` })
      
    })

    return data
  }
  useEffect(() => {
    (async () => {
      if (!_data) {
        const data = await fetchData()
        !!data && setData([...data])
      }
    })()
  }, [_data])

  if (!_data && !Array.isArray(_data)) return null
  return (
    <Owl_Carousel
      title="บทความยอดนิยม"
      link="/blog"
      info_top={`พบ ${_data.length} รายการ`}
      info_down={`อ่านทั้งหมด`}
    >
      <>
        {_data.map(({
          id,
          type,
          name,
          imply,
          image,
          name_en,
          calories,
          avg_vote,
          total_vote
        }, index) => (
          <div
            key={id + index + Math.random()}
            className="grid-cols-12  flex-warp rounded-xl  bg-gray-50 items-center  item shadow-xs  m-0 p-0">
            <div className="relative w-full" >
              {image && <CustImage src={image[0].name} alt={id} className="" width="100%" height="200px" preview={false} />}
              {!name_en && <Tooltip title={name_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{name_en}</p></Tooltip>}
              {calories && <Tooltip title="ปริมาณแคลอรี่"><p className="absolute bottom-0 left-0 p-2 text-xs text-left bg-opacity-60 bg-gray-50 sm:text-sm rounded-xl">{calories} KgCal</p></Tooltip>}
            </div>
            <div className={name ? "w-full h-full flex flex-col  p-3 " : " sm:w-1.5/2 h-full flex flex-col overflow-auto"}>

              <div className="flex flex-col p-2">
                <div className=" flex-col text-center mb-0 pr-5 pl-5">
                  <p className="card-header">{name}</p>
                  <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' ></div>
                </div>
                <div className="flex justify-between mb-4 m-4 ml-0  pr-5 pl-5">
                  <Tooltip title={`คะแนนโหวต ${avg_vote}/${5}`} ><Rate disabled defaultValue={avg_vote} /> </Tooltip>
                  <div className='flex flex-col '>
                    <span className="text-gray-500 leading-none font-bold">โหวต</span>
                    <span className="text-gray-900 font-bold text-lg leading-none">{total_vote}</span>
                  </div>
                </div>
                <p className=" mt-1 sm:mx-5 break-words overflow-hidden text-lg md:text-md h-20">{imply}...</p>
                <hr className='mb-2 ' />
                <div className="flex justify-center ">
                  <a onClick={() => { localStorage.setItem('keys', `blogs_${type}`); router.push(`/blogs/${type.toLowerCase()}/${id}`) }} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 m-5 ">อ่านต่อ</a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </>
    </Owl_Carousel >


  )


}

