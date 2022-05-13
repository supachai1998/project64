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
            setTitle("บทความทั้งหมด")
            setDefaultSelectedKeys("blogs")
            const data = await fetchData()
            setData(data)
            setStore(data)
        })()
    }, [router])
    if (!_data) return <div className='min-h-screen h-full'></div>
    return (
        <div className="min-h-screen mb-10 lg:mx-5" style={{ height: "fit-content" }}>
            <div className="justify-center mx-auto md:px-5 h-full">
                <div className="my-5 ">
                    <CusInput only="blogs" data={_data} setData={setData} store={store} setStore={setStore} loading={loading} setLoading={setLoading} />
                </div>
                <div className='grid grid-cols-1 lg:mx-5 sm:grid-cols-2 xl:grid-cols-4  gap-5 h-full'>
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

                            {approve && <div
                                key={id + index + name}
                                className="grid-cols-12 h-full  flex-warp rounded-xl  bg-gray-50 items-center  item shadow-xs  m-0 p-0">
                                {image && <CusImage src={image[0].name} alt={id} className="" width="100%" height="250px" preview={false} />}
                                {/* {!name_en && <Tooltip title={name_en}><p className="absolute bg-opacity-60 bg-gray-50 w-1.5/2 p-3 top-0 right-0 flex justify-center  rounded-xl font-bold text-base  ">{name_en}</p></Tooltip>} */}
                                <div className="w-full h-72 flex flex-col  p-3 ">
                                    <div className="flex flex-col p-2">
                                        <div className=" flex-col text-center mb-0 pr-5 pl-5">
                                            <Tooltip title={name}><p className="card-header">{name}</p></Tooltip>
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
                                        <hr className='mt-5' />
                                        <a onClick={() => { router.push(`/blogs/${type.toLowerCase()}/${id}`) }} className="w-32  mx-auto my-2  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 ">อ่านต่อ</a>
                                    </div>

                                </div>
                            </div>}
                        </>
                    ))}
                </div>

            </div>

        </div>
    )
}


const fetchData = async () => {
    const data = await fetch(`/api/getBlogs`).then(async res => {
        if (res.ok) {
            const _ = await res.json()
            return _
        } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร` })
    })


    // ----

    // console.log(id, title_th, title_en, data)
    return data
}