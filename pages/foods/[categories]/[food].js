import { useRouter } from 'next/router'
import { Card, Divider, Modal, Typography, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { CloseOutlined, VideoCallOutlined } from '@mui/icons-material';
import ReactPlayer from 'react-player';



const { Meta } = Card;
const CustImage = dynamic(() => import("/components/cusImage.js"))


const Ncds = dynamic(() => import("/components/foods/ncds.js"),
    { ssr: false })
const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore.js"),
    { ssr: false })


export default function Index() {
    const router = useRouter()
    const query = router.query
    const { categories, food } = query
    const [category, setCategory] = useState(categories)
    const [data, setData] = useState(null)
    useEffect(() => {
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
    }, [categories, data, food, query])
    return (
        <div className="mt-3 min-h-screen">
            {data ?
                <div className="flex flex-col w-full h-full   ">
                    <div className="flex flex-col bg-gray-50 ipad:flex-row relative h-96 md:h-super lg:h-very-super ">
                        <CustImage src={data.image[0].name} alt={"0"} width="100%" height="100%" preview={false} />
                        <div className='absolute-center w-full text-center align-middle '>
                            <p className='text-6xl sm:text-9xl lg:text-super text-shadow  text-white my-auto p-0'>{data.name_th}</p>
                        </div>
                    </div>


                    <div className='card mv-10 w-11/12 mx-auto mt-5'>
                        <div className="flex flex-col w-full px-4 h-96 sm:h-1/4 sm:gap-y-2 gap-y-12  text-center">
                            <div className="h-1/4">
                                {/* <p className="pl-1 text-2xl font-thin  border-indigo-700 font-Charm border-l-2">{headerData[2].title}</p> */}
                                <p className="-mt-2  text-gray-500 text-3xl" ><span className="mr-10">{data.categories}</span></p>
                            </div>
                                <hr className="w-1/12 mx-auto border-red-600" />
                                <div className="h-1/4 mx-auto">

                                    <p className="pr-1 text-2xl font-thin  lg:text-2xl font-Charm">วิธีการทำ</p>
                                    <Typography className={`pr-2 -mt-2 overflow-auto zm:h-20 text-left`}>
                                        <span className='text'>{data.proceduce}</span>
                                    </Typography>
                                
                                </div>
                            <div className='flex justify-end'>
                                <button href="#" className="w-32 border  rounded-3xl bg-white p-3 hover:text-black shadow-lg shadow-cyan-500/50"> <i><VideoCallOutlined className='text-lg' /></i> <span> ดูวีดีโอ</span></button>
                            </div>
                        </div>
                    </div>


                    <Ncds ncds={ncds} />
                    <DisplayFoodReadMore data={blogTrends} title={`บทความ ${name}`} headTextColor={"text-green-900"} headLineColor={"bg-green-300"} />
                </div> : <>data not found</>
            }
        </div>
    )
}

const headerData = [
    {
        title: "วิธีการทำ",
        content: "ต้มยำกุ้ง เป็นอาหารไทยภาคกลางประเภทต้มยำ ซึ่งเป็นที่นิยมรับประทานไปทุกภาคในประเทศไทย เป็นอาหารที่รับประทานกับข้าว และ มีรสเปรี้ยวและเผ็ดเป็นหลักผสมเค็มและหวานเล็กน้อย แบ่งออกเป็น 2 ประเภท คือ ต้มยำน้ำใส และ ต้มยำน้ำข้น"
    },
    {
        title: "คุณค่าทางโภชนาการ",
        content: "อาหารที่อุดมด้วย แร่ธาตุ โปรตีน และคาร์โบไฮเดรต มีไขมันน้อย กุ้งเป็นเนื้อสัตว์ที่มีโคเลสเตอรอลชนิดที่ดี มีประโยชน์ต่อร่างกาย สามารถช่วยลดความเสี่ยงต่อการเกิดโรคหัวใจได้อีกด้วย รวมทั้งมีธาตุสังกะสีและซีลีเนียมในปริมาณสูง ช่วยเสริมสร้างภูมิคุ้มกัน เพิ่มความต้านทานต่อการติดเชื้อ เครื่องสมุนไพรต้มยำ เช่น ข่า ตะไคร้ ใบมะกรูดมีสรรพคุณแก้ท้องอืด แก้ไอ แก้ช้ำใน ขับลมในลำไส้ แก้คลื่นเหียน แก้จุกเสียด ได้ดี"
    },
    {
        title: "ปริมาณพลังงานที่ได้รับ",
        content: "436.85 กิโลแคลอรี่"
    },
]

const ncds = [
    {
        ncds: "โรคเบาหวาน",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        imgUrl: "https://www.poonrada.com/upload/sickness/2019/07/2127fc6c17b6571965a73fd94dd623ca.jpg",
        videoUrl: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        ncds: "ความดันโลหิตสูง",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // videoUrl: "https://youtu.be/FdOOBcN0Ws8",
        imgUrl: "https://www.poonrada.com/upload/sickness/2019/07/2127fc6c17b6571965a73fd94dd623ca.jpg",
        suggess: false,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        ncds: "โรคถุงลมโป่งพอง",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        videoUrl: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        ncds: "โรคหลอดเลือดสมอง",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // videoUrl: "https://youtu.be/FdOOBcN0Ws8",
        suggess: false,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        ncds: "โรคอ้วนลงพุง",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        videoUrl: "https://youtu.be/FdOOBcN0Ws8",
        suggess: true,
        ref: "https://www.poonrada.com/sickness/detail/87",
    },
    {
        ncds: "โรคมะเร็ง",
        because: "สามารถทานได้ในปริมาณที่จำกัด และควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล หากต้มยำกุ้งใส่กะทิไม่ควรทานและไม่ควรทานเค็ม",
        // videoUrl: "https://youtu.be/FdOOBcN0Ws8",
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
    if (!content){return null}
    const { videoUrl, title } = content
    return (
        <>
            <Modal title={<div className='flex w-full justify-between '>{title} <CloseOutlined className="button-cus hover:bg-red-200" onClick={()=>handleCancel()}/></div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
                <div className="h-screen w-full p-0 m-0 "><ReactPlayer url={videoUrl} width="100%" height="100%" /></div>
            </Modal>
        </>
    );
};
