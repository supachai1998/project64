import { useRouter } from 'next/router'
import { Card, Modal, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState,useContext } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';
import { getCookie, setCookies } from 'cookies-next';
import { serverip } from '/config/serverip'
import {_AppContext} from '/pages/_app'


const { Meta } = Card;
const CustImage = dynamic(() => import("/components/cusImage.js"))
const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
});

const NCDS = dynamic(() => import("/components/foods/ncds.js"),
    { ssr: false })
const BestBlog = dynamic(() => import("/components/BestBlog.js"),
    { ssr: false })
const BestFood = dynamic(() => import("/components/BestFood.js"),
    { ssr: false })



/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Index(props) {
    const router = useRouter()
    const query = router.query
    const { categories, food } = query
    const [category, setCategory] = useState(categories)
    const [content, setContent] = useState()
    const [data, setData] = useState(null)
    const [Loading, setLoading] = useState(null)
    const {setTitle , setDefaultSelectedKeys} = useContext(_AppContext)
    const fetchData = async () => {
        setLoading(true)
        const data_categories = await fetch(`/api/getTypeFood`).then(res => res.ok && res.json())
        const data_food = await fetch(`/api/getFood?id=${food}`).then(res => res.ok && res.json())
        if (data_categories) {
            const data = data_categories.find(({ name_en }) => name_en === categories)
            if (data) setCategory(data.name_th)
        }
        if (data_food) {
            console.log(data_food)
            setData(data_food)
            setTitle(data_food.name_th)
        }
        setLoading(false)
    }
    useEffect(() => {
        setDefaultSelectedKeys(`foods_${categories}`)
        if (categories && food ) {
            fetchData()
        }
    }, [categories, food , query])
    const handleCancel = () => {
        setContent()
    }
    if (!food) return null
    if (Loading) return <div className="min-h-screen">กำลังดึงข้อมูล</div>
    if (!data) return <div className="min-h-screen">ไม่พบข้อมูล</div>
    return (
        <div className="-mt-1 min-h-screen bg-gray-100">
            <div className="flex flex-col w-full h-full   ">
                <div className="flex  flex-col bg-gray-100 ipad:flex-row relative h-96 md:h-super lg:h-1/3 ">
                    <div className='sm:w-10/12 mx-auto flex  h-very-super'><CustImage className="sm:rounded-md" src={data.image[0].name} alt={"0"} width="100%" height="100%" preview={false} /></div>
                    <div className='absolute-center w-full text-center align-middle '>
                        <div className='my-auto p-0 flex flex-col gap-5'>
                            <span className='text-6xl lg:text-9xl  text-shadow  text-white '>{data.name_th}</span> 
                        </div>
                    </div>
                </div>


                <div className='card mv-10 w-11/12 mx-auto mt-5 sm:w-8/12'>
                    <div className="flex flex-col w-full px-4 h-full    text-center">
                    <span className='text-lg sm:text-xl    text-black my-auto p-0 capitalize  '>{data.name_en}</span>
                        <p className="sm:text-4xl text-3xl font-bold text-green-800 my-5">{data.calories} กิโลแคลอรี่</p>
                        <div className="w-full ">
                        
                            <p className='food-content-body'>{data.detail}</p>
                            <hr className="my-6"/>
                            <p className="food-content-header">วิธีการทำ</p>
                            <p className='food-content-body'>{data.proceduce}</p>
                            <hr className="my-6"/>
                            <p className="food-content-header">ส่วนผสม</p>
                            <p className='food-content-body'>{data.ingredient}</p>

                        </div>
                        <hr className="my-5"/>
                        <div className='flex md:flex-row flex-col gap-3 flex-warp justify-between items-start'>
                            
                            <div className="flex flex-col justify-start flex-warp w-full overflow-hidden">
                                <h3 className="text-left">อ้างอิง</h3>
                                    {data.ref && data.ref.length > 0 && data.ref.map(({ url }, index) =>
                                    <><a href={url.split(",").at(-1)} target="_blank" key={index} className='text-left no-underline text-black whitespace-pre-wrap ' rel="noreferrer">{url}</a><br/> </>
                                    )}
                            </div>        
                        </div>
                        {data?.video && <div className="flex justify-end w-full mt-3"> 
                                     <button href="#" className="w-32 text-lg border rounded-3xl bg-white sm:p-3 p-1  ease-anima hover:text-blue-400 shadow-lg shadow-cyan-500/50" onClick={() => { setContent({ name_th: data.name_th, video: data.video }) }}> <i><VideoCameraOutlined className='text-lg' /></i> <span> ดูวิดีโอ</span></button> </div>}
                    </div>
                </div>
                <p className='text-right'>ยอดเข้าชม {data.views} ยอด</p>


                <NCDS ncds={data.FoodNcds} />
                <BestFood title="อาหารแนะนำ"/>
                <BestBlog title="บทความแนะนำ"/>
            </div>

            {content && <CusModal handleCancel={handleCancel} content={content} />}
        </div>
    )
}




const CusModal = ({ handleCancel, content }) => {
    if (!content) return null
    const { name_th, video } = content
    return (
        <Modal title={<div className='flex w-full justify-between text-2xl '>{name_th} </div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={true}>
            <div className="h-96 sm:h-screen w-full p-0 m-0 "><ReactPlayer url={video} width="100%" height="100%" /></div>
        </Modal>
    );
};




export async function getServerSideProps({ req, res, query }) {
    try {
        const { food } = query
        // const token = headers.cookie.split("=")[1].split(";")[0]
        if (/^-?\d+$/.test(food)) {
            const cookie_ref = getCookie(`food${food}`, { req, res })
            if (!cookie_ref) {
                setCookies(`food${food}`, true, { req, res, maxAge: 60 * 60 * 24 * 30 })
                // console.log("update views", food)
                fetch(`${serverip}/api/getFood?views=${food}`, { method: "PATCH", })
                    .then(resq => resq.ok)
            }

        }
    } catch (e) { }
    return {
        props: {},
    }
}