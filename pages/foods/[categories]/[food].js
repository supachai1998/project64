import { useRouter } from 'next/router'
import { Card, Divider, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';



const { Meta } = Card;
const CustImage = dynamic(() => import("/components/cusImage.js"))
const Topic = dynamic(() => import("/components/foods/topic.js"),
    { ssr: false })
const _Categories = dynamic(() => import("/components/foods/categories.js"),
    { ssr: false })
const ContentHeader = dynamic(() => import("/components/foods/contentheader.js"))
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
    }, [categories, food, query])
    return (
        <div className="mt-3 min-h-screen">
            {data ?
                <div className="flex flex-col w-full h-full   ">
                    <div className="flex flex-col bg-gray-50 ipad:flex-row relative ">
                        <CustImage src={"https://sg.fiverrcdn.com/photos/112566478/original/386e485f0d4853746792abe5e592480ec32c41d1.jpg?1527930323"} alt={"0"} width="100%" height="517px" preview={false} /></div>
                    <div className='absolute w-full text-center h-80 '>
                        <label className='font-Poppins text-10xl text-white my-auto p-0'>{data.name_th}</label>
                    </div>

                    <div className='card mv-10 w-11/12 mx-auto'>
                        <ContentHeader className="w-full " headerData={headerData} />
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