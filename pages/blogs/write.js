import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Spin, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { Button_Delete } from '/ulity/button';
import {_AppContext} from '/pages/_app'
import router from 'next/router';

const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
const ellipsis = {
    rows: 3,
    expandable: false,
}

export default function Index() {
    const {setTitle,setDefaultSelectedKeys} = useContext(_AppContext)
    const [modalAdd, setModalAdd] = useState(false)
    const [ncdsLoading, setNCDSLoading] = useState()
    const [foodLoading, setFoodLoading] = useState()
    const [ncds, setNCDS] = useState()
    const [food, setFood] = useState()
    const [store, setStore] = useState()
    const [blogs, setBlogs] = useState()
    const [loading, setLoading] = useState()
    const reload = async () => {
        setLoading(true)
        const reqBlogs = await fetch("/api/getBlogs?approve=true")
            .then(res => res.status === 200 && res.json())
            .then(data => {
                if (!!data && data.length > 0) {
                    setBlogs(data)
                    setStore(data)
                }
            })
            .catch(err => notification.error({ message: "Error", description: err.message }))
        setLoading(false)
    }
    useEffect(() => {
        setTitle("เขียนบทความ")
        setDefaultSelectedKeys("blogs_write")
    }, []);
    useEffect(() => {
        (async () => {
            setNCDSLoading(true)
            reload()
            const req_ncds = await fetch('/api/getNCDS?select=id,name_th,name_en')
                .then(async resp => resp.ok && resp.json())
                .then(data => setNCDS(data)).catch(err => notification.error({ message: "Error", description: err.message }))
            setNCDSLoading(false)
            setFoodLoading(true)
            const req_food = await fetch('/api/getFood?select=id,name_th,name_en')
                .then(async resp => resp.ok && resp.json())
                .then(data => setFood(data)).catch(err => notification.error({ message: "Error", description: err.message }))
            setFoodLoading(false)
        })()
        return () => setBlogs([])
    }, [])
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [type, setType] = useState(null)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);


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
            fetch(`/api/uploads`)
            const v = await res.json()
            console.log(v)
            router.push(`/blogs/${v.type.toLowerCase()}/${v.id}`)
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
    return <div className='min-h-screen'>
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
                rules={[{ required: true, message: 'กรุณาเลือกประเภทความสัมพันธ์' }]}>
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
                rules={[{ required: true, message: 'กรุณาเลือกรูปภาพ' }]}>


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
            <Form.List name="subBlog" rules={[{ required: true, message: "คุณลืมเพิ่มหัวข้อย่อย" }]} >
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
                                            <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip><div > หัวข้อย่อยที่ {ind + 1}</div>
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
                                // rules={[{ required: true , message: 'กรุณาเลือกรูปภาพ' }]}
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
            <Form.List name="ref" rules={[{ required: true, message: "คุณลืมเพิ่มอ้างอิง" }]} >
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
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip> แหล่งอ้างอิงที่ {ind + 1}
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
    </div>
}

const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "ทั้งหมด" },
]