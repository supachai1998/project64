// import '@fontawesome-free/css/all.css'

import { Carousel, Tooltip, Divider, Rate, Select } from 'antd';

import router from 'next/router';
import dynamic from 'next/dynamic'
const Owl_Carousel = dynamic(() => import('/components/Owl_Carousel'), {
  ssr: false,
});

const CustImage = dynamic(() => import("/components/cusImage.js"))

export default function DisplayFoodReadMore({ data, title, headTextColor, headLineColor }) {
  if (!data || !Array.isArray(data) || data.length < 1) return null
  return (
    <Owl_Carousel
      title={title}
      info_top={`พบ ${data.length} รายการ`}
    >
      <>
        {data.map(({
          id,
          type,
          categories,
          title,
          title_th,
          title_en,
          cal,
          positive,
          nagative,
          imgUrl,
          detail,
          intro,
        }, index) => (
          <div
            key={id + index + Math.random()}
            className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
            <div className="relative w-full" >
              <CustImage src={imgUrl} alt={title_th} className="" width="100%" height="200px" preview={false} />
            </div>
            <div className={title ? "w-full h-full flex flex-col  p-1 " : "w-full h-full flex flex-col  "}>
              {positive && nagative ? <div className="flex flex-col">
                <div className=" flex-col text-center mb-0">
                  <p className="card-header"> {title_th}</p>
                  <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' ></div>
                  <p className="card-header"> {title_en}</p>
                </div>

                <div className="flex justify-between mb-4  ml-0 px-5">
                  <div className='flex flex-col p-2'>
                    <span className="text-gray-500 font-Poppins leading-none font-bold text-2xl">{cal}</span>
                    <span className="text-gray-900 font-Poppins font-bold text-sm leading-none">กิโลแคลอรี่</span>
                  </div>

                  <div className='flex flex-col text-center justify-end '>

                    {positive.some(el => {
                      if (el.ncds == "โรคเบาหวาน")
                        return true
                    }) == true ?
                      <>
                        <span className="text-green-600 font-Poppins leading-none font-bold text-2xl">แนะนำ</span>
                        <span className="text-gray-500 font-Poppins leading-none font-bold text-xs">สามารถรับประทานได้</span>
                      </>

                      :
                      <>
                        <span className="text-red-700 font-Poppins leading-none font-bold text-lg">ไม่แนะนำ</span>
                        <span className="text-gray-500 font-Poppins leading-none font-bold text-xs">ไม่ควรรับประทาน</span>
                      </>}

                    {/* <span className="text-red-700 font-Poppins leading-none font-bold text-lg">ไม่แนะนำ</span>
                        <span className="text-gray-500 font-Poppins leading-none font-bold text-xs">ไม่ควรรับประทาน</span> */}
                  </div>
                </div>
                <hr className="mb-2" />

                <div className="flex justify-center py-8">
                  <a onClick={() => router.push(`/${type}/${categories}/${id}`)} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50">อ่าน</a>
                </div>
              </div>
                :
                <div className="flex flex-col p-4">

                  <div className=" flex-col text-center mb-0">
                    <p className="card-header">{title}</p>

                  </div>
                  <div className="flex justify-between mb-4 m-4 ml-0">
                    <Tooltip title={`คะแนนโหวต ${4}/${5}`} ><Rate disabled defaultValue={4} /> </Tooltip>
                    <div className='flex flex-col '>
                      <span className="text-gray-500 font-Poppins leading-none font-bold">โหวต</span>
                      <span className="text-gray-900 font-Poppins font-bold text-lg leading-none">{300}</span>

                    </div>
                  </div>
                  <p className="pr-3 mt-1 break-words overflow-hidden text-lg md:text-md h-20">{intro}...</p>
                  <hr className='mb-2' />
                  <div className="flex justify-center">
                    <a onClick={() => router.push(`/${type}/${categories}/${id}`)} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50">อ่าน</a>
                  </div>
                </div>
              }
            </div>
          </div>
        ))}
      </>
    </Owl_Carousel>
  )

}


