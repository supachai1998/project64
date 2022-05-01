/* eslint-disable react/jsx-key */
import { Tooltip, Rate } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import {CloseCircleOutlined} from '@ant-design/icons'
const CusImage = dynamic(() => import('./cusImage.js'));
const Owl_Carousel = dynamic(() => import('./Owl_Carousel.js'));

export default function MultiCard({ loading, data,setData, title }) {
    const router = useRouter()

    if (loading) return null
    if (!!!data || !Array.isArray(data) || data?.length <= 0) return null
    console.log(data)
    const handleCancle = () =>{
        setData()
    }
    return (
        <Owl_Carousel
            title={title}
            info_top={<div className='flex gap-1 my-1 sm:text-md text-xs justify-end items-center'>พบ {data.length} รายการ <Tooltip title="ยกเลิก"><CloseCircleOutlined className="text-red-500" onClick={handleCancle}/></Tooltip></div>}
            info_down={`อ่านทั้งหมด`}
        >
            <>
                {data.map(({
                    id,
                    name_th,
                    foodTypeId,
                    calories,
                    image,
                    name_en,
                    type,
                    name,
                    imply,
                    avg_vote,
                    approve,
                    total_vote, }, index) => (
                    <>
                        {/* ถ้าเป็นอาหาร จะเข้าการ์ดอาหาร */}
                        {foodTypeId && <div
                            key={id + index + Math.random()}
                            className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                            <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={200} preview={false} />
                            <div className='mx-5 mb-2 lg:mb-10 my-5'>
                                <div className=" flex-col text-center mb-0">
                                    <p className="card-header pt-3"> {name_th}</p>
                                    <p className=" text-xs sm:text-sm pb-0 truncate text-gray-500"> {name_en}</p>
                                </div>
                                <div className='text-center leading-none text-2xl  my-10'>

                                    <p className='mb-0 font-bold'>{calories}</p>
                                    <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                                </div>
                                <hr className='mb-3' />
                                <div className='flex justify-center justify-items-center pb-3 '>
                                    <a onClick={() => router.push(`/foods/${foodTypeId}/${id}`)} className='w-32 my-5 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                                </div>

                            </div>
                        </div>}

                        {approve && <div
                            key={id + index + Math.random()}
                            className="grid-cols-12  flex-warp rounded-xl  bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                            <div className="relative w-full" >
                                {image && <CusImage src={image[0].name} alt={id} className="" width="100%" height="200px" preview={false} />}
                                {/* {!name_en && <Tooltip title={name_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{name_en}</p></Tooltip>} */}
                                {calories && <Tooltip title="ปริมาณแคลอรี่"><p className="absolute bottom-0 left-0 p-2 text-xs text-left bg-opacity-60 bg-gray-50 sm:text-sm rounded-xl">{calories} KgCal</p></Tooltip>}
                            </div>
                            <div className={name ? "w-full h-full flex flex-col  p-3 " : " sm:w-1.5/2 h-full flex flex-col overflow-auto"}>

                                <div className="flex flex-col p-2">
                                    <div className=" flex-col text-center mb-0 pr-5 pl-5">
                                        <p className="card-header pt-3 ">{name}</p>
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
                                        <a onClick={() => { router.push(`/blogs/${type.toLowerCase()}/${id}`) }} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 m-5 ">อ่านต่อ</a>
                                    </div>
                                </div>

                            </div>
                        </div>}
                    </>
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