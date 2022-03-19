import { useRouter, createRef, useRef } from 'next/router'
import { notification } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import BestFood from '../../components/BestFood';
import Owl_Carousel from '../../components/Owl_Carousel';


const CustImage = dynamic(() => import("/components/cusImage.js"))
const ContentHeader = dynamic(() => import("../../components/ncds/contentheader"))

const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore.js"),
    { ssr: false })
const DisplayBlogReadMore = dynamic(() => import("/components/displayBlogReadMore"),
    { ssr: false })

export default function Index() {
    const [NCDS, setNCDS] = useState()
    const [headerData, setHeaderData] = useState()
    const [loading, setloading] = useState()
    const [casImg, setCasImg] = useState(0)

    const router = useRouter()
    const { categories, name } = router.query
    useEffect(() => {
        setloading(true)
        if (categories && !NCDS) {
            (async () => {
                await fetch(`/api/getNCDS?id=${categories}`).then(res => res.ok ? res.json() : notification.error({ message: "Error", description: "ไม่พบข้อมูล" }))
                    .then(data => {
                        // title , content
                        console.log(data)
                        setNCDS(data)
                        setHeaderData([
                            { title: "สาเหตุ", content: data.cause },
                            { title: "ลดความเสี่ยงต่อการเกิดโรค", content: data.reduce },
                            { title: "สัญญาณการเกิดโรค", content: data.signs },
                            { title: "คำแนะนำในการปฎิบัติตัว", content: data.sugess },
                        ])
                    })
                    .catch(err => notification.error({ message: "ไม่สามารถดึงข้อมูลได้", description: err.message }))

            })()
        }
        setloading(false)
    }, [NCDS, categories])
    useEffect(() => { return () => setNCDS() }, [router.query])
    useEffect(() => {
        if (NCDS) {
            const timmer = setInterval(() => {
                setCasImg(casImg => casImg < NCDS.image.length-1 ? casImg += 1 : casImg = 0)
            },10000)
            return () => clearInterval(timmer)
        }
    },[NCDS, casImg])
    if (loading) return <>กำลังดึงข้อมูลโรคไม่ติดต่อ</>
    if (!NCDS) return <>ไม่พบข้อมูลโรค</>
    return (
        <>
            {!!NCDS &&
                <div className="flex flex-col justify-center w-full h-full min-h-screen gap-4 mx-auto">
                    <div className="text-center p-5 w-full">

                        <CustImage className="rounded-lg " src={NCDS?.image[casImg]?.name} alt={NCDS.name_th} width="80vw" height="50vh" />

                        <p className='w-2/3 text-left ml-auto mr-auto mt-3'>{NCDS.imply}</p>
                        <div className='border-green-800 border-b-2 border-solid w-8/12 mx-auto' ></div>
                    </div>
                    <ContentHeader headerData={headerData} url_yt={NCDS.video} />

                    <div className=''>
                        <BestFood />
                        <DisplayFoodReadMore data={NCDSTrends} title={`บทความยอดนิยม`} />
                    </div>
                </div>
            }
        </>
    )
}



const NCDSTrends = [
    {
        id: 0,
        type: "NCDSs",
        categories: "NCDSs_food",
        title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกัน",
        title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
        intro: "7 เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน วัตถุดิบและกรรมวิธีการทำอาหารของไทยนั้นเป็นยาดีเพิ่มภูมิคุ้มกันให้ร่างกายของเราได้ด้วยตัวของมันอยู่แล้ว",
        detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
        ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
        imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
    },

]