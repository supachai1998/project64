import { useRouter } from 'next/router'
import { Button, Tooltip, Carousel, Card, Divider } from 'antd';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import DisplayFoodReadMore from './../../components/displayFoodReadMore';
export default function Index() {
    const router = useRouter()
    const { name ,categories } = router.query

    return (
        <div className="flex flex-col min-h-screen ">
            {name ? <>
            แสดงบทความ {name}
            </>
            :categories ?<>
            <DisplayFoodReadMore data={blogTrends} title={`บทความ`} />
            </>
            : <></>}
        </div>
    )
}

const blogTrends = [
    {
      id: 0,
      type: "ncds",
      categories: "diabetes",
      title_th: "อาหาร",
      title: "โรคเบาหวาน ควรรับประทานอย่างไร? (Diabetic Diet)",
      intro : "ข้อความเกริ่นนำ....(ไม่เกิน 50 ตัวอักษร)",
      detail: "อาหารสำหรับผู้ป่วยเบาหวานคืออาหารทั่วไปไม่แตกต่างจากอาหารที่รับประทานเป็นปกติ แต่ควรเป็นอาหารที่ไม่หวานจัด โดยคำนึงถึงปริมาณ ชนิดของแป้ง และไขมันเป็นสิ่งสำคัญ เพื่อควบคุมระดับน้ำตาลและไขมันในเลือด รวมถึงการรักษาน้ำหนักตัวให้อยู่ในเกณฑ์ปกติ นอกจากนี้ ควรรับประทานอาหารให้เป็นเวลา และปริมาณที่ใกล้เคียงกันในแต่ละมื้อ โดยเฉพาะปริมาณคาร์โบไฮเดรตโดยรวม หากต้องการลดน้ำหนักให้ลดปริมาณอาหาร แต่ไม่ควรงดอาหารมื้อใดมื้อหนึ่ง เพราะจะทำให้หิวและอาจรับประทานในมื้อถัดไปมากขึ้น ซึ่งจะส่งผลให้ระดับน้ำตาลในเลือดขึ้นๆ ลงๆ ควรปรึกษาแพทย์ที่ทำการรักษาเนื่องจากอาจมีการปรับยาในการรักษาเบาหวาน",
      ref: "https://www.siphhospital.com/th/news/article/share/450",
      imgUrl: "https://siph-space.sgp1.digitaloceanspaces.com/media/upload/diabeteshowtoeat_og_1200.jpg",
    },
    {
      id: 1,
      type: "blogs",
      categories: "blogs_food",
      title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกัน",
      title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
      intro :"7 เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน วัตถุดิบและกรรมวิธีการทำอาหารของไทยนั้นเป็นยาดีเพิ่มภูมิคุ้มกันให้ร่างกายของเราได้ด้วยตัวของมันอยู่แล้ว",
      detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
      ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
      imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
  },
  ]