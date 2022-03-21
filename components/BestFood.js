/* eslint-disable react/jsx-key */
import { notification } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const CusImage = dynamic(() => import('./cusImage.js'));
const Owl_Carousel = dynamic(() => import('./Owl_Carousel.js'));

export default function BestFood() {

    const [_data, setData] = useState()

    const router = useRouter()
    const fetchData = async () => {
        const data = await fetch(`/api/getFood?BestFood=${true}`).then(async res => {
            if (res.ok && res.status === 200) {
                const _ = await res.json()
                return _
            } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร` })
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
            title={"อาหารยอดนิยม"}
            link="/food"
            info_top={`พบ ${_data.length} รายการ`}
            info_down={`อ่านทั้งหมด`}
        >
            <>
                {_data && _data.map(({ id, name_th, foodTypeId, calories, image, name_en }, index) => (
                    <div
                        key={id + index + Math.random()}
                        className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                        <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={200} preview={false} />
                        <div className='mx-5 mb-2 lg:mb-10'>
                            <div className=" flex-col text-center mb-0">
                                <p className="card-header"> {name_th}</p>
                                <p className=" text-xs sm:text-sm pb-0 truncate text-gray-500"> {name_en}</p>
                            </div>
                            <div className='text-center leading-none text-2xl '>

                                <p className='mb-0 font-bold'>{calories}</p>
                                <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                            </div>
                            <hr className='mb-3' />
                            <div className='flex justify-center justify-items-center pb-3'>
                                <a onClick={() => router.push(`/foods/${foodTypeId}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                            </div>

                        </div>
                    </div>
                ))}
            </>
        </Owl_Carousel>

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