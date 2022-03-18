import { useRouter } from 'next/router'
import { Card, Modal, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';




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



export default function Index() {
    const router = useRouter()
    const query = router.query
    const { categories, food } = query
    const [category, setCategory] = useState(categories)
    const [content, setContent] = useState()
    const [data, setData] = useState(null)
    const [Loading, setLoading] = useState(null)
    useEffect(() => {
        setLoading(true)
        if (categories && food && !data) {
            (async () => {
                const data_categories = await fetch(`/api/getTypeFood`).then(res => res.ok && res.json())
                const data_food = await fetch(`/api/getFood?id=${food}`).then(res => res.ok && res.json())
                if (data_categories) {
                    const data = data_categories.find(({ name_en }) => name_en === categories)
                    // console.log(data_categories,categories,data)
                    if (data) setCategory(data.name_th)
                }
                if (data_food) {
                    setData(data_food)
                    // headerData = [
                    //     {
                    //         title: "วิธีการทำ",
                    //         content: "ต้มยำกุ้ง เป็นอาหารไทยภาคกลางประเภทต้มยำ ซึ่งเป็นที่นิยมรับประทานไปทุกภาคในประเทศไทย เป็นอาหารที่รับประทานกับข้าว และ มีรสเปรี้ยวและเผ็ดเป็นหลักผสมเค็มและหวานเล็กน้อย แบ่งออกเป็น 2 ประเภท คือ ต้มยำน้ำใส และ ต้มยำน้ำข้น"
                    //     },
                }
                console.log(data_food)
            })()
        }
        setLoading(false)
    }, [categories, data, food, query])
    const handleCancel = () => {
        setContent()
    }
    if (Loading) return <>กำลังดึงข้อมูล</>
    return (
        <div className="-mt-1 min-h-screen bg-gray-100">
            {data ?
                <div className="flex flex-col w-full h-full   ">
                    <div className="flex  flex-col bg-gray-100 ipad:flex-row relative h-96 md:h-super lg:h-very-super ">
                        <div className='sm:w-10/12 mx-auto flex h-full '><CustImage className="sm:rounded-md" src={data.image[0].name} alt={"0"} width="100%" height="100%" preview={false} /></div>
                        <div className='absolute-center w-full text-center align-middle '>
                            <p className='text-6xl sm:text-9xl lg:text-9xl text-shadow  text-white my-auto p-0'>{data.name_th}</p>
                        </div>
                    </div>


                    <div className='card mv-10 w-11/12 mx-auto mt-5 sm:w-8/12'>
                        <div className="flex flex-col w-full px-4 h-full    text-center">
                            <p className="sm:text-4xl text-3xl font-bold text-green-800 ">{data.calories} กิโลแคลอรี่</p>
                            <div className="w-full ">
                                <p className='food-content-body'>{data.detail.replace("<br/>", "\n")}</p>
                                <p className="food-content-header">วิธีการทำ</p>
                                <p className='food-content-body'>{data.proceduce.replace("<br/>", "\n")}</p>
                                <p className="food-content-header">ส่วนผสม</p>
                                <p className='food-content-body'>{data.ingredient.replace("<br/>", "\n")}</p>

                            </div>
                            <div className='flex justify-between items-center'>
                                <div className="flex gap-2 ">
                                    {data.ref && data.ref.length > 0 && data.ref.map(({ url }, index) =>
                                        <a href={url} target="_blank" key={index} className='text-left no-underline text-black' rel="noreferrer">{index === data.ref.length - 1 ? `อ้างอิง ${index + 1}` : `อ้างอิง ${index + 1},`}</a>
                                    )}
                                </div>
                                <button href="#" className="w-32 text-lg border  rounded-3xl bg-white sm:p-3 p-1  ease-anima hover:text-blue-400 shadow-lg shadow-cyan-500/50" onClick={() => { setContent({ name_th: data.name_th, video: data.video }) }}> <i><VideoCameraOutlined className='text-lg' /></i> <span> ดูวิดีโอ</span></button>
                            </div>
                        </div>
                    </div>


                    <NCDS ncds={data.FoodNcds} />
                    <BestFood />
                    <BestBlog />
                </div> : <>data not found</>
            }
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
