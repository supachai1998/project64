import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Spin, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

import { Button_Delete } from '/ulity/button';
import { _AppContext } from '/pages/_app'
import router, { useRouter } from 'next/router';

const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
const ellipsis = {
    rows: 3,
    expandable: false,
}

export default function Index() {
    const { setTitle, setDefaultSelectedKeys } = useContext(_AppContext)
    const router = useRouter()
    const { id } = router.query
    const [modalAdd, setModalAdd] = useState(false)
    const [ncdsLoading, setNCDSLoading] = useState()
    const [foodLoading, setFoodLoading] = useState()
    const [ncds, setNCDS] = useState()
    const [food, setFood] = useState()
    const [edit, setEdit] = useState()
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [type, setType] = useState(null)
    const [form] = Form.useForm();

    useEffect(() => {
        setTitle("เขียนบทความ")
        setDefaultSelectedKeys("blogs_write")
    }, []);
    useEffect(() => {
        (async () => {
            setNCDSLoading(true)
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
    }, [])
    const query = async () => {
        if (id) {
            const data = await fetch(`/api/getBlogs?id=${id}`).then(res => res.ok && res.json())
            form.setFieldsValue(data);
            setEdit(data)
        } else form.setFieldsValue();
    }
    useEffect(() => {
        query()
    }, [form, modalAdd, router.query]);


    const onOk = () => {
        setModalAdd(false)
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        if (id) {
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
            val['id'] = edit.id
            val['approve'] = 0
            let relatedFood = []
            let relatedNcds = []
            // console.log(val['foodId'], val['ncdsId'])
            // console.log(form.getFieldValue("related"))
            if (val['foodId']?.length > 0) {
                // console.log("loop food")
                if (edit?.related?.length > 0) {
                    for (const [kk, vv] of Object.entries(form.getFieldValue("related"))) {
                        val['foodId'].map((v) => {
                            if (vv.foodId === v) relatedFood.push({ id: vv.id, foodId: vv.foodId })
                            relatedFood.push({ foodId: v })
                        })
                    }
                    // console.log("food",relatedFood)
                    relatedFood = relatedFood.filter((v, i, a) => a.findIndex(v2 => (v2.foodId === v.foodId)) === i)
                } else {
                    val['foodId'].map(v => relatedFood.push({ foodId: v }))
                }
            }
            if (val['ncdsId']?.length > 0) {
                // console.log("loop ncds")
                if (edit?.related?.length > 0) {
                    for (const [kk, vv] of Object.entries(form.getFieldValue("related"))) {
                        val['ncdsId'].map((v) => {
                            if (vv.ncdsId === v) relatedNcds.push({ id: vv.id, ncdsId: vv.ncdsId })
                            relatedNcds.push({ ncdsId: v })
                        })
                    }
                    // console.log("ncds",relatedNcds)
                    relatedNcds = relatedNcds.filter((v, i, a) => a.findIndex(v2 => (v2.ncdsId === v.ncdsId)) === i)
                } else {
                    val['ncdsId'].map(v => relatedNcds.push({ ncdsId: v }))
                }
            }
            val["ref"] = [...val["ref"]]
            val["related"] = [...relatedNcds,...relatedFood]
            delete val['foodId']
            delete val['ncdsId']
            // console.log(val)
            const res = await fetch(`/api/getBlogs`, {
                headers: { 'Content-Type': 'application/json', },
                method: "PATCH",
                body: JSON.stringify({ old: edit, new: val })
            })

            // console.log('send:', val);
            if (res.status === 200) {
                notification.success({
                    message: "แก้ไขข้อมูลสำเร็จ"
                })
                setEdit(false)
                fetch(`/api/uploads`)
                router.push(`/blogs/${val.type.toLowerCase()}/${val.id}`)
            } else notification.error({
                message: 'ไม่สามารถแก้ไขข้อมูลได้',
                description: res.message,
            })
        }
        else {
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
    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        form.resetFields()
    }
    const onFill = () => {
        form.setFieldsValue(edit)
    }
    const onChange = ({ fileList: newFileList }) => {
        // console.log(newFileList)
        setFileList(newFileList);
    }
    // const onChangeSubBlogs = ({ fileList: newFileList }) => {
    //     setFileListSubBlogs(newFileList);
    // }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    return <div className='min-h-screen sm:-m-2 py-10 px-1 bg-white'>
        {/* {console.log(form.getFieldValue())} */}
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ sm: { span: 8 }, md: { span: 6 }, lg: { span: 4 }, xl: { span: 3 } }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            onReset={onReset}>
            <Form.Item
                name="type"
                labelAlign="left"
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
            
            {id ? <>
                {(form.getFieldValue("type") === "NCDS" || form.getFieldValue("type") === "ALL") && <Form.Item
                    name="ncdsId"
                    label="เลือกโรค"
                    labelCol={{ sm:{span: 8 ,offset: 3} , md:{span: 6, offset: 3} , lg:{span: 5, offset: 3},xl:{span: 3, offset: 3} }}
                    labelAlign="left"
                    initialValue={edit?.related?.filter(({ ncdsId }) => ncdsId).map(({ id, ncdsId }) => ncdsId)}
                    rules={[{ required: true }]}>
                    <Select mode="multiple"
                        loading={ncdsLoading}
                        filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                    </Select>
                </Form.Item>}
                {(form.getFieldValue("type") === "FOOD" || form.getFieldValue("type") === "ALL") && <Form.Item
                    name="foodId"
                    label="เลือกรายการอาหาร"
                    labelCol={{ sm:{span: 8 ,offset: 3} , md:{span: 6, offset: 3} , lg:{span: 5, offset: 3},xl:{span: 3, offset: 3} }}
                    labelAlign="left"
                    initialValue={edit?.related?.filter(({ foodId }) => foodId).map(({ foodId }) => foodId)}
                    rules={[{ required: true }]}>
                    <Select mode="multiple"
                        loading={foodLoading}
                        filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                    </Select>
                </Form.Item>}</> : <>
                {(type === "NCDS" || type === "ALL") && <Form.Item
                    name="ncdsId"
                    label="เลือกโรค"
                    labelCol={{ sm:{span: 8 ,offset: 3} , md:{span: 6, offset: 3} , lg:{span: 5, offset: 3},xl:{span: 3, offset: 3} }}
                    labelAlign="left"
                    rules={[{ required: true }]}>
                    <Select mode="multiple"
                        loading={ncdsLoading}
                        filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                    </Select>
                </Form.Item>}
                {(type === "FOOD" || type === "ALL") && <Form.Item
                    name="foodId"
                    labelCol={{ sm:{span: 8 ,offset: 3} , md:{span: 6, offset: 3} , lg:{span: 5, offset: 3},xl:{span: 3, offset: 3} }}
                    labelAlign="left"
                    label="เลือกรายการอาหาร"
                    rules={[{ required: true }]}>
                    <Select mode="multiple"
                        loading={foodLoading}
                        filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                        {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                    </Select>
                </Form.Item>}
                </>}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                labelAlign="left"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="คำอธิบาย"
                labelAlign="left"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำอธิบาย" />
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ"
                labelAlign="left"
                rules={[{ required: false }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน ที่อยู่(url) ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>
            {/* {console.log(form.getFieldValue())} */}
            <Form.Item
                name="image"
                label="รูปภาพ"
                labelAlign="left"
                rules={[{ required: true, message: 'กรุณาเลือกรูปภาพ' }]}>


                <Upload
                    multiple={true}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={form?.getFieldValue("image")}
                    onChange={onChange}
                    className="upload-list-inline"
                >

                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({
                        form?.getFieldValue("image")?.fileList ?
                            form.getFieldValue("image")?.fileList?.length :
                            form.getFieldValue("image")?.filter(({ status }) => status === "done").length || 0
                    }/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" rules={[{ required: true, message: "คุณลืมเพิ่มหัวข้อย่อย" }]} >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields?.length > 0 && fields?.map((field, ind) => (

                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={"head"+field.key}
                                required
                            >
                                <Form.Item
                                    {...field}
                                    labelCol={null}
                                    wrapperCol={0}
                                    key={"h_t"+field.key}
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
                                    labelCol={{ sm:{span: 6 ,offset: 3} , md:{span: 4, offset: 3} , lg:{span: 3, offset: 3},xl:{span: 2, offset: 3} }}
                                    labelAlign="left"
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="ชื่อหัวข้อ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    labelCol={{ sm:{span: 6 ,offset: 3} , md:{span: 4, offset: 3} , lg:{span: 3, offset: 3},xl:{span: 2, offset: 3} }}
                                    labelAlign="left"
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder="เนื้อความ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    labelCol={{ sm:{span: 6 ,offset: 3} , md:{span: 4, offset: 3} , lg:{span: 3, offset: 3},xl:{span: 2, offset: 3} }}
                                    labelAlign="left"
                                    name={[field.name, 'image']}
                                    fieldKey={[field.fieldKey, 'image']}
                                    label="รูปภาพ"
                                // rules={[{ required: true , message: 'กรุณาเลือกรูปภาพ' }]}
                                >
                                    {/* {console.log(form?.getFieldValue("subBlog")?.length >0 ? form?.getFieldValue("subBlog")?.[ind]?.image : [])} */}
                                    <Upload
                                        multiple={true}
                                        accept='image/png,image/jpeg'
                                        maxCount={1}
                                        action="/api/uploads"
                                        listType="picture"
                                        defaultFileList={form?.getFieldValue("subBlog")?.length > 0 ? (
                                            form?.getFieldValue("subBlog")?.[ind]?.fileList ?
                                                form?.getFieldValue("subBlog")?.[ind]?.fileList :
                                                form?.getFieldValue("subBlog")?.[ind]?.image ?
                                                    [form?.getFieldValue("subBlog")?.[ind]?.image] : []
                                        ) : []}
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
                                        <Tooltip title={"ลบอ้างอิงที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip> อ้างอิงที่ {ind + 1}
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
                {!id && <button type="button" onClick={onReset}>ล้างค่า</button>}
                {id && <button type="button" onClick={onFill}>ย้อนค่าเดิม</button>}
                <button className={`${id ? "bg-yellow-200 hover:bg-yellow-300" : "bg-blue-200 hover:bg-blue-300"} px-2`} type="submit">{id ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</button>
            </div>
        </Form>
    </div>
}

const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "ทั้งหมด" },
]