import { useRouter } from 'next/router'
import { Card, Divider, Modal, Typography, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { VideoCameraOutlined, CloseOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';



const { Meta } = Card;
const CustImage = dynamic(() => import("/components/cusImage.js"))


const NCDS = dynamic(() => import("/components/foods/ncds.js"),
    { ssr: false })
const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore.js"),
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
                        <div className='sm:w-10/12 mx-auto flex h-full rounded-md'><CustImage className="rounded-md" src={data.image[0].name} alt={"0"} width="100%" height="100%" preview={false} /></div>
                        <div className='absolute-center w-full text-center align-middle '>
                            <p className='text-6xl sm:text-9xl lg:text-9xl text-shadow  text-white my-auto p-0'>{data.name_th}</p>
                        </div>
                    </div>


                    <div className='card mv-10 w-11/12 mx-auto mt-5 sm:w-8/12'>
                        <div className="flex flex-col w-full px-4 h-full    text-center">
                            <p className="sm:text-4xl text-3xl font-bold text-green-800 ">{data.calories} กิโลแคลอรี่</p>
                            <div className="w-full ">
                                <p className='food-content-body'>{data.detail}</p>
                                <p className="food-content-header">วิธีการทำ</p>
                                <p className='food-content-body'>{data.proceduce.replace("\n", "\n")}</p>
                                <p className="food-content-header">ส่วนผสม</p>
                                <p className='food-content-body'>{data.ingredient}</p>

                            </div>
                            <div className='flex justify-end'>
                                <button href="#" className="w-32 text-lg border  rounded-3xl bg-white p-3 hover:text-black shadow-lg shadow-cyan-500/50" onClick={() => { setContent({ name_th: data.name_th, video: data.video }) }}> <i><VideoCameraOutlined className='text-lg' /></i> <span> ดูวิดีโอ</span></button>
                            </div>
                            <div className="flex gap-2 ">
                                {data.ref && data.ref.length > 0 && data.ref.map(({url}, index) =>
                                    <a href={url}  target="_blank" key={index} className='text-left no-underline text-black' rel="noreferrer">อ้างอิง {index+1}</a>
                                )}
                            </div>
                        </div>
                    </div>


                    <NCDS ncds={data.FoodNcds} />
                    <DisplayFoodReadMore data={blogTrends} title={`บทความ ${name}`} headTextColor={"text-green-900"} headLineColor={"bg-green-300"} />
                </div> : <>data not found</>
            }
            {content && <CusModal handleCancel={handleCancel} content={content} />}
        </div>
    )
}



const ncds = [
    {
        name_th: "โรคเบาหวาน",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        imgUrl: "https://www.poonrada.com/upload/sickness/2019/07/2127fc6c17b6571965a73fd94dd623ca.jpg",
        video: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        name_th: "ความดันโลหิตสูง",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // video: "https://youtu.be/FdOOBcN0Ws8",
        imgUrl: "https://www.poonrada.com/upload/sickness/2019/07/2127fc6c17b6571965a73fd94dd623ca.jpg",
        suggess: false,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        name_th: "โรคถุงลมโป่งพอง",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        video: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        name_th: "โรคหลอดเลือดสมอง",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // video: "https://youtu.be/FdOOBcN0Ws8",
        suggess: false,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        name_th: "โรคอ้วนลงพุง",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        video: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        name_th: "โรคมะเร็ง",
        detail: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // video: "https://youtu.be/FdOOBcN0Ws8",
        suggess: false,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },

]



const blogTrends = [
    {
        id: 0,
        type: "blogs",
        categories: "blogs_food",
        title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกัน",
        title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
        detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
        ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
        imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
    },

]


const CusModal = ({ handleCancel, content }) => {
    if (!content) return null
    const { name_th, video } = content
    return (
        <Modal title={<div className='flex w-full justify-between text-2xl '>{name_th} <CloseOutlined className="button-cus hover:bg-red-200" onClick={() => handleCancel()} /></div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
            <div className="h-96 sm:h-screen w-full p-0 m-0 "><ReactPlayer url={video} width="100%" height="100%" /></div>
        </Modal>
    );
};
