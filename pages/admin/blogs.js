import { useState, useEffect, createContext, useContext } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Spin, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Board from '../../components/admin/DisplayBoard';
import CusImage from '/components/cusImage';
import ReactPlayer from 'react-player';
const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
const ellipsis = {
    rows: 3,
    expandable: false,
}
const Context = createContext()

export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState([])
    const reload = async () => {
        setLoading(true)
        const reqBlogs = await fetch("/api/getBlogs?approve=true")
            .then(res => res.status === 200 && res.json())
            .then(data => setBlogs(!!data && data.length > 0 && data || []))
            .catch(err => notification.error({ message: "Error", description: err.message }))
        setLoading(false)
    }
    useEffect(() => {
        reload()
        return () => setBlogs([])
    }, [])
    return (
        <div className="ease-div flex flex-col gap-4 w-full">
            <Board data={{}} />
            <div className="flex justify-between mt-4">
                <div className="text-xl"></div>
                <Button onClick={() => setModalAdd(true)}>เพิ่มบทความ</Button>
            </div>
            <Context.Provider value={{
                reload,
                modalAdd, setModalAdd,
                modalEdit, setModalEdit,
                modalView, setModalView,
                loading,
                blogs
            }}>
                <ModalAdd />
                <ModalEdit />
                <ModalView />
                <TableForm />
            </Context.Provider>
        </div>
    )
}



const TableForm = () => {
    const { blogs, reload, loading,
        setModalEdit,
        setModalView } = useContext(Context)
    const columns = [
        {
            title: 'ประเภทบทความ',
            dataIndex: 'type',
            key: 'type',

            render: val => <Paragraph >
                {val === "NCDS" ? "โรคไม่ติดต่อ" : val === "FOOD" ? "อาหาร" || val === "ALL" : "ทั้งหมด"}
            </Paragraph>
        },
        {
            title: 'ชื่อบทความ',
            dataIndex: 'name',
            key: 'name',

            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: 'คำอธิบาย',
            dataIndex: 'imply',
            key: 'imply',

            render: val => <Tooltip title={val}><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: 'ผลโหวต',
            dataIndex: 'avg_vote',
            key: 'avg_vote',
            render: (val) => <Tooltip title={`${val >= 0 ? val : 0}/5`}><Paragraph align="center" ellipsis={ellipsis}>{val >= 0 ? val : 0}</Paragraph></Tooltip>
        },
        {
            title: 'จำนวนหัวข้อย่อย',
            dataIndex: 'subBlog',
            key: 'subBlog',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: 'จำนวนโรคที่เกี่ยวข้อง',
            dataIndex: 'related',
            key: 'related',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: 'การอนุมัติ',
            dataIndex: 'approve',
            key: 'approve',

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

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className="button-cus bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(blogs[index])}>ดู</button>
                <button className="button-cus bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(blogs[index])}>แก้ไข</button>
                <button className="button-cus bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(blogs[index])}>ลบ</button>
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
    if (!blogs) return null
    return <div>
        <Table size='small' tableLayout='auto' dataSource={blogs} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางบทความ
                <Tooltip title={"ดึงข้อมูลใหม่"}><button type="button" onClick={() => reload()} >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                </Tooltip>
            </div>}
            footer={() => 'Footer'} />
    </div>
}
const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload } = useContext(Context)
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [type, setType] = useState(null)
    const [ncds, setNCDS] = useState()
    const [food, setFood] = useState()
    const [ncdsLoading, setNCDSLoading] = useState()
    const [foodLoading, setFoodLoading] = useState()
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);
    useEffect(() => {
        (async () => {
            setNCDSLoading(true)
            const req_ncds = await fetch('/api/getNCDS?select=id,name_th,name_en')
                .then(resp => resp.json())
                .then(data => setNCDS(data)).catch(err => console.log(err))
            setNCDSLoading(false)
            setFoodLoading(true)
            const req_food = await fetch('/api/getFood?select=id,name_th,name_en')
                .then(resp => resp.json())
                .then(data => setFood(data)).catch(err => console.log(err))
            setFoodLoading(false)
        })()
    }, []);

    const onOk = () => {
        setModalAdd(false)
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        if (!Array.isArray(val?.image?.fileList)) {
            notification.error({ message: "คุณไม่ได้เพิ่มรูปภาพ" })
            return
        }
        if (!Array.isArray(val?.subBlog)) {
            notification.error({ message: "คุณไม่ได้เพิ่มบทความย่อย" })
            return
        }
        const _tempimage = val?.image?.fileList
        console.log(val.subBlog)
        const _tempsubBlog = val?.subBlog.map((val) => {
            return {
                ...val,
                ...(val?.image?.fileList?.length > 0) && { image: val.image.fileList[0].response.name }
            }
        })
        delete val['image']
        delete val['subBlog']
        const subBlog = { create: _tempsubBlog }
        const image = { create: _tempimage.map(({ response }) => ({ name: response.name })) }
        val['image'] = image
        val['subBlog'] = subBlog
        let related = []
        if (val['foodId']) {
            related = [...related, ...val['foodId'].map((v) => { return { foodId: v } })]
            delete val['foodId']
        }
        if (val['ncdsId']) {
            related = [...related, ...val['ncdsId'].map((v) => { return { ncdsId: v } })]
            delete val['ncdsId']
        }
        val['related'] = { create: [...related] }
        val["ref"] = { create: [...val["ref"]] }
        console.log(val)
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
            fetch(`/api/uploads`)
        } else notification.error({
            message: 'ไม่สามารถเพิ่มข้อมูลได้',
            description: res.message,
        })

    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const onChangeSubBlogs = ({ fileList: newFileList }) => {
        setFileListSubBlogs(newFileList);
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
            labelCol={{ span: 3 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภทความสัมพันธ์"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onChange={onTypeChange}
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={`${name_en}_${ind}`} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            {(type === "NCDS" || type === "ALL") && <Form.Item
                name="ncdsId"
                label="เลือกโรค"
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={ncdsLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            {(type === "FOOD" || type === "ALL") && <Form.Item
                name="foodId"
                label="เลือกรายการอาหาร"
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={foodLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="คำอธิบาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำอธิบาย" />
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
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={fileList}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >
                                <Form.Item
                                    {...field}
                                    labelCol={null}
                                    wrapperCol={0}
                                >
                                    <> {ind !== 0 && <Divider />}
                                        <div className="flex gap-3 items-center text-lg  justify-center pt-2 mb-4">
                                            <div > หัวข้อย่อยที่ {ind + 1}</div> <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => remove(field.name)} /></Tooltip>
                                        </div>
                                    </>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="ชื่อหัวข้อ" />
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
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'image']}
                                    fieldKey={[field.fieldKey, 'image']}
                                    label="รูปภาพ"
                                // rules={[{ required: true }]}
                                >

                                    <Upload
                                        multiple={true}
                                        accept='image/png,image/jpeg'
                                        maxCount={1}
                                        action="/api/uploads"
                                        listType="picture"
                                        defaultFileList={[]}
                                        // onChange={onChangeSubBlogs}
                                        className="upload-list-inline"
                                    >
                                        <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป</Button>
                                    </Upload>
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อย่อย</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >

                                {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}
                                <Form.Item
                                    {...field}
                                    label={<div className="flex gap-3 items-center">
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => remove(field.name)} /></Tooltip> แหล่งอ้างอิงที่ {ind + 1}
                                    </div>}
                                    name={[field.name, 'url']}
                                    fieldKey={[field.fieldKey, 'url']}
                                    rules={[{ required: true }]}
                                >

                                    <Input placeholder="แหล่งอ้างอิง" />

                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มแหล่งอ้างอิง</span>
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
const ModalEdit = () => {
    const { modalEdit, setModalEdit, reload } = useContext(Context)
    const [type, setType] = useState(modalEdit?.type)
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [ncds, setNCDS] = useState()
    const [food, setFood] = useState()
    const [ncdsLoading, setNCDSLoading] = useState()
    const [foodLoading, setFoodLoading] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        if (modalEdit) {
            setFileList(modalEdit?.image || [])
            setFileListSubBlogs(modalEdit?.subBlog?.map(({ image }) => image) || [])
        }
        form.setFieldsValue(modalEdit);
    }, [form, modalEdit]);


    useEffect(() => {
        (async () => {
            const req_ncds = await fetch('/api/getNCDS?select=id,name_th,name_en')
                .then(resp => resp.json())
                .then(data => setNCDS(data)).catch(err => console.log(err))
            const req_food = await fetch('/api/getFood?select=id,name_th,name_en')
                .then(resp => resp.json())
                .then(data => setFood(data)).catch(err => console.log(err))
            form.setFieldsValue(modalEdit);
        })()
    }, []);


    const onOk = () => {
        setModalEdit(false)
    }
    const onCancel = () => {
        setModalEdit(false)
    }

    const onSubmit = async (val) => {
        if (!Array.isArray(val?.image?.fileList || val?.image)) {
            notification.error({ message: "คุณไม่ได้เพิ่มรูปภาพ" })
            return
        }
        if (!Array.isArray(val?.subBlog)) {
            notification.error({ message: "คุณไม่ได้เพิ่มบทความย่อย" })
            return
        }
        let _tempimage = []
        if (val?.image?.fileList) {
            for (const i in val.image.fileList) {
                const fL = val.image.fileList[i]
                fL.response ? _tempimage.push({ name: fL.response.name }) : _tempimage.push({ ...fL })

            }
        }
        else { _tempimage = val?.image }
        const _tempsubBlog = val?.subBlog.map((val) => {
            return {
                ...val,
                ...(val?.image?.fileList?.length > 0) && { image: val.image.fileList[0].response.name }
            }
        })
        delete val['image']
        delete val['subBlog']
        val['image'] = _tempimage
        val['subBlog'] = _tempsubBlog
        val['id'] = modalEdit.id
        let related = []
        if (val['foodId']) {
            for (const [kk, vv] of Object.entries(modalEdit.related)) {
                val['foodId'].map((v) => {
                    if (vv.foodId === v) related.push({ id: vv.id, foodId: vv.foodId })
                    else related.push({ foodId: v })
                })
            }
            delete val['foodId']
            related = related.filter((v, i, a) => a.findIndex(v2 => (v2.foodId === v.foodId)) === i)
        }
        if (val['ncdsId']) {
            for (const [kk, vv] of Object.entries(modalEdit.related)) {
                val['ncdsId'].map((v) => {
                    console.log(v, vv.ncdsId)
                    if (vv.ncdsId === v) related.push({ id: vv.id, ncdsId: vv.ncdsId })
                    else related.push({ ncdsId: v })
                })
            }
            delete val['ncdsId']
            related = related.filter((v, i, a) => a.findIndex(v2 => (v2.ncdsId === v.ncdsId)) === i)
        }
        val["ref"] = [...val["ref"]]
        val["related"] = [...related]

        // console.log(val)
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
            fetch(`/api/uploads`)
        } else notification.error({
            message: 'ไม่สามารถแก้ไขข้อมูลได้',
            description: res.message,
        })

    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    if (!modalEdit) return null
    return <Modal title={"แก้ไขข้อมูลบทความ"}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ span: 3 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภทความสัมพันธ์"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onChange={onTypeChange}
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={`${name_en}_${ind}`} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            {(type === "NCDS" || type === "ALL") && <Form.Item
                name="ncdsId"
                label="เลือกโรค"
                initialValue={modalEdit.related.filter(({ ncdsId }) => ncdsId).map(({ id, ncdsId }) => ncdsId)}
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={ncdsLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            {(type === "FOOD" || type === "ALL") && <Form.Item
                name="foodId"
                label="เลือกรายการอาหาร"
                initialValue={modalEdit.related.filter(({ foodId }) => foodId).map(({ foodId }) => foodId)}
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={foodLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="คำอธิบาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำอธิบาย" />
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
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList?.length || 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={`หัวข้อย่อย ${field.key}`}
                                required
                            >
                                <Form.Item
                                    {...field}
                                    labelCol={null}
                                    wrapperCol={0}
                                    key={`หัวข้อย่อยที่ ${ind}`}
                                >
                                    <> {ind !== 0 && <Divider />}
                                        <div className="flex gap-3 items-center text-lg  justify-center pt-2 mb-4">
                                            <div > หัวข้อย่อยที่ {ind + 1}</div> <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => { remove(field.name); setFileListSubBlogs(prev => prev.filter((v, i) => i !== ind)) }} /></Tooltip>
                                        </div>
                                    </>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    key={`image ${ind}`}
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >

                                    <Input placeholder="ชื่อหัวข้อ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    key={`detail ${ind}`}
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder="เนื้อความ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    key={`image ${ind}`}
                                    name={[field.name, 'image']}
                                    fieldKey={[field.fieldKey, 'image']}
                                    label="รูปภาพ"
                                // rules={[{ required: true }]}
                                >
                                    <Upload
                                        multiple={true}
                                        accept='image/png,image/jpeg'
                                        maxCount={1}
                                        action="/api/uploads"
                                        listType="picture"
                                        // onChange={(e) => onChangeSubBlogs(ind, e)}
                                        className="upload-list-inline"
                                    >
                                        <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป{!!fileListSubBlogs && fileListSubBlogs[ind] ? 1 : 0}/1</Button>
                                    </Upload>
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อย่อย</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >

                                {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}
                                <Form.Item
                                    {...field}
                                    label={<div className="flex gap-3 items-center">
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => { remove(field.name); }} /></Tooltip> แหล่งอ้างอิงที่ {ind + 1}
                                    </div>}
                                    name={[field.name, 'url']}
                                    fieldKey={[field.fieldKey, 'url']}
                                    rules={[{ required: true }]}
                                >

                                    <Input placeholder="แหล่งอ้างอิง" />

                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มแหล่งอ้างอิง</span>
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

const ModalView = () => {
    const { setModalView, modalView, reload } = useContext(Context)
    const onCancel = () => {
        setModalView(false)
    }
    if (!modalView) return null
    return <Modal title={modalView.name}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form labelCol={{ span: 4 }} labelAlign="left">
            <Form.Item label={`รูปภาพ`}>{modalView?.image?.map(({ name }) => <>{name ? <CusImage className="rounded-md shadow-lg" key={name} width="250px" height="150px" src={name} /> : "ไม่พบรูปภาพ"}</>)}</Form.Item>
            <Form.Item label="ประเภท"><span className='text-lg whitespace-pre-line'>{modalView.type === "ALL" ? "ทั้งหมด" : modalView.type === "NCDS" ? "โรคไม่ติดต่อ" : modalView.type === "FOOD" ? "อาหาร" : ""}</span></Form.Item>
            <Form.Item label={`ความเกี่ยวข้อง ${modalView?.related?.length}`}>
                <div className="flex gap-2"> {!!modalView?.related && modalView?.related?.length > 0 ? modalView?.related?.map(({ id, Foods, ncds }, index) => <>
                    <span key={`${id}_${index}`} className='text-md whitespace-pre-line'>{Foods?.name_th || ncds?.name_th}</span>
                </>) : "ไม่พบความเกี่ยวข้อง"}
                </div>
            </Form.Item>

            <Form.Item label="การอนุมัติ"><span className='text-md whitespace-pre-line'>{modalView.approve === 1 ? "อนุมัติ" : modalView.approve === 2 ? "ไม่อนุมัติ" : "รอการอนุมัติ"}</span></Form.Item>
            <Form.Item label="ชื่อบทความ"><span className='text-lg whitespace-pre-line'>{modalView.name}</span></Form.Item>
            <Form.Item label="คำอธิบาย"><span className='text-md whitespace-pre-line'>{modalView.imply}</span></Form.Item>
            <Form.Item label="หัวข้อย่อย">
                {modalView.subBlog.map(({ name, image, detail }, index) => <div key={`${name}_${index}`}>
                    <Form labelCol={{ span: 4 }} labelAlign="left">
                        <Form.Item label={`หัวข้อย่อย ${index + 1}`}></Form.Item>
                        <Form.Item label={`รูปภาพ`}>{image ? <CusImage className="rounded-md shadow-lg" width="250px" height="150px" src={image} /> : "ไม่พบรูปภาพ"}</Form.Item>
                        <Form.Item label={`ชื่อหัวข้อย่อย`}><span className='text-md whitespace-pre-line'>{name}</span></Form.Item>
                        <Form.Item label={`เนื้อหา`}><span className='text-md whitespace-pre-line'>{detail}</span></Form.Item>
                    </Form>
                </div>)}
            </Form.Item>

            <Form.Item label="วิดีโอ">{modalView.video ? <ReactPlayer url={modalView.video} /> : "ไม่พบวิดีโอ"}</Form.Item>
            <Form.Item label={`อ้างอิง ${modalView?.ref?.length}`}>{!!modalView?.ref && modalView?.ref?.length > 0 ? modalView?.ref?.map(({ url }) => <><span key={url} className='text-md whitespace-pre-line'>{url}</span><br /></>) : "ไม่พบข้อมูลอ้างอิง"}</Form.Item>

        </Form>
    </Modal>

}
const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "ทั้งหมด" },
]