
import {  Tooltip, Divider ,Rate,Select } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined} from '@ant-design/icons';

import router from 'next/router';
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion';
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import "owl.carousel/dist/assets/owl.theme.default.css";

const CustImage = dynamic(() => import("/components/cusImage.js"))
const easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 1.2, ease: easing }
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: easing
    }
  }
};
const state= {
  responsive:{
      0: {
          items: 1,
      },
      450: {
          items: 1,
      },
      600: {
          items: 1,
      },
      1000: {
          items: 3,
      },
  },
}
const customIcons = {
  1: <FrownOutlined className="text-red-600 stroke-current "/>,
  2: <FrownOutlined className="text-red-400"/>,
  3: <MehOutlined className="text-yellow-500"/>,
  4: <SmileOutlined className="text-green-400"/>,
  5: <SmileOutlined className="text-green-600"/>,
};
const {OptGroup,Option} = Select

export default function DisplayBlogReadMore({ data, title, headTextColor, headLineColor }) {

  return (
    <motion.div
      variants={fadeInUp}
      positionTransition
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className='m-10 mt-0'
    >

      <div className="flex justify-center flex-col w-full px-3 py-3 transition-all duration-500 ease-in-out rounded-2xl">
        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
        <p className={headTextColor + " mt-4 text-2xl mb-0 font-bold  transition transform font-Charm w-full text-center "}>{title}</p>
        <span className=' w-full text-right mb-4 border-b border-b-green' >
          <a href="#" className='hover:text-gray-500 text-black'>
          บทความที่เกี่ยวข้อง
          </a>
          </span>        
        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
      </div>
      <div className='mx-10'>
      <OwlCarousel
loop={false}
items={3}
responsiveRefreshRate={0}
autoplay={true}
autoplayTimeout={7000}
autoplayHoverPause={true}
nav={true}
responsiveClass= {true}
responsive={state.responsive}
navText={[
  '<i class="icon-arrow-prev"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
  '<i class="icon-arrow-next"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
]



}
dots={false}
margin={20} >
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
          <motion.div
            variants={fadeInUp}
            positionTransition
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            key={id + index + Math.random()} 
            className="grid-cols-1  grid rounded-xl lg:h-fix73 h-full bg-gray-50 items-center  item shadow-lg p-0 ">
            <div className="relative w-full" >
              <CustImage src={imgUrl} alt={title_th} className="" width="100%" height="200px" preview={false} />

              {!title && <Tooltip title={title_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{title_th}</p></Tooltip>}
              {cal && <Tooltip title="ปริมาณแคลอรี่"><p className="absolute bottom-0 left-0 p-2 text-xs text-left bg-opacity-60 bg-gray-50 sm:text-sm rounded-xl">{cal} KgCal</p></Tooltip>}
            </div>
            <div className={title ? "w-full h-full flex flex-col  p-3 " : " w-1.5/2 h-full flex flex-col overflow-auto"}>
              {positive && nagative ? <div>
                <div className="grid grid-cols-1 w-full h-10 p-6 overflow-hidden text-gray-900 rounded-2xl ">
                  <div className="flex justify-between">
                    <p className="text-lg text-green-700 font-Charm ">โรคสามารถทานได้</p>
                    <Tooltip title="อ่านต่อ"><a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="text-purple-600 duration-1000 animate-pulse rounded-xl">อ่านต่อ</a></Tooltip>
                  </div>
                  {positive.map(({ ncds, because }, index) => (
                    <div key={index + Math.random()} className="mt-1">
                      <span className="text-gray-800">{ncds} </span>
                    </div>))}
                </div>
                <div className="flex flex-col w-full h-full p-6 overflow-hidden text-gray-900 rounded-2xl">
                  <div className="flex justify-between">
                    <p className="text-lg text-red-700 font-Charm">โรคที่ควรเลี่ยง</p>
                    <Tooltip title="อ่านต่อ"><a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="text-purple-600 duration-1000 animate-pulse rounded-xl">อ่านต่อ</a></Tooltip>
                  </div>
                  {nagative.map(({ ncds, because }, index) => (
                    <div key={index + Math.random()} className="pr-3 mt-1" >
                      <span className="text-gray-800 ">{ncds} </span>
                    </div>))}
                </div>
              </div>
                :
                <div className="flex flex-col p-2">

                  <div className=" flex-col text-center mb-0 pr-5 pl-5">
                    <p className="font-Charm text-xl title-article pb-0 truncate   ">{title}</p>
                    <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' ></div>
                  </div>
                  <div className="flex justify-between mb-4 m-4 ml-0  pr-5 pl-5">
                    <Tooltip title={`คะแนนโหวต ${4}/${5}`} ><Rate disabled  defaultValue={4}  /> </Tooltip>
                    <div className='flex flex-col '>
                      <span className="text-gray-500 font-Poppins leading-none font-bold">โหวต</span>
                      <span className="text-gray-900 font-Poppins font-bold text-lg leading-none">{300}</span>
                    </div>
                  </div>
                  <p className="pr-3 mt-1 mx-5 truncate flex-nowrap">{intro}...</p>
                  <hr className='mb-2 '/>
                  <div className="flex justify-center ">
                    <a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 m-5 ">อ่านต่อ</a>
                  </div>
                </div>
              }
            </div>


          </motion.div>
        ))}
      </OwlCarousel>
      <div className='flex justify-end text-lg'>
        <a onClick={() => router.push(`/blogs/more`)} className='text-right text-gray-500 hover:text-black'>อ่านทั้งหมด</a>
      </div>
      </div>
    </motion.div>

  )


}

