import { useRouter } from 'next/router'
import { Card, Divider, } from 'antd';
import dynamic from 'next/dynamic'



const { Meta } = Card;
const CustImage = dynamic(() => import("/components/cusImage.js"))
const Topic = dynamic(() => import("/components/foods/topic.js"))
const ContentHeader = dynamic(() => import("/components/foods/contentheader.js"))
const Ncds = dynamic(() => import("/components/foods/ncds.js"))
const DisplayFoodReadMore = dynamic(() => import("/components/displayFoodReadMore.js"))


export default function Index() {
    const router = useRouter()
    const { categories, name } = router.query

    return (
        <div className="mt-3">
            {name ?
                <div className="flex flex-col w-full h-full min-h-screen  ">
                    <div className="flex flex-col bg-gray-50 ipad:flex-row relative ">
                            <CustImage src={"https://sg.fiverrcdn.com/photos/112566478/original/386e485f0d4853746792abe5e592480ec32c41d1.jpg?1527930323"} alt={"0"} width="100%" height="517px" preview={false} /></div>
                            <div className='absolute w-full text-center h-80 '>
                                <label className='font-Poppins text-10xl text-white my-auto '>{name}</label>
                            </div>
                       
                            <div className='card mv-10 w-11/12 mx-auto'>


                                <ContentHeader className="w-full " headerData={headerData} />
                            </div>
                        
                  
                    <Divider />
                    <Ncds ncds={ncds} />
                    <DisplayFoodReadMore data={blogTrends} title={`บทความ ${name}`} headTextColor={"text-green-900"} headLineColor={"bg-green-300"} />
                </div>
                : categories ?
                    <div className="flex flex-col justify-center w-full h-full min-h-screen gap-4 mx-auto px-10">
                        {/* <div className="w-full bg-gray-300 sm:h-96 h-52">
                            <CustImage src={"https://s359.kapook.com/pagebuilder/1f12afa5-ed83-4fd6-b9e7-8c670d941668.jpg"} alt={"0"} className="" width="100%" height="100%" preview={false} />
                        </div> */}
                        
                        <Topic raw={tomyum} categories={categories} placeholder={"ชื่ออาหาร , ปริมาณพลังงานที่ได้รับ"} />
                        <Topic raw={curry} categories={categories} placeholder={"ชื่ออาหาร , ปริมาณพลังงานที่ได้รับ"} />
                        <Topic raw={tomyum} categories={categories} placeholder={"ชื่ออาหาร , ปริมาณพลังงานที่ได้รับ"} />
                    </div> : <></>
            }
        </div>
    )
}








const tomyum = {
    title_th: "ต้มยำ", title_en: "soup",
    data: [
        { title: "ต้มยำกุ้ง", detail: "343", imgUrl: "https://static.naewna.com/uploads/news/source/561099.jpg" },
        { title: "ต้มยำไก่", detail: "395.4", imgUrl: "https://blog.samanthasmommy.com/wp-content/uploads/2019/01/klang-food-23161-8-2.jpg" },
        { title: "ต้มยำปลาทู", detail: "446.5", imgUrl: "https://img-global.cpcdn.com/recipes/d79ae43ed37668f0/1200x630cq70/photo.jpg" },
        { title: "ต้มยำทะเล", detail: "365", imgUrl: "https://i.ytimg.com/vi/gjm1toMrY8g/maxresdefault.jpg" },
        { title: "ต้มยำปลานิล", detail: "290", imgUrl: "https://i.ytimg.com/vi/idhojWWMYd0/maxresdefault.jpg" },
        { title: "ต้มยำปลาแซลมอน", detail: "350", imgUrl: "https://i.pinimg.com/originals/b5/a1/fc/b5a1fc124918bf6edfdf17b90db4abfb.jpg" },
    ]
}
const curry = {
    title_th: "แกง", title_en: "curry",
    data: [
        { title: "แกงส้ม", detail: "120", imgUrl: "https://snpfood.com/wp-content/uploads/2020/01/Highlight-Menu-0025-scaled-1.jpg" },
        { title: "แกงเนื้อ", detail: "228.91", imgUrl: "https://img.wongnai.com/p/1920x0/2019/08/06/175a94eaab98498dac9a6e266eb5a3bd.jpg" },
        { title: "แกงพะแนงหมู", detail: "273.9", imgUrl: "https://img.kapook.com/u/pirawan/Cooking1/panang.jpg" },
        { title: "แกงเขียวหวานเนื้อ", detail: "256.58", imgUrl: "https://img.wongnai.com/p/1920x0/2019/03/18/11e7bbd7bbab421f9e1f2bc6c1d64e59.jpg" },
        { title: "แกงจืดเต้าหู้หมูสับ", detail: "110", imgUrl: "https://img.wongnai.com/p/1968x0/2019/03/25/16be129786034c1185c4cc0768f61356.jpg" },
        { title: "แกงเนื้อหน่อไม้", detail: "245", imgUrl: "https://www.maeban.co.th/upfiles/blog/3225_77_22.jpg" },
    ]
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