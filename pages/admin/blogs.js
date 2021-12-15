import { useState, useEffect } from 'react';
import { Button, Table, Divider, Select, Modal, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select

export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [blogs, setBlogs] = useState([])
    const reload = async() =>{
            const reqBlogs = await fetch("/api/getBlogs").then(res => res.status === 200 &&res.json())
            setBlogs(!!reqBlogs && reqBlogs.length > 0 && reqBlogs || [])
    }
    useEffect(() => {
        reload()
    }, [modalAdd])
    return (
        <div
            className="ease-div flex flex-col gap-4">
            <Board />
            <div className="flex justify-between mt-4">
                <div className="text-xl">ตารางบทความ</div>
                <Button onClick={() => setModalAdd(true)}>เพิ่มข้อมูล</Button>
            </div>
            <ModalAdd setModalAdd={setModalAdd} modalAdd={modalAdd} />
            <TableForm blogs={blogs} reload={reload} />
        </div>
    )
}

const Board = () => {
    return <div className="sm:flex-row flex flex-col flex-wrap mt-4  gap-4 justify-center ">
        <div className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
            <div className="text-4xl">ABC</div>
            <div>ABC</div>
        </div>
        <div className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
            <div className="text-4xl">ABC</div>
            <div>ABC</div>
        </div>
        <div className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
            <div className="text-4xl">ABC</div>
            <div>ABC</div>
        </div>
        <div className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
            <div className="text-4xl">ABC</div>
            <div>ABC</div>
        </div>
        <div className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
            <div className="text-4xl">ABC</div>
            <div>ABC</div>
        </div>
    </div>
}

const TableForm = ({ blogs,reload }) => {
    const columns = [
        {
            title: 'ประเภทบทความ',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'ชื่อบทความ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'บทย่อ',
            dataIndex: 'imply',
            key: 'imply',
        },
        // {
        //     title: 'จำนวนโหวต',
        //     dataIndex: 'name_en',
        //     key: 'name_en',
        // },
        // {
        //     title: 'จำนวนหัวข้อย่อย',
        //     dataIndex: 'name_en',
        //     key: 'name_en',
        // },
        {
            title: 'การอนุมัติ',
            dataIndex: 'approve',
            key: 'approve',
            render: val => <div>
                {val === 1 ?
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    : val === 2 ?
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        :<Tooltip title="รออนุมัติ"> 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        </Tooltip>
                }
            </div>
        },
        {
            title: 'การจัดการ',
            dataIndex: '',
            key: '',
            render: val => <div>
                <Button type="text" className="bg-yellow-300" onClick={() => console.log(val)}>ดู</Button>
                <Button type="text" className="bg-yellow-300"  onClick={()=>{}}>แก้ไข</Button>
                <Button type="danger" onClick={() => showConfirmDel(val)}>ลบ</Button>
            </div>,
        },

    ];
    const showConfirmDel = async (val) => {
        confirm({
            title: `คุณต้องการจะลบบทความ`,
            content: <div>
                <p>{val.name}</p>
                <p>ประเภท : {val.type}</p>
            </div>,
            okText: "ตกลง",
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/getBlogs", {
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
    return <div>
        <Table dataSource={blogs} columns={columns} />
    </div>
}

const ModalAdd = ({ modalAdd, setModalAdd }) => {
    const [fileList, setFileList] = useState(null)
    const [type, setType] = useState(null)
    const [ncds, setNCDS] = useState()
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form]);
    useEffect(() => {
        (async () => {
            const data = await fetch('/api/getNCDS').then(resp => resp.json());
            setNCDS(data)
        })()
    }, []);

    const onOk = () => {
        setModalAdd(false)
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        const _tempimage = val?.image?.fileList
        const _tempsubBlog = val?.subBlog
        if (Array.isArray(_tempimage) && _tempimage.length > 0 && Array.isArray(_tempsubBlog) && _tempsubBlog.length > 0) {
            delete val['image']
            delete val['subBlog']
            const subBlog = { create: _tempsubBlog }
            const image = { create: _tempimage.map(({ name }) => ({ name: name })) }
            val['image'] = image
            val['subBlog'] = subBlog
            // console.log(val)
            const res = await fetch(`/api/getBlogs`, {
                headers: { 'Content-Type': 'application/json', },
                method: "POST",
                body: JSON.stringify(val)
            })

            // console.log('send:', val);
            if (res.status === 200) {
                notification.success({
                    message: "เพิ่มข้อมูลสำเร็จ"
                })
                // reload()
            } else notification.error({
                message: 'ไม่สามารถเพิ่มข้อมูลได้',
                description: res.message,
            })
        }
    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    return <Modal title={"เพิ่มข้อมูลบทความ"}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภท"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onChange={onTypeChange}
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={ind} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            {/* {type &&
                type === "FOOD" ? <Form.Item
                    name="food"
                    label="ชื่ออาหาร"
                    rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกชื่ออาหาร"
                    optionFilterProp="children"
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={ind} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>
                : type === "NCDS" && <Form.Item
                    name="ncds"
                    label="ชื่อโรคไม่ติดต่อ"
                    rules={[{ required: true }]}>
                    <Select
                        showSearch
                        placeholder="เลือกโรคไม่ติดต่อ"
                        optionFilterProp="children"
                        // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        {ncds.map(({ name_th, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                    </Select>
                </Form.Item>
            } */}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="บทย่อ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="บทย่อ" />
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ"
                rules={[{ required: false }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน ที่อยู่(url) ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>
            <Form.Item
                name="image"
                label="รูปภาพ"
                rules={[{ required: true }]}
            >

                <Upload
                    multiple={true}
                    accept='image/png,image/jpeg'
                    maxCount={5}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={[]}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button disable={fileList?.length === 5} className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/5)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >

                                <Form.Item label={`หัวข้อที่ ${ind + 1}`}><Divider /></Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <div className="flex gap-3 items-center">
                                        <Input placeholder="ชื่อหัวข้อ" />
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined onClick={() => remove(field.name)} /></Tooltip>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder="เนื้อความ" />
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อ</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>

            <div className="flex justify-end gap-2">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">เพิ่มข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}

const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "ทั้งหมด" },
]