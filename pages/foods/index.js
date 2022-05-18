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
    const [input, setInput] = useState()
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
        <div className="mt-3 min-h-screen mx-auto  w-full sm:w-11/12">
            <div className="justify-center   ">
                <div className="my-5">
                    <CusInput only="food" data={_data} input={input} setInput={setInput} setData={setData} store={store} setStore={setStore} loading={loading} setLoading={setLoading} />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 w-full'>
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
                                // style={{width:"fit-content"}}
                                className="grid-cols-12  flex-warp rounded-xl  h-full bg-gray-50 items-center justify-center  item shadow-xs w-full  m-0 p-0">
                                <div className="w-full"><CusImage className="duration-150 transform w-full" src={image[0].name} alt={"0"} width="100%" height={250} preview={false} /></div>
                                <div className='mx-5 mt-3'>
                                    <div className=" flex-col text-center my-2">
                                        <p className="card-header pt-3"> {name_th}</p>
                                        <p className="text-xs mb-2 mt-1 truncate text-gray-500 capitalize "> {name_en}</p>
                                    </div>
                                    <div className='text-center leading-none text-2xl '>
                                        <p className='mb-0 font-bold'>{calories}</p>
                                        <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                                    </div>
                                    <hr className='mt-3' />
                                    <div className='flex justify-center justify-items-center '>
                                        <a onClick={() => router.push(`/foods/${foodTypeId}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 my-3'>อ่านต่อ</a>
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