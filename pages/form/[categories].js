import { useRouter } from 'next/router'
import { Steps, Button, message, Tooltip, Checkbox, Row, Col, Divider } from 'antd';
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, } from 'framer-motion';
import { isMobile } from 'react-device-detect';
const { Step } = Steps;

export default function Index() {
    const router = useRouter()
    const { categories } = router.query
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
                    <Step key={i} title={isMobile ? "" : item.title} onStepClick={handleStepClick} />
                ))}
            </Steps>
            <div className="flex flex-col self-center w-full h-full p-3 xl:w-1/2">
                <p>{title}</p>

                <div className="flex flex-col w-full gap-4 p-3 bg-gray-300 rounded-lg ">
                    {content.map((con, i) => (
                        <motion.div
                            variants={fadeInUp}
                            whileTap={{ scale: .97 }}
                            key={i} title={con.detail} className="w-full h-full break-all">
                            <Checkbox value={con.score} onChange={onChange} checked={con.checked} disabled={con.disabled} name={con.title} >{con.title}
                                {"\t"}<span className="text-gray-600 ">{con.detail}</span>
                            </Checkbox>

                        </motion.div>
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


const choice = [
    {
        title: "คุณมีอาการดังต่อไปนี้หรือไม่ ",
        content: [
            {
                title: "ปวดหัว",
                detail: "รายละเอียด xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                score: 1,
            },
            {
                title: "ตัวร้อน",
                detail: "รายละเอียด 1 2 3 4 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                score: 2,
            },
            {
                title: "ไม่สบาย",
                detail: "รายละเอียด 1 2 3 4",
                score: 3,
            },
            {
                title: "วินเวียน",
                detail: "รายละเอียด 1 2 3 4",
                score: 4,
            },
            {
                title: "ไม่มีอาการ",
                detail: "",
                score: 0,
            },
        ]
    },
    {
        title: "พฤติกรรมการรับประทานอาหาร ",
        content: [
            {
                title: "กินเผ็ด",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "เปรี้ยว",
                detail: "รายละเอียด 1 2 3 4",
                score: 6,
            },
            {
                title: "หวาน",
                detail: "รายละเอียด 1 2 3 4",
                score: 7,
            },
            {
                title: "เผ็ดมากๆ",
                detail: "รายละเอียด 1 2 3 4",
                score: 1,
            },
            {
                title: "ไม่มีอาการ",
                detail: "",
                score: 0,
            },
        ]
    },
    {
        title: "พฤติกรรมการนอน",
        content: [
            {
                title: "นอนไม่ค่อยหลับ",
                detail: "รายละเอียด 1 2 3 4",
                score: 2,
            },
            {
                title: "นอนหลับๆตื่นๆ",
                detail: "รายละเอียด 1 2 3 4",
                score: 3,
            },
            {
                title: "นอนไม่เป็นเวลา",
                detail: "รายละเอียด 1 2 3 4",
                score: 4,
            },
            {
                title: "นอนเต็มอิ่ม",
                detail: "รายละเอียด 1 2 3 4",
                score: 4,
            },
            {
                title: "ยังไม่ได้นอน~~~",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "ไม่มีอาการ",
                detail: "",
                score: 0,
            },
        ]
    },
    {
        title: "พฤติกรรมการนั่ง",
        content: [
            {
                title: "กินเผ็ด1",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "เปรี้ยว2",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "หวาน3",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "เผ็ดมากๆ4",
                detail: "รายละเอียด 1 2 3 4",
                score: 5,
            },
            {
                title: "ไม่มีอาการ",
                detail: "",
                score: 0,
            },
        ]
    },
]

// Our custom easing
let easing = [0.6, -0.05, 0.01, 0.99];

// animate: defines animation
// initial: defines initial state of animation or stating point.
// exit: defines animation when component exits

// Custom variant
const fadeInUp = {
    initial: {
        y: 60,
        opacity: 0,
        transition: { duration: 0.6, ease: easing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easing
        }
    }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};
