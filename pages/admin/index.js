import { useState } from 'react'
import { Form, Input, Button, message, Select } from 'antd';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { LinearProgress, Divider } from '@mui/material';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic'

const _Ncds = dynamic(() => import('./ncds'))
const _Food = dynamic(() => import('./food'))
const _Form = dynamic(() => import('./form'))
const _Blogs = dynamic(() => import('./blogs'))
const _Report_blogs_food = dynamic(() => import('./report_blogs_food/index'))
const _Report_blogs_ncds = dynamic(() => import('./report_blogs_ncds/index'))

export default function Index() {
    const { status } = useSession()

    const { router } = useRouter()

    // state
    const [title, setTitle] = useState("จัดการข้อมูล")
    const onSelectPage = (_title) => {
        setTitle(_title)
    }
    const onFinish = ({ user }) => {
        const { email, password } = user
        signIn("credentials", {
            email, password, callbackUrl: `.`, redirect: false
        }
        ).then(function (result) {
            if (result.error !== null) {
                (result.status === 401) ? message.error("อีเมลหรือพาสเวิร์ดผิด") : message.error(result.error);
            }
            else {
                message.success("เข้าสู่ระบบสำเร็จ");
            }
        });

    };
    const validateMessages = {
        required: '${label} ต้องไม่ว่าง!',
        types: {
            email: '${label} ไม่ใช่อีเมล!',
            number: '${label} ไม่ใช่ตัวเลข!',
        },
        number: {
            range: '${label} ต้องอยู่ระหว่าง ${min} และ ${max}',
        },
    };
    if (isMobile) {
        return (
            <div className="w-full h-full min-h-screen">
                <div className="w-full h-auto mx-auto duration-300 transform lg:w-1/2 bg-red-50">
                    <p className="p-6 text-xl font-bold text-center text-red-800">ไม่รองรับมือถือ</p>
                </div>
            </div>
        )
    } else if (status === "loading") {
        return (
            <div className="min-h-screen">
                <LinearProgress />
            </div>
        )
    }
    else if (status === "authenticated") {
        return (
            <div className="w-full h-full min-h-screen">
                <HeaderAdmin title={title} onSelectPage={onSelectPage} />
                {title === "โรคไม่ติดต่อเรื้อรัง" ? <_Ncds />
                    : title === "บทความ" ? <_Blogs /> 
                    : title === "อาหาร" ? <_Food /> 
                    : title === "แบบประเมินโรค" ? <_Form /> 
                    : title === "รายงานแบบประเมินโรค" ? <_Report_blogs_food /> 
                    : title === "รายงานบทความ" ? <_Report_blogs_ncds /> 
                    : <></>
                }
            </div>
        )
    }
    // admin authentication
    return (
        <div className="w-full h-full min-h-screen">
            <div className="w-full h-auto p-6 m-6 mx-auto duration-300 transform lg:w-1/2 bg-gray-50">
                <Form name="login" autoComplete="off" validateMessages={validateMessages} onFinish={onFinish} >
                    <Form.Item name={['user', 'email']} label="อีเมล" rules={[{ required: true }]}>
                        <Input placeholder="exam@email.com" />
                    </Form.Item>
                    <Form.Item name={['user', 'password']} label="รหัสผ่าน" rules={[{ required: true }]}>
                        <Input.Password placeholder="password" />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" className="float-right" >
                            เข้าสู่ระบบ
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const { Option } = Select
const HeaderAdmin = ({ title, onSelectPage }) => {
    return (
        <div className="relative flex flex-col w-full  gap-4 m-2">
            <span className="text-xl duration-500 transform md:text-2xl">{title}</span>
            
            <div className="flex w-full h-full gap-2 flex-warp">
                <Button onClick={() => onSelectPage("โรคไม่ติดต่อเรื้อรัง")}>โรคไม่ติดต่อเรื้อรัง</Button>
                <Button onClick={() => onSelectPage("บทความ")}>บทความ</Button>
                <Button onClick={() => onSelectPage("อาหาร")}>อาหาร</Button>
                <Button onClick={() => onSelectPage("แบบประเมินโรค")}>แบบประเมินโรค</Button>
                <Select
                    className="w-36"
                    placeholder="รายงาน"
                    onChange={(k) => onSelectPage(k)}>
                    <Option key="รายงานแบบประเมินโรค" >แบบประเมินโรค</Option>
                    <Option key="รายงานบทความ" >บทความ</Option>
                </Select>
            </div>
            <Divider />
        </div>
    )
}

