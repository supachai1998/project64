import { useRouter } from 'next/router'
import { Steps, Button, Radio, message, Modal, Tooltip, Checkbox, Select, notification, } from 'antd';
import { useState, useEffect, useRef , useContext } from 'react'
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import {_AppContext} from '/pages/_app'

const { Step } = Steps;
const { Option } = Select

export default function Index() {
    const router = useRouter()
    const [datas, setDatas] = useState([])
    const [score, setScore] = useState([])
    const [loading, setloading] = useState()
    const { categories } = router.query
    const [curIndPart, setcurIndPart] = useState(0);
    const [result, setResult] = useState();
    const {setTitle , setDefaultSelectedKeys} = useContext(_AppContext)
    const fetchData = async () => {
        setloading(true)
        const data = await fetch(`/api/getForm?id=${categories}`).then(res => res.ok && res.json())
        // setChoice(data.subForm.map(({ choice }) => setChoice(prev => [...prev, 0])))
        const setSelect = data.map((v1) => ({
            ...v1, subForm: v1.subForm.map((v2) => ({
                ...v2, choice: v2.choice.map((v3) => ({
                    ...v3, select: false
                }))
            }))
        }))
        if(data){
            setTitle(`แบบประเมิน${data[0].ncds.name_th}`)
        }
        setDatas(setSelect)
        setloading(false)
    }

    useEffect(() => {
        setDefaultSelectedKeys(`/form/${categories}`)
        if (categories) {
            fetchData()
        }
        return () => setDatas()
    }, [categories])

    const next = () => {
        setcurIndPart(curIndPart + 1);
    };

    const prev = () => {
        setcurIndPart(curIndPart - 1);
    };
    const onRadioChange = ({ target: { value } }, ind) => {
        // setcurIndPart(ind)
        const set = datas.map((v1, i1) => curIndPart === i1 ? ({
            ...v1, subForm: v1.subForm.map((v2, i2) => ind === i2 ? ({
                ...v2, choice: v2.choice.map((v3, i3) => (curIndPart === i1 && ind === i2) ? (
                    v3.id === value ? ({
                        ...v3, select: true
                    }) : ({ ...v3, select: false })) : { ...v3 })
            }) : ({ ...v2 }))
        }) : ({ ...v1 }))
        setDatas(set)
    }
    const sendForm = async () => {
        // for Loop  no answer
        let required_ans = true
        for (let i = 0; i < datas.length; i++) {
            for (let j = 0; j < datas[i].subForm.length; j++) {
                if (datas[i].subForm[j].choice.every(val => !val.select)) {
                    notification.error({ message: `กรุณาตอบคำถามตอนที่ ${i + 1} ข้อที่ ${j + 1}` })
                    setcurIndPart(i)
                    required_ans = false
                    return
                }
            }
        }
        if (required_ans) {
            const getSum = datas.map(({ subForm }) => subForm.map(({ choice }) => choice.filter(({ select }) => select).map(({ score }) => score).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
            console.log(getSum)
            // send getSum to getResultForm API method POST body
            const req = await fetch('/api/getResultForm', { method: "POST", body: JSON.stringify({ ncdsId: datas[0].ncdsId, score: getSum }) })
            .then(res=>res.ok&&res.json())
            .catch(e=>notification.error({message:e.message}))
            setResult(req)
        
        }
        // console.log(noAnswer)
    }

    if (loading) return <div className='min-h-screen'>กำลังดึงข้อมูล</div>
    if (datas?.length <= 0) return <div className='min-h-screen'>ไม่พบข้อมูล</div>

    return <>
        <div className="min-h-screen h-full sm:w-1/2 mx-auto bg-white rounded-lg shadow-md px-3 py-2">
            <div className="w-full">
                <div className='flex sm:gap-3 justify-between'>
                    <span className="text-md md:text-2xl">ตอนที่ {curIndPart + 1}. {datas[curIndPart]?.title}</span>
                    <div>
                        <Select
                            showSearch
                            placeholder="เลือกตอน"
                            optionFilterProp="children"
                            value={curIndPart}
                            onChange={(value) => setcurIndPart(value)}
                            filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                            {datas.map(({ title, id }, ind) => <Option key={ind} value={ind}>{title}</Option>)}
                        </Select>
                    </div>
                </div>
                <hr className='my-3' />
                {datas[curIndPart]?.subForm.map((sub, ind) => {
                    const radioSelect = datas[curIndPart]?.subForm[ind]?.choice.find(({ id, select }) => { if (select) return id })
                    return <>
                        {ind !== 0 && <hr className='my-3 w-11/12 mx-auto' />}
                        <div className='grid grid-cols-1'>
                            <span className="text-md md:text-xl">ข้อที่ {ind + 1}. {sub.name}</span>
                            {/* {console.log(sub.choice.length)} */}
                            <div className={sub.choice.length === 2 ? 'grid grid-flow-row gap-2' : 'grid grid-flow-col gap-2'}>
                                <Radio.Group onChange={e => onRadioChange(e, ind)} value={radioSelect?.id}>
                                    {sub.choice.map(({ id, name, detail, score }, i) => <div key={i} className="my-5">
                                        <Tooltip title={detail}><Radio style={{ fontSize: "1rem" }} value={id}>{name}</Radio></Tooltip>
                                        <p className="w-full max-h-96   text-black">{detail}</p>
                                    </div>)}
                                </Radio.Group>
                            </div>
                        </div>
                    </>
                })}
                <div className='w-full flex items-end justify-end gap-3'>
                    {curIndPart > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            ตอนก่อนหน้า
                        </Button>
                    )}
                    {curIndPart < datas.length - 1 && (
                        <Button type="ghost" onClick={() => next()}>
                            ตอนถัดไป
                        </Button>
                    )}
                    {(curIndPart === datas.length - 1) && (
                        <Button type="primary" onClick={sendForm}>
                            ส่งแบบประเมิน
                        </Button>
                    )}
                </div>
            </div>
            <Result result={result} setResult={setResult} ncdsId={datas[0].ncds.id}/>
        </div>
    </>

}

const Result = ({ result, setResult,ncdsId }) => {
    const router = useRouter()
    const handleCancel = () => {
        setResult();
    };

    if (!result) return null
    const avg_score = result.index / result.of * 100
    console.log(result)
    return <Modal

        title={<span className='text-3xl'>ผลการประเมิน</span>}
        visible={result}
        onCancel={handleCancel}
        footer={null}>
        <>
            <div className='flex justify-center'><Icon title={result.title} /></div>
            <div className='flex flex-col gap-3'>
                <span className='mt-3 text-lg border-b-2 w-full'>คำแนะนำในการปฏิบัติตัว</span>
                <span className='whitespace-pre-line'>{result.recommend}</span>
            </div>
            <div className='flex justify-end'>
                <Tooltip title={""}> <button className='button  hover:text-blue-800 shadow-md hover:text-lg ease' onClick={() => router.push(`/ncds/${ncdsId}`)} >อ่านต่อ</button></Tooltip>
            </div>
        </>
    </Modal>
}
const Icon = ({ title }) => (<>
    {/* <Tooltip title={`${avg.toFixed(0)}%`}> */}
        {title === "เสี่ยงต่ำมาก" ? <div className="text-7xl text-green-500 flex flex-col gap-2"> <SmileOutlined /> <span className='text-3xl'>เสี่ยงต่ำมาก </span></div>
            : title === "เสี่ยงต่ำ" ? <div className="text-7xl text-green-900 flex flex-col gap-2"> <SmileOutlined /><span className='text-3xl'>เสี่ยงต่ำ </span></div>
                : title === "เสี่ยงปานกลาง" ? <div className="text-7xl text-yellow-500 flex flex-col gap-2"> <SmileOutlined /><span className='text-3xl'>เสี่ยงปานกลาง </span></div>
                    : title === "เสี่ยงสูง" ? <div className="text-7xl text-red-900 flex flex-col gap-2"> <FrownOutlined /><span className='text-3xl'>เสี่ยงสูง </span></div>
                        :title === "เสี่ยงสูงมาก" ?<div className="text-7xl text-red-500 flex flex-col gap-2"><FrownOutlined /><span className='text-3xl'>เสี่ยงสูงมาก </span></div>
                        : <div className="text-7xl text-white-500 flex flex-col gap-2">{title}</div>}
    {/* </Tooltip> */}
</>)