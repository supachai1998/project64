import { useRouter } from 'next/router'
import { Card, Divider, notification, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';



const { Meta } = Card;
const _Categories = dynamic(() => import("/components/foods/categories.js"),
    { ssr: false })


export default function Index() {
    const [_data, setData] = useState()
    const [store, setStore] = useState()
    const router = useRouter()
    const { categories } = router.query
    useEffect(()=>{
        return () => setData()
    },[categories])
    return (
        <div className="mt-3">
            {categories &&
                <div className="justify-center min-h-screen mx-auto md:px-5">
                    {/* <div className="w-full bg-gray-300 sm:h-96 h-52">
                            <CustImage src={"https://s359.kapook.com/pagebuilder/1f12afa5-ed83-4fd6-b9e7-8c670d941668.jpg"} alt={"0"} className="" width="100%" height="100%" preview={false} />
                        </div> */}

                    <_Categories _data={_data} setData={setData} store={store} setStore={setStore} fetchData={fetchData} categories={categories} placeholder={"ชื่ออาหาร , ปริมาณพลังงานที่ได้รับ"} />

                </div>
            }
        </div>
    )
}








const fetchData = async (categories) => {
    const raw = await fetch("/api/getTypeFood").then(async res => {
        if (res.ok) {
            const data = await res.json()
            if (data) {
                const findCatetory = data.find(item => item.id === parseInt(categories))
                if(!findCatetory) return null
                return { id: findCatetory.id, title_th: findCatetory.name_th, title_en: findCatetory.name_en }
            }
        } else notification.error({ message: `ไม่สามารถดึงข้อมูลประเภทอาหาร${categories}` })
    })
    if(!raw) return null
    const { id, title_th, title_en } = raw
    const data = await fetch(`/api/getFood?categories=${id}`).then(async res => {
        if (res.ok) {
            const _ = await res.json()
            try {
                // const __ = _.map(data => { return { id: data.id, title: data.name_th, detail: data.calories, imgUrl: data.image[0].name || null } })
                return _
            } catch (err) { console.error(err);notification.error({ message: `ไม่สามารถแมพข้อมูลอาหาร${categories}` }) }
        } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร${categories}` })
    })


    // ----

    // console.log(id, title_th, title_en, data)
    return { title_th, title_en, data }
}