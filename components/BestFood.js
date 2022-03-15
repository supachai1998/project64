/* eslint-disable react/jsx-key */
import { Card, Input, notification, Tooltip } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import { motion } from 'framer-motion';
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
    ssr: false,
});
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./cusImage.js'));

export default function BestFood() {

    const [_data, setData] = useState()
    const [loading, setLoading] = useState(false)

    const router = useRouter()
    const fetchData = async () => {
        setLoading(true)
        const data = await fetch(`/api/getFood?BestFood=${true}`).then(async res => {
            if (res.ok) {
                const _ = await res.json()
                return _
            } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร` })
        })
        
        setLoading(false)
        return  data 
    }
    useEffect(() => {
        (async () => {
            if (!_data) {
              const data =  await fetchData()
              setData(data)
            }
        })()
    }, [_data])

    if (!!!_data) return null
    return (

        <motion.div
            variants={fadeInUp}
            positionTransition
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className='md:w-full pl-3 pr-4 sm:px-0 md:mx-2 '
        >

            <div className="flex justify-center flex-col w-full px-3 py-3 transition-all duration-500 ease-in-out rounded-2xl ">
                {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
                <p className={" card-header-top"}>อาหารยอดนิยม</p>
                <span className=' w-full text-right mb-4 border-b border-b-green' >
                    <a href="#" className='hover:text-gray-500 text-black'>
                        พบ {_data.length} รายการ
                    </a>
                </span>
                {/* <div className={headLineColor + " w-full  h-0.5 transition-all duration-75 transform ease-in animate-pulse"}></div> */}
            </div>
            <div className='m-2 sm:m-10 mt-0'>
                <OwlCarousel
                    loop={false}
                    items={3}
                    responsiveRefreshRate={0}
                    // autoplay={true}
                    // autoplayTimeout={7000}
                    // autoplayHoverPause={true}
                    nav={true}
                    responsiveClass={true}
                    responsive={state.responsive}
                    navText={[
                        '<i class="icon-arrow-prev w-6 h-6  md:w-10 md:h-10"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left"  fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
                        '<i class="icon-arrow-next w-6 h-6  md:w-10 md:h-10"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
                    ]}
                    dots={true}
                    margin={1} >

                    {_data && _data.map(({ id, name_th, calories, image,name_en }, index) => (
                        <motion.div
                            variants={fadeInUp}
                            positionTransition
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            key={id + index + Math.random()}
                            className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                            <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={200} preview={false} />
                            <div className='mx-5 mb-2 lg:mb-10'>
                                <div className=" flex-col text-center mb-0">
                                    <p className="card-header"> {name_th}</p>
                                    <p className="font-Charm text-xs pb-0 truncate text-gray-500"> {name_en}</p>
                                </div>
                                <div className='text-center leading-none text-2xl '>

                                    <p className='mb-0 font-bold'>{calories}</p>
                                    <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                                </div>
                                <hr className='mb-3' />
                                <div className='flex justify-center justify-items-center '>
                                    <a onClick={() => router.push(`/foods/${categories}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                                </div>

                            </div>
                        </motion.div>

                    ))}
                </OwlCarousel>
                <div className='flex justify-end text-lg'>
                    <a href="#" className={`text-right text-gray-500 hover:text-black sm:mt-0 -mt-10`}>อ่านทั้งหมด</a>
                </div>
            </div>
        </motion.div>
    )
}


const easing = [0.6, -0.05, 0.01, 0.99];
const state = {
    responsive: {
        0: {
            items: 1,
        },
        450: {
            items: 1,
        },
        750: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1250: {
            items: 4,
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