import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { notification } from 'antd'
// import { notification } from 'antd'

const DisplayBlogReadMore = dynamic(() => import("/components/displayBlogReadMore"),
  { ssr: false })
export default function Index() {
  const router = useRouter()
  const { categories } = router.query
  const [data, setData] = useState()
  const [loading, setLoading] = useState()
  const [prevPath, setPrevPath] = useState()
  useEffect(() => {
    if (!prevPath) {
      setPrevPath(categories)
    }
    if (prevPath !== categories) {
      setPrevPath(categories)
      setData()
    }
  }, [categories])
  useEffect(() => {
    (async () => {
      if (!data) {
        setLoading(true)
        const _ = await getData(categories)
        setLoading(false)
        setData(_)
      }
    })()
  }, [categories, data])
  if (loading) return <div className="flex flex-col min-h-screen ">
    <div className='lg:mx-10'>กำลังดึงข้อมูล</div></div>
  if (!data) return <div className="flex flex-col min-h-screen ">
    <div className='lg:mx-10'>ไม่พบข้อมูล</div></div>
  return (
    <div className="flex flex-col min-h-screen ">
      <div className='lg:mx-10'>
        {
          categories ?
            categories === "NCDS" ?
              <DisplayBlogReadMore className="h-fix73" data={data} title={`บทความโรคไม่ติดต่อ`} />
              : categories === "FOOD" ?
                <DisplayBlogReadMore className="h-fix73" data={data} title={`บทความอาหาร`} />
                :
                <DisplayBlogReadMore className="h-fix73" data={data} title={`บทความทั้งหมด`} />
            : <>data not found</>
        }
      </div>
    </div>
  )
}

const getData = async (categories) => {
  const _ = await fetch(`/api/getBlogs?type=${categories}`).then(async res => {
    if (res.ok) {
      let _ = await res.json()
      _ = _.map((_data) => {
        if (_data.approve === 1) return {
          ..._data,
          id: _data.id,
          title: _data.name,
          intro: _data.imply,
          type: _data.type.toLowerCase(),
          detail: _data.detail,
          ref: _data.ref,
          avg_vote: _data.avg_vote,
          total_vote: _data.total_vote,
          views: _data.views,
          imgUrl: _data.image[0].name || null
        }

      })
      return _
    } else {
       res.status === 404 ?notification.error({ message: "ไม่พบข้อมูล" }) : notification.error({ message: "ไม่สามารเชื่อมต่อฐานข้อมูล" })
    }
  })
  return _
}

export async function getServerSideProps(ctx) {
  return {
    props: {}, // will be passed to the page component as props
  }
}


const blogTrends = [
  {
    id: 0,
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
    id: 1,
    type: "blogs",
    categories: "blogs_food",
    title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกันx",
    title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
    intro: "7 เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน วัตถุดิบและกรรมวิธีการทำอาหารของไทยนั้นเป็นยาดีเพิ่มภูมิคุ้มกันให้ร่างกายของเราได้ด้วยตัวของมันอยู่แล้ว",
    detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
    ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
    imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
  },
  {
    id: 2,
    type: "blogs",
    categories: "blogs_food",
    title_th: "เมนูไทยๆ_ต้านโรคภัย_เพิ่มภูมิคุ้มกัน",
    title: "เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน",
    intro: "7 เมนูไทยๆ ต้านโรคภัย เพิ่มภูมิคุ้มกัน วัตถุดิบและกรรมวิธีการทำอาหารของไทยนั้นเป็นยาดีเพิ่มภูมิคุ้มกันให้ร่างกายของเราได้ด้วยตัวของมันอยู่แล้ว",
    detail: "ต้มยำกุ้ง – กับข้าวรสร้อนแรงไม่ว่าใส่กะทิหรือไม่ใส่ก็อร่อยทั้งแบบ ยิ่งถ้าเป็นหวัดคัดจมูกได้ทานต้มยำกุ้งเข้าไปต้องรู้สึกล่งคอโล่งจมูกกันทั้งนั้น เพราะส่วนประกอบในต้มยำกุ้งนั้น เช่น ใบมะกรูด ขิง หอมแดงที่มีสารสารเคอร์ซีติน รวมถึงเห็ดต่างๆ ที่มีสารเบต้ากลูแคนเพิ่มภูมิคุ้มกันลดความเสี่ยงที่เชื้อไวรัสจะเข้าสู่เซลล์ในร่างกาย",
    ref: "https://www.paolohospital.com/th-TH/rangsit/Article/Details/บทความโภชนาการ-/7-เมนูไทยๆ-ต้านโรคภัย-เพิ่มภูมิคุ้มกัน",
    imgUrl: "https://www.paolohospital.com/Resource/Image/Article/shutterstock_289936964.jpg",
  },
  {
    id: 3,
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