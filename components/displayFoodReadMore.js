// import '@fontawesome-free/css/all.css'

import { Carousel, Tooltip, Divider ,Rate,Select } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined} from '@ant-design/icons';

import router from 'next/router';
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
 });

var show_ncds = 0;
const CustImage = dynamic(() => import("/components/cusImage.js"))
const easing = [0.6, -0.05, 0.01, 0.99];
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
const customIcons = {
  1: <FrownOutlined className="text-red-600 stroke-current "/>,
  2: <FrownOutlined className="text-red-400"/>,
  3: <MehOutlined className="text-yellow-500"/>,
  4: <SmileOutlined className="text-green-400"/>,
  5: <SmileOutlined className="text-green-600"/>,
};
const {OptGroup,Option} = Select
var ck_ncds = false
export default function DisplayFoodReadMore({ data, title, headTextColor, headLineColor }) {

  return (
    <motion.div
      variants={fadeInUp}
      positionTransition
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className='mx-10'
    >

      <div className="flex justify-center flex-col w-full px-3 py-3 transition-all duration-500 ease-in-out rounded-2xl ">
        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
        <p className={headTextColor + " mt-4 text-2xl mb-0 font-bold  transition transform font-Charm w-full text-center "}>{title}</p>
        <span className=' w-full text-right mb-4 border-b border-b-green' >
          <a href="#" className='hover:text-gray-500 text-black'>
          อาหารความที่เกี่ยวข้องกับโรคเบาหวาน
          </a>
          </span>        
        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
      </div>
      <div className='m-10 mt-0'>
      <OwlCarousel
loop={false}
items={3}
responsiveRefreshRate={0}
// autoplay={true}
// autoplayTimeout={7000}
// autoplayHoverPause={true}
nav={true}
responsiveClass= {true}
responsive={state.responsive}
navText={[
  '<i class="icon-arrow-prev"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
  '<i class="icon-arrow-next"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
]}
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
            className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">

            <div className="relative w-full" >
              <CustImage src={imgUrl} alt={title_th} className="" width="100%" height="200px" preview={false} />

              
            
            
            </div>
            <div className={title ? "w-full h-full flex flex-col  p-1 " : "w-full h-full flex flex-col  "}>
              {positive && nagative ? <div className="flex flex-col">
                  <div className=" flex-col text-center mb-0">
                    <p className="font-Charm text-3xl title-article pb-0 truncate mb-2"> {title_th}</p>
                    <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' ></div>
                    <p className="font-Charm text-xs pb-0 truncate text-gray-500"> {title_en}</p>
                  </div>

                  <div className="flex justify-between mb-4  ml-0 px-5">
                    <div className='flex flex-col p-2'>
                      <span className="text-gray-500 font-Poppins leading-none font-bold text-2xl">{cal}</span>
                      <span className="text-gray-900 font-Poppins font-bold text-sm leading-none">กิโลแคลอรี่</span>
                    </div>

                    <div className='flex flex-col text-center justify-end'>

                        {positive.some(el=>{
                        if(el.ncds=="โรคเบาหวาน")
                          return true
                          })==true?
                        <>
                          <span className="text-green-700 font-Poppins leading-none font-bold text-2xl">แนะนำ</span>
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
                    <a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50">อ่านต่อ</a>
                  </div>
              </div>
                :
                <div className="flex flex-col p-4">
                  
                  <div className=" flex-col text-center mb-0">
                    <p className="font-Charm text-xl title-article pb-0 truncate ">{title}</p>
                    
                  </div>
                  <div className="flex justify-between mb-4 m-4 ml-0">
                    <Tooltip title={`คะแนนโหวต ${4}/${5}`} ><Rate disabled  defaultValue={4}  /> </Tooltip>
                    <div className='flex flex-col '>
                      <span className="text-gray-500 font-Poppins leading-none font-bold">โหวต</span>
                      <span className="text-gray-900 font-Poppins font-bold text-lg leading-none">{300}</span>

                    </div>
                  </div>
                  <p className="pr-3 mt-1 ">{intro}...</p>
                  <hr className='mb-2'/>
                  <div className="flex justify-center">
                    <a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50">อ่านต่อ</a>
                  </div>
                </div>
              }
            </div>


          </motion.div>
        ))}
      </OwlCarousel>
      <div className='flex justify-end text-lg'>
        <a href="#" className='text-right text-gray-500 hover:text-black'>อ่านทั้งหมด</a>
      </div>
      </div>
    </motion.div>

  )
  // const OwlCarousel = dynamic(import("react-owl-carousel"), {ssr: false});

}


