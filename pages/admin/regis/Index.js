import { Button, Divider, Form, Input, message, notification, Table } from "antd";
import { useEffect, useState } from "react";
import { serverip } from "../../../config/serverip";


const Index = ({ dataAdmin }) => {
    const [admin, setAdmin] = useState(dataAdmin)
    const reload = async () => {
        const res = await fetch(`${serverip}/api/admin`, {
            headers: { 'Content-Type': 'application/json', },
        })
        if (res.status === 200 || res.status === 304 ) {
            const data = await res.json()
            console.log(data)
            setAdmin(data)
        }
        
    }
    const onFinish = async (values) => {
        const res = await fetch(`${serverip}/api/admin`, {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(values)
        })

        console.log('send:', values);
        if (res.status === 200) reload()

        else  notification.error({
            message: 'ไม่สามารถเพิ่มข้อมูลได้',
            description: 'email ซ้ำ หรือไม่สามารถติดต่อ server ',
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="min-h-screen h-full w-full  ">
            <div className="bg-gray-100">
                <Form

                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        wrapperCol={{ span: 24 }} >
                        <div className="flex flex-wrap gap-3 justify-center">
                            <p className="sm:text-4xl text-xl text-blue-800">ลงทะเบียน ผู้ดูแลระบบ</p>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="ชื่อผู้ใช้"
                        rules={[{ required: true, message: 'ใส่ชื่อของคุณ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="พาสเวิร์ด"
                        rules={[{ required: true, message: 'ใส่พาสของคุณ!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name='email'
                        label="อีเมล"
                        rules={[
                            { required: true, message: 'ใส่อีเมลของคุณ!' },
                            { type: 'email', message: 'โปรดใส่อีเมลให้ถูกต้อง เช่น admin@email.com!' }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 24 }} >
                        <div className="flex flex-wrap gap-3 justify-end">
                            <Button htmlType="reset">ล้างค่า</Button>
                            <Button htmlType="submit" type="primary">ลงทะเบียน</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
            {!!admin && <>
                <Divider />
                <TableAdmin admin={admin} reload={reload}/>
                 </>}
        </div>
    );
}

export default Index;

export const getStaticProps = async (ctx) => {
    const dataAdmin = await fetch(`${serverip}/api/admin`, {
        headers: { 'Content-Type': 'application/json', },
    }).then(res => res.json())

    return {
        props: {
            dataAdmin
        }
    }
}

const TableAdmin = ({ admin,reload }) => {

    // 0: Object { id: "ckvq2yito0022h03dsro44i7f", name: "admin", password: "admin", … }
    const columns = [
        {
            title: 'รหัส',
            dataIndex: 'id',
            key: 'id',
            render: text => <div className="text-gray-900">{text.substring(0, 3)}..{text.substring(text.length / 1.2, text.length - 1)}</div>,
        },
        {
            title: 'อีเมล',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'ชื่อผู้ใช้',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'รหัสผ่าน',
            dataIndex: 'password',
            key: 'password',
            render: text => <div className="text-gray-200">**{text.substring(text.length / 2)}</div>,
        },

    ];
    return (
        <div>
            <div className="flex gap-3">
                <p>ตารางจัดการข้อมูลผู้ใช้</p>
                <Button onClick={reload}>รีโหลด</Button>
            </div>
            <Table dataSource={admin} columns={columns} />

        </div>)
}
