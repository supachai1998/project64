import React from "react"
import { useRouter, } from 'next/router'
import { _AppContext } from '/pages/_app'
import { ProfileOutlined } from '@ant-design/icons'

export default function IndexNCDS() {
    const router = useRouter()
    const [data, setData] = React.useState()
    const { ncds, form } = React.useContext(_AppContext)
    React.useEffect(() => {
        (async () => {
            const tempData = await getData(router, ncds, form)
            setData(tempData)
        })()
    }, [form, ncds, router])
    // console.log(data)
    if (!data || !ncds || !form) return null
    return <div className="p-5 sm:p-10 rounded-md bg-white sm:w-2/3 w-full mx-auto">
        {data.map(({ title, content, color }, ind) => <div key={`${ind}.${title}`}>
            {title && <h1 className={`text-xl whitespace-pre-wrap sm:text-3xl font-bold text-left ${color ? color : ind % 2 === 0 ? "text-green-800" : "text-blue-800"} my-3 ${ind !== 0 && "mt-12"}`}>
                {title}
            </h1>}
            <p className="text-sm sm:text-md whitespace-pre-wrap">
                {content}
            </p>
        </div>)}
    </div>
}



const getData = async (router, ncds, form) => {
    if (!ncds || !form) return null
    const menu = `hover:underline sm:p-1 px-2 md:px-4 rounded-md 
        duration-300 ease-in transition transform 
        text-left hidden group-hover:block`
    return [
        {
            title: "โรคไม่ติดต่อเรื้อรัง  NCDs (Non-Communicable diseases)",
            content: "\tเป็นปัญหาสุขภาพอันดับหนึ่งของโลกและของประเทศไทย และเป็นสาเหตุของ การเสียชีวิตมากกว่าร้อยละ 70 ของการเสียชีวิตทั้งหมด ทั้งนี้สถานการณ์โรคเบาหวานและความดันโลหิตสูง มีแนวโน้มสูงขึ้น ซึ่งกลุ่มโรคไม่ติดต่อนั้นเป็นโรคที่เกิดจากนิสัยหรือพฤติกรรมการดำเนินชีวิตของเรา ซึ่งโรคกลุ่มนี้จะค่อยๆสะสมอาการ มีการดำเนินของโรคไปอย่างช้าๆ และค่อยทวีความรุนแรง และเมื่อมีอาการของโรคแล้วจะเกิดการเรื้อรังของโรคตามมาด้วย",
        },
        {
            title: "โรค NCDs คืออะไร",
            content: "\tโรคไม่ติดต่อ หรือที่เราเรียกว่าโรค NCDs ซึ่งย่อมาจาก Non-Communicable diseases เป็นกลุ่มโรคไม่ติดต่อเรื้อรัง ซึ่งโรคต่างๆเหล่านี้ไม่สามารถแพร่กระจายจากคนสู่คนได้ ไม่ใช่โรคติดต่อ แต่เป็นโรคที่เกิดจากพฤติกรรมการการใช้ชีวิต ดังนั้นโรคกลุ่ม NCDs บางครั้งก็อาจจะเรียกว่า โรคที่เราทำขึ้นมาเอง",
        },
        {
            title: "พฤติกรรมเสี่ยงในการใช้ชีวิตที่เป็นสาเหตุของการป่วยโรค NCDs",
            content: `\t•\tชอบรับประทานอาหารไขมันสูง แป้ง น้ำตาล มากเกินความจำเป็น รับประทานอาหารรสเค็มจัด รับประทานผักและผลไม้น้อย
\t•\tกิจกรรมในแต่ละวันน้อยไม่เพียงพอ ทำงานนั่งโต๊ะตลอดทั้งวัน ไม่ได้ออกกำลังกาย
\t•\tสูบบุหรี่เป็นประจำ
\t•\tดื่มเครื่องดื่มแอลกอฮอล์เป็นประจำ
\t•\tมีความเครียดสะสม ไม่สามารถจัดการความเครียดของตนเองได้`,
        },
        {
            title: "ตัวอย่างโรค NCDs ",
            content: <div >{!!ncds && ncds.length > 0 && ncds?.map(({ name_th, name_en, id }, ind) => <div key={`${ind}.${name_th}`} 
                    className="flex md:flex-row flex-col flex-warp gap-2 p-1 text-left rounded-md group hover:bg-blue-100 duration-300 ease-in-out transition transform ">
                    <span className="p-1 rounded-md  md:px-4">{ind + 1}. {name_th} {name_en}</span>
                    <button className="flex md:flex-row flex-col gap-2 p-0 m-0 text-left">
                        <span className={menu} onClick={() => router.push(`/ncds/${id}`)}  >เข้าชม</span>
                        {!!form && form.length > 0 && form?.filter(v => v?.name_th === name_th)?.map((v, i) => <span key={`${i}.${v.name_en}`} className={menu} onClick={() => router.push(`/form/${id}`)}  >ประเมินตนเอง</span>)}
                    </button>
                </div>)}
            </div>,
        },
    ]
}