
import { Tooltip, Rate } from 'antd';
import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'

import router from 'next/router';
import dynamic from 'next/dynamic'
import Owl_Carousel from './Owl_Carousel';
import { _AppContext } from '/pages/_app'

const CusImage = dynamic(() => import("/components/cusImage.js"))
const CusInput = dynamic(() => import("/components/cusInput"),
  { ssr: false })

export default function DisplayBlogReadMore({ data, setData, store, setStore, link = true, getData, headTextColor, headLineColor }) {
  const [loading, setLoading] = useState(false)
  const [loadingSearch, setLoadingSearch] = useState(false)

  const router = useRouter()
  const { categories } = router.query
  const { setTitle, title, setDefaultSelectedKeys } = useContext(_AppContext)
  const refreshData = async () => {
    setLoading(true)
    const raw = await getData(categories)
    if (!raw) { setLoading(false); return null }
    setData(raw)
    setStore(raw)
    setLoading(false)
    setDefaultSelectedKeys(`blogs_${categories}`)
    if (categories === 'all') setTitle("บทความ อาหารและโรคไม่ติดต่อทั้งหมด")
    else if (categories === 'ncds') setTitle("บทความ โรคไม่ติดต่อทั้งหมด")
    else if (categories === 'food') setTitle("บทความ อาหารทั้งหมด")
  }
  useEffect(() => {
    if (!data && categories) {
      refreshData()
    }
  }, [data, categories, getData])

  if (loading) return <>กำลังดึงข้อมูล</>
  if (data?.length <= 0) return <>ไม่พบข้อมูล</>
  return (
    <div className='sm:m-full  mx-auto min-h-screen' >
      <CusInput only="blogs" data={data} setData={setData}
        store={store} setStore={setStore}
        loading={loadingSearch} setLoading={setLoadingSearch} />
      <div className=" xl:grid-cols-3  gap-16 md:grid-cols-3 sm:grid sm:grid-cols-2 mt-5 " >
        {data && data?.map(({ id,
          type,
          name,
          imply,
          image,
          name_en,
          calories,
          avg_vote,
          total_vote,
          approve }, index) =>
          <>
            {approve && <div
              key={id + index + Math.random()}
              className="grid-cols-12 h-full  flex-warp rounded-xl  bg-gray-50 items-center  item shadow-xs  m-0 p-0">
              {image && <CusImage src={image[0].name} alt={id} className="" width="100%" height={300} preview={false} />}
              {/* {!name_en && <Tooltip title={name_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{name_en}</p></Tooltip>} */}
              <div className="w-full h-full flex flex-col  p-3 " style={{height:"fit-content"}}>

                <div className="flex flex-col">
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
                  <p className=" mt-1 sm:mx-5 break-words overflow-hidden text-lg md:text-md text-2-line">{imply}...</p>
                  <hr className='mt-5 ' />
                  <div className="flex justify-center">
                    <a onClick={() => { router.push(`/blogs/${type.toLowerCase()}/${id}`) }} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 mt-3 ">อ่านต่อ</a>
                  </div>
                </div>

              </div>
            </div>}
          </>
        )}

      </div>

    </div>

  )

}