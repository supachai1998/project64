import {useState} from 'react'
import { Form, Input, Button, message,Select } from 'antd';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { LinearProgress,Divider } from '@mui/material';
export default function Index() {
    const { status } = useSession()

    const { router } = useRouter()

    // state
    const [title ,setTitle] = useState("จัดการข้อมูล")
    const onSelectPage = (_title) =>{
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
    if (status === "loading") {
        return (
            <div className="min-h-screen">
                <LinearProgress/>
            </div>
        )
    }
    else if (status === "authenticated") {
        return (
            <>
                <HeaderAdmin title={title} onSelectPage={onSelectPage} />
            </>
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

const {Option} = Select
const HeaderAdmin = ({title,onSelectPage}) =>{
    return (
        <div className="relative flex flex-col w-full h-full min-h-screen gap-4">
            <span className="text-xl duration-500 transform md:text-2xl">{title}</span>
            <Divider />
            <div className="flex gap-2 flex-warp">
                <Button onClick={()=>onSelectPage("โรคไม่ติดต่อเรื้อรัง")}>โรคไม่ติดต่อเรื้อรัง</Button>
                <Button onClick={()=>onSelectPage("บทความ")}>บทความ</Button>
                <Button onClick={()=>onSelectPage("อาหาร")}>อาหาร</Button>
                <Button onClick={()=>onSelectPage("แบบประเมินโรค")}>แบบประเมินโรค</Button>
                <Select
                    className="w-36"
                    placeholder="รายงาน">
                    <Option >แบบประเมินโรค</Option>
                    <Option >บทความ</Option>
                </Select>
            </div>
        </div>
    )
}