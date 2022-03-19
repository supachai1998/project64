import { useRouter } from 'next/router'
import { Card, Divider, } from 'antd';
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';


const { Meta } = Card;

const Topic = dynamic(() => import("/components/ncds/topic.js"),
    { ssr: false })
const Content = dynamic(() => import("/components/ncds/content.js"),
    { ssr: false })
const BestBlog = dynamic(() => import("/components/BestBlog.js"),
    { ssr: false })
const BestFood = dynamic(() => import("/components/BestFood.js"),
    { ssr: false })

export default function Index() {
    const [NCDS, setNCDS] = useState()
    const [bodyContent, setBodyContent] = useState()
    const router = useRouter()
    const { categories, ncds } = router.query
    useEffect(() => {
        if (ncds && !NCDS) {
            (async () => {
                const dataNCDS = await fetch(`/api/getNCDS?id=${ncds}`).then(res => res.ok ? res.json() : notification.error({ message: "Error", description: "ไม่พบข้อมูล" }))
                setNCDS(dataNCDS)
            })()
        }
        
    }, [NCDS, ncds])
    useEffect(()=>{
        return () => setNCDS()
    },[categories])
    return (
        <>
            {NCDS &&
                <div className="flex flex-col w-full h-auto min-h-screen gap-4 my-auto">
                    <div className="flex flex-col bg-gray-50 ipad:flex-row gap-y-1">
                        <Content className="w-full " bodyContent={bodyContent} />
                    </div>
                    <div className='mx-10'>
                        <Topic raw={data} categories={categories} placeholder={"ชื่อโรค , อาการ , สาเหตุ "} />
                        <BestFood/>
                        <BestBlog/>
                    </div>

                    {/* <Ncds ncds={ncds} /> */}
                </div>
            }
        </>
    )
}

const data = {
    title_th: "อาหารที่เกี่ยวข้อง", title_en: "soup",
    data: [
        { title: "ต้มยำกุ้ง", detail: "343", imgUrl: "https://static.naewna.com/uploads/news/source/561099.jpg" },
        { title: "ต้มยำไก่", detail: "395.4", imgUrl: "https://blog.samanthasmommy.com/wp-content/uploads/2019/01/klang-food-23161-8-2.jpg" },
        { title: "ต้มยำปลาทู", detail: "446.5", imgUrl: "https://img-global.cpcdn.com/recipes/d79ae43ed37668f0/1200x630cq70/photo.jpg" },
        // { title: "ต้มยำทะเล", detail: "365", imgUrl: "https://i.ytimg.com/vi/gjm1toMrY8g/maxresdefault.jpg" },
        // { title: "ต้มยำปลานิล", detail: "290", imgUrl: "https://i.ytimg.com/vi/idhojWWMYd0/maxresdefault.jpg" },
        // { title: "ต้มยำปลาแซลมอน", detail: "350", imgUrl: "https://i.pinimg.com/originals/b5/a1/fc/b5a1fc124918bf6edfdf17b90db4abfb.jpg" },
    ]
}
const bodyContent = [
    {
        title: "",
        imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/bread-2864703_640.jpg",
        content: "อาหารสำหรับผู้ป่วยเบาหวานคืออาหารทั่วไปไม่แตกต่างจากอาหารที่รับประทานเป็นปกติ แต่ควรเป็นอาหารที่ไม่หวานจัด โดยคำนึงถึงปริมาณ ชนิดของแป้ง และไขมันเป็นสิ่งสำคัญ เพื่อควบคุมระดับน้ำตาลและไขมันในเลือด รวมถึงการรักษาน้ำหนักตัวให้อยู่ในเกณฑ์ปกติ นอกจากนี้ ควรรับประทานอาหารให้เป็นเวลา และปริมาณที่ใกล้เคียงกันในแต่ละมื้อ โดยเฉพาะปริมาณคาร์โบไฮเดรตโดยรวม หากต้องการลดน้ำหนักให้ลดปริมาณอาหาร แต่ไม่ควรงดอาหารมื้อใดมื้อหนึ่ง เพราะจะทำให้หิวและอาจรับประทานในมื้อถัดไปมากขึ้น ซึ่งจะส่งผลให้ระดับน้ำตาลในเลือดขึ้นๆ ลงๆ ควรปรึกษาแพทย์ที่ทำการรักษาเนื่องจากอาจมีการปรับยาในการรักษาเบาหวาน"
    },
    {
        title: "ข้อแนะนำในการรับประทานอาหารสำหรับผู้ป่วยเบาหวาน",
        imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/bread-2864703_640.jpg",
        content: "รับประทานข้าว ก๋วยเตี๋ยว ขนมปังได้ตามปกติ ไม่ต้องลดลงมาก เว้นแต่เฉพาะผู้ป่วยที่มีภาวะอ้วนให้ลดปริมาณลงครึ่งหนึ่ง\nรับประทานผลไม้ที่หวานน้อย และมีใยอาหารมาก ตามปริมาณที่กำหนด วันละ 2-3 ครั้งแทนขนม\nรับประทานผักให้มากขึ้นทุกมื้อ\nรับประทานผัก ผลไม้ทั้งกาก แทนการคั้นดื่มแต่น้ำ\nรับประทานไข่ได้ แต่หากผู้ป่วยมีไขมันโคเลสเตอรอลในเลือดสูง ให้งดไข่แดง\nรับประทานเนื้อสัตว์ไม่ติดมัน และไม่ติดหนัง\nรับประทานปลาและเต้าหู้ให้บ่อยขึ้น\nเลือกรับประทานอาหารที่มีไขมันน้อย และใช้น้ำมันน้อย เช่น อาหารประเภทต้ม นึ่ง ย่าง ผัด แทนอาหารประเภททอด\nใช้น้ำมันพืชจำพวกน้ำมันถั่วเหลือง หรือน้ำมันรำข้าวในการทอด ผัด อาหารแต่พอควร\nหลีกเลี่ยงอาหารใส่กะทิ ไขมันสัตว์ และอาหารทอดเป็นประจำ รวมทั้งขนมอบ เช่น พัฟ พาย เค้ก\nเลือกดื่มนมขาดมันเนย (ไขมัน 0%) นมจืดพร่องมันเนย แทนนมปรุงแต่งรส\nหลีกเลี่ยงน้ำหวาน น้ำอัดลม ลูกอม ช็อกโกแลต และขนมหวานจัดต่างๆ\nใช้น้ำตาลเทียมใส่เครื่องดื่มและอาหารแทนการใช้น้ำตาลทราย\nรับประทานอาหารรสอ่อนเค็ม รสไม่จัด\nอ่านฉลากข้อมูลโภชนาการที่อยู่บนบรรจุภัณฑ์ก่อนรับประทาน โดยเลือกอาหารที่มีปริมาณน้ำตาลน้อยกว่า 20 กรัม"
    },
    {
        title: "Head 3",
        imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/bread-2864703_640.jpg",
        content: "detail 3"
    },
    {
        title: "Head 4",
        imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/bread-2864703_640.jpg",
        content: "detail 4"
    },
    {
        title: "Head 5",
        imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/bread-2864703_640.jpg",
        content: "detail 5"
    },
]
