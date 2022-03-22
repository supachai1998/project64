import React, { useState, useEffect } from 'react'
import { Carousel, Divider, Tooltip, Spin, Select, notification } from 'antd';
import router from 'next/router';
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'
import { noti } from '/components/noti.js';
const BestFood = dynamic(() => import( '../components/BestFood'))
const BestBlog = dynamic(() => import( '../components/BestBlog'))
const CustImage = dynamic(() => import("/components/cusImage.js"))
const CusInput = dynamic(() => import("/components/cusInput"))
const MultiCard = dynamic(() => import("/components/MultiCard"))

const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore"),
  { ssr: false })
const DisplayBlogReadMore = dynamic(() => import("/components/displayBlogReadMore"),
  { ssr: false })
export default function Index() {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  // Fetch First Time


  return (
    <motion.div className="flex flex-col w-full h-full min-h-screen gap-3  sm:mx-auto mx-0"
      initial="hidden"
      animate="visible">
      <div className="relative">
        <div className="flex flex-col gap-3 p-3 ">
          <CusInput data={data} setData={setData} />
          {!loading && !!data && data.length > 0 && <MultiCard data={data} title={"ผลการค้นหา"} />}
        </div>
        {loading && input.length > 2 && <div className="absolute top-0 left-0 z-10"><Spin size="large" /></div>}
      </div>
      <div className=' mx-0'>
        <BestFood />
        <BestBlog/>
      </div>

    </motion.div>
  )
}


const onSearchTomyum = [
  {
    id: 0,
    type: "foods",
    categories: "soup",
    title_th: "ต้มยำกุ้ง",
    title_en: "tom yum kung",
    cal: 343,
    imgUrl: "https://www.jmthaifood.com/wp-content/uploads/2020/01/%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%A2%E0%B8%B3%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87-1.jpg",
  },
  {
    id: 1,
    type: "foods",
    categories: "soup",
    title_th: "ต้มยำปลานิล",
    title_en: "tom yum tilapia",
    cal: 290,
    positive: [
      {
        ncds: "โรคเบาหวาน",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "สามารถทานได้ แต่ควรทานข้าวปริมาณจำกัดเพื่อเลี่ยงน้ำตาล"
      },
      {
        ncds: "โรคถุงลมโป่งพอง",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "สามารถทานได้"
      },
      {
        ncds: "โรคมะเร็ง",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "สามารถทานได้ ในปริมาณที่จำกัด"
      },
      {
        ncds: "โรคความดันโลหิตสูง",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "สามารถทานได้"
      },
      {
        ncds: "โรคหลอดเลือดสมอง",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "สามารถทานได้"
      },
    ],
    nagative: [
      {
        ncds: "โรคอ้วนลงพุง",
        intro: "ข้อความเกริ่นนำ ....(ไม่เกิน 50 ตัวอักษร)",
        because: "มีปริมาณไขมันในกุ้งปริมาณมาก ควรหลีกเลี่ยงส่วนประกอบที่มีไขมัน"
      },
    ],
    imgUrl: "https://img-global.cpcdn.com/recipes/d573bc1742ed1d14/1200x630cq70/photo.jpg",
  },
  {
    id: 3,
    type: "ncds",
    categories: "diabetes",
    title_th: "อาหาร",
    title: "โรคเบาหวาน ควรรับประทานอย่างไร? (Diabetic Diet)",
    intro: "ข้อความเกริ่นนำ....(ไม่เกิน 50 ตัวอักษร)",
    detail: "อาหารสำหรับผู้ป่วยเบาหวานคืออาหารทั่วไปไม่แตกต่างจากอาหารที่รับประทานเป็นปกติ แต่ควรเป็นอาหารที่ไม่หวานจัด โดยคำนึงถึงปริมาณ ชนิดของแป้ง และไขมันเป็นสิ่งสำคัญ เพื่อควบคุมระดับน้ำตาลและไขมันในเลือด รวมถึงการรักษาน้ำหนักตัวให้อยู่ในเกณฑ์ปกติ นอกจากนี้ ควรรับประทานอาหารให้เป็นเวลา และปริมาณที่ใกล้เคียงกันในแต่ละมื้อ โดยเฉพาะปริมาณคาร์โบไฮเดรตโดยรวม หากต้องการลดน้ำหนักให้ลดปริมาณอาหาร แต่ไม่ควรงดอาหารมื้อใดมื้อหนึ่ง เพราะจะทำให้หิวและอาจรับประทานในมื้อถัดไปมากขึ้น ซึ่งจะส่งผลให้ระดับน้ำตาลในเลือดขึ้นๆ ลงๆ ควรปรึกษาแพทย์ที่ทำการรักษาเนื่องจากอาจมีการปรับยาในการรักษาเบาหวาน",
    ref: "https://www.siphhospital.com/th/news/article/share/450",
    imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/diabeteshowtoeat_og_1200.jpg",
  },
  {
    id: 4,
    type: "blogs",
    categories: "blogs_food",
    title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกัน",
    title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
    intro: "7 เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน วัตถุดิบและกรรมวิธีการทำอาหารของไทยนั้นเป็นยาดีเพิ่มภูมิคุ้มกันให้ร่างกายของเราได้ด้วยตัวของมันอยู่แล้ว",
    detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
    ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
    imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
  },
]
