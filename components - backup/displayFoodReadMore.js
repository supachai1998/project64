import { Carousel, Tooltip, Divider ,Rate,Select } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import router from 'next/router';
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion';

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
const customIcons = {
  1: <FrownOutlined className="text-red-600 stroke-current "/>,
  2: <FrownOutlined className="text-red-400"/>,
  3: <MehOutlined className="text-yellow-500"/>,
  4: <SmileOutlined className="text-green-400"/>,
  5: <SmileOutlined className="text-green-600"/>,
};
const {OptGroup,Option} = Select
export default function DisplayFoodReadMore({ data, title, headTextColor, headLineColor }) {

  
  return (
    <motion.div
      variants={fadeInUp}
      positionTransition
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
    >
        <Divider/>
      <div className="flex justify-between w-full px-3 py-3 transition-all duration-500 ease-in-out rounded-2xl">
        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
        <p className={headTextColor + " mt-4 text-4xl font-bold  transition transform font-Charm"}>{title}</p>

        {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
      </div>
      <div className={!!data && data.length % 2 === 0 ? "flex flex-wrap justify-center gap-6" : "flex flex-wrap gap-6"}>
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
            className="flex relative w-full lg:w-1.5/2  flex-warp rounded-xl  h-52 bg-gray-50 ">
            <div className={title ? "relative w-2/3 " : "relative w-1/2 "}>
              <CustImage src={imgUrl} alt={title_th} className="rounded-xl" width="100%" height="100%" preview={false} />
              {!title && <Tooltip title={title_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{title_th}</p></Tooltip>}
              {cal && <Tooltip title="ปริมาณแคลอรี่"><p className="absolute bottom-0 left-0 p-2 text-xs text-left bg-opacity-60 bg-gray-50 sm:text-sm rounded-xl">{cal} KgCal</p></Tooltip>}
            </div>
            <div className={title ? "w-full h-52 flex flex-col overflow-auto p-1 " : " w-1.5/2 h-52 flex flex-col overflow-auto"}>
              {positive && nagative ? <Carousel autoplay className="z-0 " autoplaySpeed={15000} >
                <div className="flex flex-col w-full h-full p-6 overflow-hidden text-gray-900 rounded-2xl ">
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
              </Carousel>
                :
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="mt-2 text-lg font-Charm">{title}</span>
                    <Tooltip title="อ่านต่อ"><a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className="w-12 text-purple-600 duration-1000 animate-pulse rounded-xl">อ่านต่อ</a></Tooltip>
                  </div>
                  <div className="flex justify-between ">
                    <Tooltip title={`คะแนนโหวต ${4}/${5}`} ><Rate disabled  defaultValue={4}  /> </Tooltip>
                    <span className="text-gray-500 font-Poppins">จากผู้โหวต {300} คน</span>
                  </div>
                  <p className="pr-3 mt-1 ">{intro}...</p>
                </div>
              }
            </div>


          </motion.div>
        ))}
      </div>
    </motion.div>

  )
}


