/* eslint-disable react/jsx-key */
import { notification } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const CusImage = dynamic(() => import('./cusImage.js'));
const Owl_Carousel = dynamic(() => import('./Owl_Carousel.js'));

export default function BestFood() {
    const router = useRouter()

    const [_data, setData] = useState()
    const { blog, food, categories } = router.query
    const fetchData = async (api) => {
        const data = await fetch(api).then(async res => {
            if (res.ok && res.status === 200) {
                const _ = await res.json()
                return _
            } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร` })
        })

        return data
    }
    useEffect(() => {
        (async () => {
            console.log(router.query)
            let api = ""
            if(food){
                api = `/api/getFood?BestFood=${true}&self=${food}`
            }else if (categories) {
                api = `/api/getFood?BestFood=${true}&self=${categories}`
            }else if (blog) {
                api = `/api/getFood?BestFood=${true}&blog=${blog}`
            }else{
                api = `/api/getFood?BestFood=${true}`
            }
            if (api !== "") {
                const data = await fetchData(api)
                !!data && setData([...data])
            }
        })()

    }, [ blog, categories, food, router.query])

    if (!_data && !Array.isArray(_data)) return null
    const handleLinkClick = (foodTypeId,id) => {
        router.push(`/foods/${foodTypeId}/${id}`)
    }
    return (

        <Owl_Carousel
            title={"อาหารยอดนิยม"}
            link={blog ? `/foods/${blog}`:`/foods`}
            info_top={`พบ ${_data.length} รายการ`}
            info_down={`อ่านทั้งหมด`}
        >
            <>
                {_data && _data.map(({ id, name_th, foodTypeId, calories, image, name_en }, index) => (
                    <div
                        key={id + index + Math.random()}
                        className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                        <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={250} preview={false} />
                        <div className='mx-5 mb-2 lg:mb-10 flex flex-col gap-3'>
                            <div className=" flex-col text-center mb-0">
                                <p className="card-header"> {name_th}</p>
                                <hr className='my-3 mx-20 border-b border-blue-900' />
                                <p className=" text-xs sm:text-sm pb-0 truncate text-gray-500"> {name_en}</p>
                            </div>
                            <div className='text-center leading-none text-2xl '>
                                <p className='mb-0 font-bold'>{calories}</p>
                                <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                            </div>
                            <hr className='mb-3' />
                            <div className='flex justify-center justify-items-center pb-3'>
                                <a onClick={()=>handleLinkClick(foodTypeId,id)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                            </div>

                        </div>
                    </div>
                ))}
            </>
        </Owl_Carousel>

    )
}
