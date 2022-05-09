import { useRouter } from 'next/router'
import { Card, notification, Tooltip, Rate } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState, useContext } from 'react';
import { _AppContext } from '/pages/_app'




const { Meta } = Card;
const CusImage = dynamic(() => import('/components/cusImage.js'));
const CusInput = dynamic(() => import('/components/cusInput.js'));


export default function Index() {
    const { setTitle, setDefaultSelectedKeys } = useContext(_AppContext)

    const [_data, setData] = useState()
    const [store, setStore] = useState()
    const [loading, setLoading] = useState()
    const router = useRouter()
    useEffect(() => {
        (async () => {
            setTitle("อาหารทั้งหมด")
            setDefaultSelectedKeys("foods")
            const data = await fetchData()
            setData(data)
            setStore(data)
        })()
    }, [router])
    if (!_data) return <div className='min-h-screen'></div>
    return (
        <div className="mt-3 min-h-screen">
            <div className="justify-center  mx-auto md:px-5">
                <div className="my-5">
                    <CusInput only="food" data={_data} setData={setData} store={store} setStore={setStore} loading={loading} setLoading={setLoading} />
                </div>
                <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-6'>
                    {_data.map(({
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
                                key={id + index + name_th}
                                className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                                <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={200} preview={false} />
                                <div className='mx-5 mt-3'>
                                    <div className=" flex-col text-center my-2">
                                        <p className="card-header pt-3"> {name_th}</p>
                                        <p className="text-xs mb-2 mt-1 truncate text-gray-500 capitalize "> {name_en}</p>
                                    </div>
                                    <div className='text-center leading-none text-2xl '>
                                        <p className='mb-0 font-bold'>{calories}</p>
                                        <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                                    </div>
                                    <hr className='my-6' />
                                    <div className='flex justify-center justify-items-center mb-6'>
                                        <a onClick={() => router.push(`/foods/${foodTypeId}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                                    </div>

                                </div>
                            </div>}

                            {approve && <div
                                key={id + index + name}
                                className="grid-cols-12  flex-warp rounded-xl  bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                                <div className="relative w-full" >
                                    {image && <CusImage src={image[0].name} alt={id} className="" width="100%" height="200px" preview={false} />}
                                    {/* {!name_en && <Tooltip title={name_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{name_en}</p></Tooltip>} */}
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
                                            <a onClick={() => { router.push(`/blogs/${type.toLowerCase()}/${id}`) }} className="w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 m-5 ">อ่านต่อ</a>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                        </>
                    ))}
                </div>


                <div>

                </div>

            </div>

        </div>
    )
}


const fetchData = async () => {
    const data = await fetch(`/api/getFood`).then(async res => {
        if (res.ok) {
            const _ = await res.json()
            return _
        } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร` })
    })


    // ----

    // console.log(id, title_th, title_en, data)
    return data
}