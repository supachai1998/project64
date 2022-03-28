import { useState, useEffect } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
const ellipsis = {
    rows: 3,
    expandable: false,
}
export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [blogs, setBlogs] = useState([])
    const reload = async () => {
        const reqBlogs = await fetch("/api/getBlogs").then(res => res.status === 200 && res.json())
        const newBlogs = reqBlogs.map((val) => {
            const totalvote = val.vote_1 + val.vote_2 + val.vote_3 + val.vote_4 + val.vote_5
            const avg = totalvote / 5
            return { ...val, totalvote, avg }
        })
        // console.log(newBlogs)
        setBlogs(!!newBlogs && newBlogs.length > 0 && newBlogs || [])
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
            <ModalAdd setModalAdd={setModalAdd} modalAdd={modalAdd} reload={reload} />
            <ModalEdit setModalEdit={setModalEdit} modalEdit={modalEdit} reload={reload} />
            <ModalView setModalView={setModalView} modalView={modalView} reload={reload} />
            <TableForm blogs={blogs} reload={reload} modalEdit={modalEdit} setModalEdit={setModalEdit} modalView={modalView} setModalView={setModalView} />
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

const TableForm = ({ blogs, reload,
    modalEdit, setModalEdit,
    modalView, setModalView }) => {

    const columns = [
        {
            title: 'ประเภทบทความ',
            dataIndex: 'type',
            key: 'type',
            width: '10%',
            render: val => <Paragraph >
                {val === "NCDS" ? "โรคไม่ติดต่อ" : val === "FOOD" ? "อาหาร" || val === "ALL" : "ทั้งหมด"}
            </Paragraph>
        },
        {
            title: 'ชื่อบทความ',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: 'บทย่อ',
            dataIndex: 'imply',
            key: 'imply',
            width: '20%',
            render: val => <Tooltip title={val}><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: 'ผลโหวต',
            dataIndex: 'avg',
            key: 'avg',
            render: (val, source) => <Tooltip title={`${source.totalvote} โหวต`}><Paragraph align="right" ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: 'จำนวนหัวข้อย่อย',
            dataIndex: 'subBlog',
            key: 'subBlog',
            render: val => <Paragraph align="right" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: 'การอนุมัติ',
            dataIndex: 'approve',
            key: 'approve',
            width: '10%',
            render: (val, source) => <button className="w-full ml-3 mb-2" onClick={() => showConfirmApprove(source)}>
                {val === 1 ? <Tooltip title="อนุมัติ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg></Tooltip>
                    : val === 2 ?
                        <Tooltip title="ไม่อนุมัติ"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg></Tooltip>
                        : <Tooltip title="รออนุมัติ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Tooltip>
                }
            </button>
        },
        {
            title: 'การจัดการ',
            dataIndex: '',
            key: '',
            width: '20%',
            render: val => <div className="flex flex-wrap gap-2">
                <button className="button-cus bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(val)}>ดู</button>
                <button className="button-cus bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(val)}>แก้ไข</button>
                <button className="button-cus bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val)}>ลบ</button>
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
    const showConfirmApprove = async (val) => {
        const { approve } = val
        const th_approve = approve === 0 ? "รอการอนุมัติ" : approve === 1 ? "อนุมัติ" || approve === 2 : "ไม่อนุมัติ"
        const th_request = approve === 0 ? "อนุมัติ" : approve === 1 ? "ไม่อนุมัติ" || approve === 2 : "อนุมัติ"
        const preData = { id: val.id, approve: approve === 0 ? 1 : approve === 1 ? 2 || approve === 2 : 1 }
        console.log(val)
        confirm({
            title: `คุณต้องการจะ${approve === 0 ? "อนุมัติ" : approve === 1 ? "ไม่อนุมัติ" || approve === 2 : "อนุมัติ"}`,
            content: <div>
                <p>หัวข้อ : {val.name}</p>
                <p>สถานะ : {th_approve}</p>
            </div>,
            okText: th_request,
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/getBlogs", {
                    headers: { 'Content-Type': 'application/json', },
                    method: "PATCH",
                    body: JSON.stringify(preData)
                })
                if (res.status === 200) {
                    notification.success({
                        message: `${th_request}สำเร็จ`,
                    })
                    await reload()
                } else {
                    notification.error({
                        message: `${th_request}ไม่สำเร็จ`,
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
const ModalAdd = ({ modalAdd, setModalAdd, reload }) => {
    const [fileList, setFileList] = useState(null)
    const [type, setType] = useState(null)
    const [ncds, setNCDS] = useState()
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form,modalAdd]);
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
            const image = { create: _tempimage.map(({ response }) => ({ name: response.name })) }
            val['image'] = image
            val['subBlog'] = subBlog
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
                reload()
                setModalAdd(false)
            } else notification.error({
                message: 'ไม่สามารถเพิ่มข้อมูลได้',
                description: res.message,
            })
        } else {
            notification.error({
                message: 'ไม่สามารถเพิ่มข้อมูลได้',
                description: "การป้อนข้อมูลไม่ครบ",
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
                                {/* <Form.Item
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
                                        <Button disable={fileList?.length === 1} className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/5)</Button>
                                    </Upload>
                                </Form.Item> */}
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
const ModalEdit = ({ modalEdit, setModalEdit, reload }) => {
    const [fileList, setFileList] = useState([])
    const [type, setType] = useState(null)
    const [ncds, setNCDS] = useState()
    const [form] = Form.useForm();
    useEffect(() => {
        console.log(modalEdit)
        form.setFieldsValue(modalEdit);
        !!modalEdit && setFileList(modalEdit.image.map(({ id, name }) => {
            return {
                id: id,
                status: "done",
                url: `/static/${name}`,
                name: name
            }
        }))
    }, [form, modalEdit]);

    const onOk = () => {
        setModalEdit(false)
    }
    const onCancel = () => {
        setModalEdit(false)
    }

    const onSubmit = async (val) => {
        const _tempimage = val?.image?.fileList || val?.image
        const _tempsubBlog = val?.subBlog
        if (Array.isArray(_tempimage) && _tempimage.length > 0 && Array.isArray(_tempsubBlog) && _tempsubBlog.length > 0) {
            delete val['image']
            delete val['subBlog']
            const subBlog = _tempsubBlog
            const image = _tempimage.map(({ id, name }) => { return { id: id, name: name } })
            val['id'] = modalEdit.id
            val['image'] = image
            val['subBlog'] = subBlog
            console.log(val)
            const res = await fetch(`/api/getBlogs`, {
                headers: { 'Content-Type': 'application/json', },
                method: "PATCH",
                body: JSON.stringify({ old: modalEdit, new: val })
            })

            // console.log('send:', val);
            if (res.status === 200) {
                notification.success({
                    message: "แก้ไขข้อมูลสำเร็จ"
                })
                reload()
                setModalEdit(false)
            } else notification.error({
                message: 'ไม่สามารถแก้ไขข้อมูลได้',
                description: res.message,
            })
        } else {
            notification.error({
                message: 'ไม่สามารถแก้ไขข้อมูลได้',
                description: "การป้อนข้อมูลไม่ครบ",
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
    return <Modal title={"แก้ไขข้อมูลบทความ"}
        visible={!!modalEdit ? true : false}
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
                    fileList={fileList}
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
                <Button type="primary" htmlType="submit">แก้ไขข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalView = ({ modalView, setModalView, reload }) => {
    const [fileList, setFileList] = useState([])
    const [type, setType] = useState(null)
    const [ncds, setNCDS] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(modalView);
        if (!!modalView) {
            setFileList(modalView.image.map(({ id, name }) => {
                return {
                    id: id,
                    status: "done",
                    url: `/static/${name}`,
                    name: name
                }
            }))
            console.log(modalView)
            const newState = { ...modalView, type_th: modalView.type === "NCDS" ? "โรคไม่ติดต่อ" : modalView.type === "FOOD" ? "อาหาร" : modalView.type === "ALL" && "ทั้งหมด" }
            !modalView.type_th && setModalView(newState)
        }
    }, [form, modalView, setModalView]);

    const onOk = () => {
        setModalView(false)
    }
    const onCancel = () => {
        setModalView(false)
    }

    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    return <Modal title={"แก้ไขข้อมูลบทความ"}

        visible={!!modalView ? true : false}
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
            onFinish={onCancel}
            onFinishFailed={onFinishFailed}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภท"
            >
                <Typography ><span className="text" >{modalView.type_th}</span></Typography>
            </Form.Item>
            <Form.Item
                name="name"
                label="ชื่อบทความ">
                <Typography ><span className="text">{modalView.name}</span></Typography>
            </Form.Item>
            <Form.Item
                name="imply"
                label="บทย่อ">
                <Typography ><span className="text">{modalView.imply}</span></Typography>
                {/* <TextArea disabled rows={4} placeholder="บทย่อ" /> */}
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ">
                <Typography ><span className="text">{modalView.video}</span></Typography>
            </Form.Item>
            <Form.Item
                name="image"
                label="รูปภาพ"
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    disabled
                />
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
                            >

                                <Form.Item label={`หัวข้อที่ ${ind + 1}`}><Divider /></Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    name={[field.name, 'name']}
                                // fieldKey={[field.fieldKey, 'name']}
                                >
                                    <div className="flex gap-3 items-center">
                                        <Typography ><span className="text">{modalView.subBlog[ind].name}</span></Typography>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    name={[field.name, 'detail']}
                                // fieldKey={[field.fieldKey, 'detail']}
                                >
                                    <Typography ><span className="text">{modalView.subBlog[ind].detail}</span></Typography>
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>

            <div className="flex justify-end gap-2">
                <button htmlType="reset" onClick={onCancel}
                    className="button-cus bg-red-400 text-white hover:bg-red-300">ปิด</button>
            </div>
        </Form>
    </Modal>
}

const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "ทั้งหมด" },
]