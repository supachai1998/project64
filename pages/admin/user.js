import { prisma } from "/prisma/client";
import { Button, Divider, Form, Input, message, notification, Modal, Table, Tooltip, Select } from "antd";
import { useEffect, useState } from "react";
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import DeleteIcon from '@mui/icons-material/Delete';
import { Autorenew } from "@mui/icons-material";
import { Role } from ".prisma/client";

const { confirm } = Modal;
const { Option } = Select
const Index = ({ dataAdmin }) => {
    const [admin, setAdmin] = useState(dataAdmin || [])
    const reload = async () => {
        const res = await fetch(`/api/admin`, {
            headers: { 'Content-Type': 'application/json', },
        })
        if (res.status === 200 || res.status === 304) {
            const data = await res.json()
            if (Array.isArray(data)) setAdmin(data)

        }

    }
    const onFinish = async (values) => {
        const res = await fetch(`/api/admin`, {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(values)
        })

        console.log('send:', values);
        if (res.status === 200) {
            notification.success({
                message: "เพิ่มข้อมูลสำเร็จ"
            })
            reload()
        } else notification.error({
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
                            <p className="sm:text-4xl text-xl text-blue-800">จัดการข้อมูลผู้ใช้</p>
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
                <TableAdmin admin={admin} reload={reload} />
            </>}
        </div>
    );
}

export default Index;

export const getServerSideProps = async (ctx) => {
    const dataAdmin = await prisma.user.findMany()
    return {
        props: {
            dataAdmin
        }
    }
}


const TableAdmin = ({ admin, reload }) => {
    const [valUser, setValUser] = useState(null);


    const handleOk =async (val) => {
        const sendData = JSON.stringify({...valUser,...val})
        // console.log("send --> ",sendData)
        const res = await fetch("/api/admin", {
            headers: { 'Content-Type': 'application/json', },
            method: "PATCH",
            body: sendData
        })
        if (res.status === 200) {
            notification.success({
                message: 'แก้ไขข้อมูลสำเร็จ',
            })
            await reload()
            setValUser(null);
        } else {
            notification.error({
                message: 'ไม่สามารถแก้ไขข้อมูลได้',
                description: 'ไม่สามารถติดต่อ server หรือ email ซ้ำ ',
            })
        }
    };

    const handleCancel = () => {
        setValUser(null);
    };

    const showConfirmDel = async (val) => {
        confirm({
            title: `คุณต้องการจะลบผู้ใช้ ${val.name}`,
            // icon: <DeleteIcon color="warning"/>,
            content: <div>
                <h1>ข้อมูลผู้ใช้</h1>
                <p>อีเมล : {val.email}</p>
                <p>ชื่อ : {val.name}</p>
                <p>สิทธิ์ : {val.role}</p>
            </div>,
            okText: "ตกลง",
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/admin", {
                    headers: { 'Content-Type': 'application/json', },
                    method: "DELETE",
                    body: JSON.stringify(val)
                })
                if (res.status === 200) {
                    notification.success({
                        message: 'ลบข้อมูลสำเร็จ',
                    })
                    await reload()
                } else {
                    notification.error({
                        message: 'ไม่สามารถลบข้อมูลได้',
                        description: 'ไม่สามารถติดต่อ server ',
                    })
                }
            },
            onCancel() { },
        });
    }


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
            title: 'สิทธิ์',
            dataIndex: 'role',
            key: 'role',
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
        {
            title: 'สถานะ',
            dataIndex: 'delete',
            key: 'delete',

            render: val => <>{val ? <Tooltip title="ถูกปิดกั้น"><DoNotDisturbIcon className="text-red-500" /></Tooltip> : <Tooltip title="อนุมัติ"><LibraryAddCheckIcon className="text-green-500" /></Tooltip>}</>
        },
        {
            title: 'การจัดการ',
            dataIndex: '',
            key: '',
            render: val => <div>
                {/* <Button type="text" className="bg-yellow-300" onClick={() => console.log(val)}>ดู</Button> */}
                <Button type="text" className="bg-yellow-300" onClick={() => setValUser(val)}>แก้ไข</Button>

                <Button type="danger" onClick={() => showConfirmDel(val)}>ลบ</Button>
            </div>,
        },

    ];

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(valUser);
    }, [form,valUser]);
    return (
        <div>
            <div className="flex gap-3 items-center my-3">
                <span>ตารางจัดการข้อมูลผู้ใช้</span>
                <Button onClick={reload} icon={<Autorenew className="text-blue-700 text-xs" />} />
            </div>
            <Table dataSource={admin} columns={columns} />
            <Modal title="แก้ไขข้อมูลผู้ใช้" visible={!!valUser && true} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <Form
                    form={form}
                    initialValues={valUser}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={handleOk}
                    onFinishFailed={handleCancel}>
                    <Form.Item
                        name="name"
                        label="ชื่อผู้ใช้"
                        rules={[{ required: true, message: 'ใส่ชื่อของคุณ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='email'
                        label="อีเมล"
                        rules={[
                            { required: true, message: 'ใส่อีเมลของคุณ!' },
                            { type: 'email', message: 'โปรดใส่อีเมลให้ถูกต้อง เช่น admin@email.com!' }
                        ]}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="พาสเวิร์ด"
                        rules={[{ required: true, message: 'ใส่พาสของคุณ!' }]}
                    >
                        <Input disabled/>
                    </Form.Item>
                    
                    <Form.Item
                        name="role"
                        label="สิทธิ์"
                        rules={[{ required: true, message: 'โปรดเลือกสิทธิ์!' }]}
                    >
                        <Select >
                            {Object.values(Role).map((role, i) => <Option key={i} value={role}>{role.toLowerCase()}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="delete"
                        label="สถานะ"
                        rules={[{ required: true, message: 'โปรดเลือกสถานะ!' }]}
                    >
                        <Select>
                            <Option key={false} value={false}>อนุญาต</Option>
                            <Option key={true} value={true}>ปิดกั้น</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 24 }} >
                        <div className="flex flex-wrap gap-3 justify-end">
                            <Button htmlType="button" onClick={handleCancel}>ยกเลิก</Button>
                            <Button htmlType="submit" type="primary">แก้ไข</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>)
}


const ModalEditForm = async ({ }) => {
    return
}