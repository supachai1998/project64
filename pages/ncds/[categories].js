import { useRouter, createRef, useRef } from 'next/router'
import { notification, Tooltip } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { getCookie, setCookies } from 'cookies-next';
import { serverip } from '/config/serverip'

const CustImage = dynamic(() => import("/components/cusImage"))
const BestFood = dynamic(() => import("/components/BestFood"))
const BestBlog = dynamic(() => import("/components/BestBlog"))
const ContentHeader = dynamic(() => import("../../components/ncds/contentheader"))

export default function Index() {
    const [NCDS, setNCDS] = useState()
    const [headerData, setHeaderData] = useState()
    const [loading, setloading] = useState()
    const [casImg, setCasImg] = useState(0)

    const router = useRouter()
    const { categories, name } = router.query
    const fetchData = async () => {
        setloading(true)
        await fetch(`/api/getNCDS?id=${categories}`).then(res => res.ok ? res.json() : notification.error({ message: "Error", description: "ไม่พบข้อมูล" }))
            .then(data => {
                // title , content
                setNCDS(data)
                setHeaderData([
                    { title: "สาเหตุ", content: data.cause },
                    { title: "ลดความเสี่ยงต่อการเกิดโรค", content: data.reduce },
                    { title: "สัญญาณการเกิดโรค", content: data.signs },
                    { title: "คำแนะนำในการปฎิบัติตัว", content: data.sugess },
                ])
            })
            .catch(err => notification.error({ message: "ไม่สามารถดึงข้อมูลได้", description: err.message }))
        setloading(false)
    }
    useEffect(() => {
        if (categories && !NCDS) {
            fetchData()
        }
    }, [NCDS, categories])
    useEffect(() => { return () => setNCDS() }, [router.query])
    useEffect(() => {
        if (NCDS) {
            const timmer = setInterval(() => {
                setCasImg(casImg => casImg < NCDS.image.length - 1 ? casImg += 1 : casImg = 0)
            }, 10000)
            return () => clearInterval(timmer)
        }
    }, [NCDS, casImg])
    if (loading) return <>กำลังดึงข้อมูลโรคไม่ติดต่อ</>
    if (!NCDS) return <>ไม่พบข้อมูลโรค</>
    return (
        <div className="flex flex-col justify-center w-full h-full min-h-screen gap-4 mx-auto">
            <div className="text-center w-full">
                {/* Custom image */}
                <div className='flex flex-col justify-center items-center gap-4'>
                    <div className="sm:w-11/12 sm:h-96 h-60"><CustImage className="rounded-lg " src={NCDS?.image[casImg]?.name} alt={NCDS.name_th} width="100%" height="100%" /></div>
                    <div className="flex gap-2">
                        {NCDS?.image.map(({ name }, i) => <Tooltip key={i + name} title={`รูป ${i + 1}`}><button onClick={() => setCasImg(i)} className={`w-2 h-2 rounded-full  hover:bg-gray-900 ease-anima ${casImg === i ? "bg-gray-900 animate-pulse" : "bg-gray-400"}`} /></Tooltip>)}
                    </div>
                </div>
                {/* Custom image */}
                <p className='w-2/3 text-left ml-auto mr-auto mt-3'>{NCDS.imply}</p>
                <div className='border-green-800 border-b-2 border-solid w-8/12 mx-auto' ></div>
            </div>
            <ContentHeader headerData={headerData} url_yt={NCDS.video} />
            <span className="flex justify-end w-full">ยอดเข้าชม {NCDS?.views} ครั้ง</span>
            <div className=''>
                <BestFood />
                <BestBlog />
            </div>
        </div>
    )
}



export async function getServerSideProps({ req, res, query }) {
    try {
        const { categories } = query

        // const token = headers.cookie.split("=")[1].split(";")[0]
        if (/^-?\d+$/.test(categories)) {
            const cookie_ref = getCookie(`NCDS${categories}`, { req, res })
            if (!cookie_ref) {
                setCookies(`NCDS${categories}`, true, { req, res, maxAge: 60 * 60 * 24 * 30 })
                console.log("update views", categories)
                fetch(`${serverip}/api/getNCDS?views=${categories}`, { method: "PATCH", })
                    .then(resq => resq.ok)
            }

        }
    } catch (e) { }
    return {
        props: {},
    }
}