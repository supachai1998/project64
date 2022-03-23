import { useRouter } from 'next/router'
import { Steps, Button, Radio, message, Modal, Tooltip, Checkbox, Select, notification, } from 'antd';
import { useState, useEffect } from 'react'
import { SmileOutlined, FrownOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select

export default function Index() {
    const router = useRouter()
    const [data, setData] = useState()
    const [choice, setChoice] = useState([])
    const [loading, setloading] = useState()
    const { categories } = router.query
    const [curInd, setcurInd] = useState(0);
    const [avg_score, setAvg_score] = useState(0);
    const [modal, setModal] = useState(false);

    const fetchData = async () => {
        setloading(true)
        const data = await fetch(`/api/getForm?id=${categories}`).then(res => res.ok && res.json())
        setChoice(data.subForm.map(({ choice }) => setChoice(prev => [...prev, 0])))
        setData(data)
        setloading(false)
    }

    useEffect(() => {
        if (categories) {
            fetchData()
        }
        return () => setData()
    }, [categories])

    const next = () => {
        setcurInd(curInd + 1);
    };

    const prev = () => {
        setcurInd(curInd - 1);
    };
    const onRadioChange = ({ target: { value } }) => {
        setChoice(prev => prev.map((_, i) => i === curInd ? value : _))
    }
    const sendForm = () => {
        const notScore = choice.map((v, i) => {
            if (typeof v !== "number") {
                notification.error({ message: `คุณลืมทำแบบประเมินหัวข้อที่ ${i + 1}` })
                return true
            }
            return false
        }).every(v => v === false)
        if (notScore) {
            const total_score = data.subForm.map((v) => v.choice.map((v2) => v2.score))
            // const sum = total_score.map(v => v.reduce((a, b) => a + b))
            // console.log(sum)
            const max = total_score.map(v => v.reduce((a, b) => a > b ? a : b))
            const sum = max.reduce((a, b) => a + b)
            const total_usr_score = choice.reduce((a, b) => a + b)
            const avgScore = total_usr_score / sum * 100
            setAvg_score(avgScore)
            setModal(true)
        }
    }

    if (loading) return <div className='min-h-screen'>กำลังดึงข้อมูล</div>
    if (!data) return <div className='min-h-screen'>ไม่พบข้อมูล</div>

    return (
        <div className="min-h-screen h-full sm:w-1/2 mx-auto bg-white rounded-lg shadow-md px-3 py-2">
            <div className="w-full">
                <div className='flex sm:gap-3 justify-between'>
                    <span className="text-md md:text-4xl">{curInd + 1}. {data?.subForm[curInd]?.name}</span>
                    <div>
                        <Select
                            showSearch
                            placeholder="เลือกหัวข้อแบบประเมิน"
                            optionFilterProp="children"
                            onChange={(value) => setcurInd(value)}
                            // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                            filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                            {!!data.subForm && data.subForm.map(({ name, id }, ind) => <Option key={ind} value={ind}>{name}</Option>)}
                        </Select>
                    </div>
                </div>
                <Radio.Group onChange={onRadioChange} value={choice[curInd]}>
                    {data.subForm[curInd].choice.map(({ name, detail, score }, i) => <div key={i} className="my-5">
                        <Tooltip title={detail}><Radio style={{ fontSize: "1.5vw" }} value={score}>{name}</Radio></Tooltip>
                        <p className="w-full max-h-96   text-black">{detail}</p>
                    </div>)}
                </Radio.Group>
            </div>
            <div className='w-full flex items-end justify-end gap-3'>
                {curInd > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        ข้อก่อนหน้า
                    </Button>
                )}
                {curInd < data.subForm.length - 1 && (
                    <Button type="primary" disabled={typeof choice[curInd] !== "number"} onClick={() => next()}>
                        ข้อถัดไป
                    </Button>
                )}
                {(curInd === data.subForm.length - 1) && (
                    <Button type="ghost" onClick={sendForm}>
                        ส่งแบบประเมิน
                    </Button>
                )}
            </div>

            <Result avg_score={avg_score} setAvg_score={setAvg_score} data={data} modal={modal} setModal={setModal} />
        </div>
    )
}

const Result = ({ data, avg_score, setModal, modal }) => {
    const [sugess, setSugess] = useState()
    const router = useRouter()
    const handleCancel = () => {
        setModal();
    };
    const fetchData = async () => {
        await fetch(`/api/getNCDS?id=${data.ncds.id}`).then(res => res.ok ? res.json() : notification.error({ message: "Error", description: "ไม่พบข้อมูล" }))
            .then(data => {
                setSugess(data.sugess)
            })
            .catch(err => notification.error({ message: "ไม่สามารถดึงข้อมูลได้", description: err.message }))
    }
    useEffect(() => {
        data && fetchData()
    }, [data])

    if (!data && !modal) return null
    return <Modal

        title={<span className='text-3xl'>ผลการประเมิน{data.ncds.name_th}</span>}
        visible={modal}
        onCancel={handleCancel}
        footer={null}>
        <>
            <div className='flex justify-center'><Icon avg_score={avg_score} /></div>
            <div className='flex flex-col gap-3'>
                <span className='mt-3 text-lg border-b-2 w-full'>คำแนะนำในการปฏิบัติตัว</span>
                <span className='whitespace-pre-line'>{sugess}</span>
            </div>
            <div className='flex justify-end'>
                <Tooltip title={data.ncds.name_th}> <button className='button  hover:text-blue-800 shadow-md hover:text-lg ease' onClick={() => router.push(`/ncds/${data.ncds.id}`)} >อ่านต่อ</button></Tooltip>
            </div>
        </>
    </Modal>
}
const Icon = ({ avg_score }) => (<>
    <Tooltip title={`${avg_score.toFixed(0)}%`}>
        {avg_score <= 20 ? <div className="text-7xl text-green-500 flex flex-col gap-2"> <SmileOutlined /> <span className='text-3xl'>เสี่ยงต่ำมาก </span></div>
            : avg_score <= 40 ? <div className="text-7xl text-green-900 flex flex-col gap-2"> <SmileOutlined /><span className='text-3xl'>เสี่ยงต่ำ </span></div>
                : avg_score <= 60 ? <div className="text-7xl text-yellow-500 flex flex-col gap-2"> <SmileOutlined /><span className='text-3xl'>เสี่ยงปานกลาง </span></div>
                    : avg_score <= 80 ? <div className="text-7xl text-red-900 flex flex-col gap-2"> <FrownOutlined /><span className='text-3xl'>เสี่ยงสูง </span></div>
                        : <div className="text-7xl text-red-500 flex flex-col gap-2"><FrownOutlined /><span className='text-3xl'>เสี่ยงสูงมาก </span></div>}
    </Tooltip>
</>)