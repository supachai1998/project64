import { useRouter } from 'next/router'
import { Steps, Button, message, Tooltip, Checkbox, Row, Col, Divider } from 'antd';
import Image from 'next/image'
import { useState, useEffect } from 'react'
const { Step } = Steps;

export default function Index() {
    const router = useRouter()
    const { name } = router.query
    const [_choice, setChoice] = useState(choice.map(val => ({
        ...val, checked: false, disabled: false
    })));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [btnLoading, setBtnLoading] = useState(false);

    const { title, content } = _choice[currentIndex]

    const next = () => {
        setCurrentIndex(currentIndex + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    };

    const prev = () => {
        setCurrentIndex(currentIndex - 1);
    };
    const handleSubmit = () => {
        setBtnLoading(true)
        setTimeout(() => {
            setBtnLoading(false)
            Math.random() > .4 ? message.success('คุณปกติ!') : message.warning('คุณป่วย!')
        }, 1000);
    }
    const onChange = (e) => {
        const { name, checked } = e.target
        let _temp_choice = _choice[currentIndex]
        let _temp_content = _temp_choice.content
        if (name === "ไม่มีอาการ" && checked) {
            _temp_content = _temp_content.map(el => el.title !== name ? { ...el, checked: false, disabled: true } : { ...el, checked: checked })
        } else {
            _temp_content = _temp_content.map(el => el.title === name ? { ...el, checked: checked, disabled: false } : { ...el, disabled: false })
        }
        _temp_choice.content = _temp_content
        setChoice(prev => prev.map((_, i) => i === currentIndex ? _temp_choice : _))
    }
    const handleStepClick = i => {
        i < currentIndex && setCurrentIndex(i)
    }
    return (
        <div className="flex flex-col min-h-screen ">
            <Steps current={currentIndex}>
                {choice.map((item, i) => (
                    <Step key={i} title={""} onStepClick={handleStepClick} />
                ))}
            </Steps>
            <div className="flex flex-col self-center w-full h-full p-3 xl:w-1/2">
                <p>{title}</p>

                <div className="flex flex-col w-full gap-4 p-3 bg-gray-300 rounded-lg ">
                    {content.map((con, i) => (
                        <div
                            key={i} title={con.detail} className="w-full h-full break-all">
                            <Checkbox value={con.score} onChange={onChange} checked={con.checked} disabled={con.disabled} name={con.title} >{con.title}
                                {"\t"}<span className="text-gray-600 ">{con.detail}</span>
                            </Checkbox>

                        </div>
                    ))}

                </div>


                <div className="flex justify-end mt-3 ">
                    {currentIndex > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            ก่อนหน้า
                        </Button>
                    )}
                    {currentIndex < choice.length - 1 && (

                        <Button type="default"
                            disabled={!_choice[currentIndex].content.find(val => val.checked === true)} onClick={() => next()}>
                            ถัดไป
                        </Button>
                    )}
                    {currentIndex === choice.length - 1 && (

                        <Button type="primary" onClick={handleSubmit} loading={btnLoading}
                            disabled={!_choice[currentIndex].content.find(val => val.checked === true)}>
                            ส่งแบบประเมิน
                        </Button>
                    )}

                </div>
            </div>
        </div>
    )
}
