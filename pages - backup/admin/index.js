import {useState} from 'react'
import { Form, Input, Button, message,Layout } from 'antd';
import { useRouter } from 'next/router';
export default function Index() {
    const {router} = useRouter()
    const onFinish = ({user}) => {
        const { email, password} = user
        email === "admin" && password === "admin"
        ?message.success({
            // className:"fixed bottom-0 w-auto h-30 left-2/3",
            content:"ล็อคอินสำเร็จ"
        }) : message.error("อีเมลหรือพาสเวิร์ดผิด")
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
    return (
        <div className="w-full h-full min-h-screen">
            <div className="w-full h-auto p-6 m-6 mx-auto sm:w-1/2 bg-gray-50">
            <Form name="login" onFinish={onFinish} autoComplete="off" validateMessages={validateMessages} >
                <Form.Item name={['user', 'email']} label="อีเมล" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'password']} label="รหัสผ่าน" rules={[{ required: true }]}>
                    <Input.Password />
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
