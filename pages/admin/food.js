import { useState, useEffect, createContext, useContext } from 'react';
import { Button, Table, Divider, Typography, Select, Modal,  Form, Input, Upload, notification, InputNumber,  Tooltip ,Radio } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CusImage from '/components/cusImage';
import ReactPlayer from 'react-player';
import { Button_Delete } from '/ulity/button';

const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
const ellipsis = {
    rows: 3,
    expandable: false,
}
const Context = createContext()

function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalAddType, setModalAddType] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const [food, setFood] = useState()
    const [NCDS, setNCDS] = useState()
    const reload = async () => {
        setLoading(true)
        await fetch("/api/getFood").then(async res => {
            if (res.status === 200) {
                const data = await res.json()
                setFood(data)
            }
        })
        setLoading(false)
    }
    useEffect(() => {
        (async()=>{
            reload()
            const fetchNCDS = await FetchNCDS()
            Array.isArray(fetchNCDS) && setNCDS(fetchNCDS)
        })()
        return () => setFood()
    }, [])
    return (
        <div
            className="ease-div flex flex-col gap-4">
            {/* <Board /> */}
            <div className="flex justify-between mt-4">
                <div className="text-xl"></div>
                <div className="flex gap-3">
                    <Button onClick={() => setModalAddType(true)}>จัดการประเภทอาหาร</Button>
                    <Button onClick={() => setModalAdd(true)}>เพิ่มข้อมูลอาหาร</Button>
                </div>
            </div>
            <Context.Provider value={{
                reload,
                NCDS,
                modalAdd, setModalAdd,
                modalEdit, setModalEdit,
                modalView, setModalView,
                modalAddType, setModalAddType,
                loading,
                food,
            }}>
                <ModalView />
                <ModalAdd />
                <ModalEdit />
                <ModalManageType />
                <TableForm />
            </Context.Provider>
        </div>
    )
}

export default Index;




const TableForm = () => {
    const { food, reload,
        setModalEdit,
        setModalView,
        loading } = useContext(Context)

    const columns = [
        {
            title: <Paragraph align="center" >ชื่ออาหาร</Paragraph>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >คำอธิบาย</Paragraph>,
            dataIndex: 'detail',
            key: 'detail',
            width: '30%',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >จำนวนอ้างอิง</Paragraph>,
            dataIndex: 'ref',
            key: 'ref',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <Paragraph align="center" >จำนวนโรคแนะนำ</Paragraph>,
            dataIndex: 'FoodNcds',
            key: 'FoodNcds',
            render: (text, val, index) => <Tooltip title={<div>
                {food[index].FoodNcds.map((val, index) => <div key={index}>{val.ncds.name_th}({val.suggess ? "แนะนำ" : "ไม่แนะนำ"})</div>)}
            </div>}><Paragraph align="center" ellipsis={ellipsis}>{text.length}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >การจัดการ</Paragraph>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(food[index])}>ดู</button>
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(food[index])}>แก้ไข</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(food[index], reload)}>ลบ</button>
            </div>,
        },

    ];


    return <div>
        <Table size='small' tableLayout='auto' dataSource={food} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางอาหาร
                <Tooltip title={"ดึงข้อมูลใหม่"}><button type="button" onClick={() => reload()} >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                </Tooltip>
            </div>}
        />
    </div>
}
const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload , NCDS } = useContext(Context)
    const [foodType, setFoodType] = useState(null)
    const [fileList, setFileList] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);

    useEffect(() => {
        (async () => {
            if (modalAdd) {
                const fetchTypeFood = await FetchTypeFood()
                Array.isArray(fetchTypeFood) && setFoodType(fetchTypeFood)
            }
        })()
    }, [modalAdd])
    const onOk = async (val) => {
        if (!val.ref) {
            notification.error({ message: "กรุณาเพิ่มแหล่งอ้างอิง" })
            return
        } else if (!val.FoodNcds) {
            notification.error({ message: "กรุณาเพิ่มโรคไม่ติดต่อ" })
            return
        }
        val["image"] = {
            create: val?.image?.fileList.map(({ response }) => { return { name: response.name } })
        }
        val["FoodNcds"] = { create: [...val["FoodNcds"]] }
        val["ref"] = { create: [...val["ref"]] }
        val["calories"] = parseFloat(val["calories"])
        const res = await fetch(`/api/getFood`, {
            method: "POST",
            body: JSON.stringify(val)
        })
            .then(res => {
                if (res.ok) {
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    setModalAdd(false)
                    fetch(`/api/uploads?name=food`)
                    reload()
                } else {
                    notification.error({ message: `ไม่สามารถเพิ่มข้อมูลได้ ${res.json().code}` })
                }
            })
    }
    const onCancel = () => {
        setModalAdd(false)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const onReset = () => {
        setFileList(null)
        form.setFieldsValue();
    }
    return <Modal
        title={"เพิ่มข้อมูลอาหาร"}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}

        // onOk={onOk}
        onCancel={onCancel}
        width="90%"
    >
        <Form
            form={form}
            // initialValues={valUser}
            labelCol={{ span: 3 }}
            onFinish={onOk}
            onReset={onReset}
            scrollToFirstError={true}
            labelWrap={true}
        // onFinishFailed={onCancel}
        >

            <Form.Item
                name="foodTypeId"
                label="ประเภท"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!foodType && foodType.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="name_th"
                label="ชื่ออาหารไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F- ]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่ออาหารอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z0-9- ]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="detail"
                label="คำอธิบาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ใช้ในการอธิบายถึงอาหารนั้นๆ" />
            </Form.Item>
            <Form.Item
                name="proceduce"
                label="วิธีการทำ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder={"วิธีการทำ \n1.\n2.\n3."} />
            </Form.Item>
            <Form.Item
                name="ingredient"
                label="ส่วนผสม"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder={"ส่วนผสม \n1.\n2.\n3."} />
            </Form.Item>
            <Form.Item
                name="calories"
                label="ปริมาณพลังงาน"
                rules={[{ required: true }, {
                    pattern: /^[0-9.]+$/,
                    message: 'ป้อนตัวเลข',
                }]}>
                <InputNumber min="0" max="10000" step="0.01" stringMode placeholder="ปริมาณพลังงาน (Kilo Calories)" />
            </Form.Item>

            <Form.Item
                name="video"
                label="ที่อยู่วิดีโอ"
                className='ml-10'
                rules={[{ required: true }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน url ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>

            <Form.Item
                name="image"
                label="รูปภาพ"
                className='ml-10'
                rules={[{ required: true }]}
            >

                <Upload
                    multiple={false}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={[]}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button className="w-full" disabled={fileList && fileList.length > 0 && true} icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList.length : 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="FoodNcds"  rules={[{ required: true, message: "คุณลืมเพิ่มคำแนะนำสำหรับโรค" }]}>
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
                                    labelCol={{ span: 0 }}
                                    label={""}
                                    rules={[{ required: true }]}
                                >
                                    {ind !== 0 && <hr />}
                                    <div className="flex gap-3 items-center  justify-center py-2">
                                    <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip><div className="text-lg"> โรคที่ {ind + 1}</div> 
                                    </div>

                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เลือกโรค"
                                    name={[field.name, 'ncdsId']}
                                    fieldKey={[field.fieldKey, 'ncdsId']}
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        {!!NCDS && NCDS.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th} ({name_en})</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="คำแนะนำ"
                                    name={[field.name, 'suggess']}
                                    fieldKey={[field.fieldKey, 'suggess']}
                                    rules={[{ required: true }]}
                                >
                                    <Radio.Group >
                                        <Radio key={true} value={true}>แนะนำให้รับประทาน</Radio>
                                        <Radio key={false} value={false}>ไม่แนะนำให้รับประทาน</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    label="คำอธิบาย"
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น สาเหตุที่สามารถทานได้ หรือ ไม่แนะนำให้รับประทาน" />
                                </Form.Item>
                                <Form.Item
                                    label="วิดีโอ"
                                    name={[field.name, 'video']}
                                    fieldKey={[field.fieldKey, 'video']}
                                    rules={[{ required: false }, {
                                        pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                        message: 'ป้อน url ให้ถูกต้อง',
                                    }]}
                                >
                                    <Input placeholder="https://youtube.com/watch?" />
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มโรคที่สามารถทานได้หรือไม่ได้</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" rules={[{ required: true, message: "คุณลืมเพิ่มแหล่งอ้างอิง" }]}>
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
                                    labelCol={{span:5}}
                                    label={<div className="flex gap-3 items-center">
                                         <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip>แหล่งอ้างอิงที่ {ind + 1}
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
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">เพิ่มข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalEdit = () => {
    const { modalEdit, setModalEdit, reload,NCDS } = useContext(Context)
    const [foodType, setFoodType] = useState(null)
    const [fileList, setFileList] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(modalEdit);
        !!modalEdit  && setFileList(modalEdit.image.map(({ id, name }) => {
            return {
                id: id,
                status: "done",
                url: `/static/${name}`,
                name: name
            }
        }))
    }, [form, modalEdit]);

    useEffect(() => {
        (async () => {
            if (modalEdit) {
                const fetchTypeFood = await FetchTypeFood()
                Array.isArray(fetchTypeFood) && setFoodType(fetchTypeFood)
            }
        })()
    }, [modalEdit])
    const onOk = async (val) => {
        if (!val.ref) {
            notification.error({ message: "กรุณาเพิ่มแหล่งอ้างอิง" })
            return
        } else if (!val.FoodNcds) {
            notification.error({ message: "กรุณาเพิ่มโรคไม่ติดต่อ" })
            return
        }
        let _tempimage = []
        
        if (val?.image?.fileList) {
            for (const i in val.image.fileList) {
                const fL = val.image.fileList[i]
                fL.response ? _tempimage.push({ name: fL.response.name }): _tempimage.push({ ...fL })

            }
        }
        else { _tempimage = val?.image }
        val["id"] = modalEdit.id
        val['image'] = _tempimage
        val["calories"] = parseFloat(val["calories"])
        const res = await fetch(`/api/getFood`, {
            method: "PATCH",
            body: JSON.stringify({ old: modalEdit, new: val })
        })
            .then(res => {
                if (res.ok) {
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    setModalEdit(false)
                    reload()
                    fetch(`/api/uploads`)
                } else {
                    notification.error({ message: `ไม่สามารถเพิ่มข้อมูลได้ ${res.json().code}` })
                }
            })
    }
    const onCancel = () => {
        setModalEdit(false)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const onReset = () => {
        setFileList(null)
    }
    return <Modal
        title={"แก้ไขข้อมูลอาหาร"}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}

        onOk={onOk}
        onCancel={onCancel}
        width="90%"
    >
        <Form
            form={form}
            // initialValues={valUser}
            labelCol={{ span: 3 }}
            onFinish={onOk}
            onReset={onReset}
            scrollToFirstError={true}
            labelWrap={true}
        // onFinishFailed={onCancel}
        >

            <Form.Item
                name="foodTypeId"
                label="ประเภท"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!foodType && foodType.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th} ({name_en})</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="name_th"
                label="ชื่ออาหารไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F- ]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่ออาหารอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z0-9- ]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="detail"
                label="คำอธิบาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ใช้ในการอธิบายถึงอาหารนั้นๆ" />
            </Form.Item>
            <Form.Item
                name="proceduce"
                label="วิธีการทำ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder={"วิธีการทำ \n1.\n2.\n3."} />
            </Form.Item>
            <Form.Item
                name="ingredient"
                label="ส่วนผสม"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder={"ส่วนผสม \n1.\n2.\n3."} />
            </Form.Item>
            <Form.Item
                name="calories"
                label="ปริมาณพลังงาน"
                rules={[{ required: true }, {
                    pattern: /^[0-9.]+$/,
                    message: 'ป้อนตัวเลข',
                }]}>
                <InputNumber min="0" max="10000" step="0.01" stringMode placeholder="ปริมาณพลังงาน (Kilo Calories)" />
            </Form.Item>

            <Form.Item
                name="video"
                label="ที่อยู่วิดีโอ"
                className='ml-10'
                rules={[{ required: true }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน url ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>

            <Form.Item
                name="image"
                label="รูปภาพ"
                className='ml-10'
                rules={[{ required: true }]}
            >

                <Upload
                    multiple={false}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={fileList}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>แก้ไขรูป ({fileList ? fileList.length : 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="FoodNcds" rules={[{ required: true, message: "คุณลืมเพิ่มคำแนะนำสำหรับโรค" }]}>
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
                                    labelCol={{ span: 0 }}
                                    label={""}
                                    rules={[{ required: true }]}
                                >
                                    {ind !== 0 && <hr />}
                                    <div className="flex gap-3 items-center  justify-center py-2">
                                        <div className="text-lg"> โรคที่ {ind + 1}</div> 
                                    </div>

                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เลือกโรค"
                                    name={[field.name, 'ncdsId']}
                                    fieldKey={[field.fieldKey, 'ncdsId']}
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        {!!NCDS && NCDS.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th} ({name_en})</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="คำแนะนำ"
                                    name={[field.name, 'suggess']}
                                    fieldKey={[field.fieldKey, 'suggess']}
                                    rules={[{ required: true }]}
                                >
                                    <Select>
                                        <Option key={true} value={true}>แนะนำให้รับประทาน</Option>
                                        <Option key={false} value={false}>ไม่แนะนำให้รับประทาน</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="คำอธิบาย"
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น สาเหตุที่สามารถทานได้ หรือ ไม่แนะนำให้รับประทาน" />
                                </Form.Item>
                                <Form.Item
                                    label="วิดีโอ"
                                    name={[field.name, 'video']}
                                    fieldKey={[field.fieldKey, 'video']}
                                    rules={[{ required: false }, {
                                        pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                        message: 'ป้อน url ให้ถูกต้อง',
                                    }]}
                                >
                                    <Input placeholder="https://youtube.com/watch?" />
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มโรคที่สามารถทานได้หรือไม่ได้</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" rules={[{ required: true, message: "คุณลืมเพิ่มแหล่งอ้างอิง" }]}>
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
                                    labelCol={{span:5}}
                                    {...field}
                                    label={<div className="flex gap-3 items-center">
                                         <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip>แหล่งอ้างอิงที่ {ind + 1}
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
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">แก้ไขข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalManageType = () => {
    const { modalAddType, setModalAddType } = useContext(Context)
    const [foodType, setType] = useState(null)
    const [foodTypeEdit, setFoodTypeEdit] = useState(null)
    const reload = async () => {
        const fetchTypeFood = await FetchTypeFood()
        Array.isArray(fetchTypeFood) && setType(fetchTypeFood)
    }
    useEffect(() => {
        reload()
    }, [])

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(foodTypeEdit);
    }, [form, modalAddType, foodTypeEdit]);

    const onSubmit = async (val) => {
        if (foodTypeEdit) {
            const send = { ...foodTypeEdit, ...val }
            const req = await fetch('/api/getTypeFood', {
                headers: { 'Content-Type': 'application/json', },
                method: "PATCH",
                body: JSON.stringify(send)
            })
            const data = await req.json()
            if (!data.message) {
                notification.success({ message: "แก้ไขข้อมูลสำเร็จ" })
                reload()
                setFoodTypeEdit(null)
            } else {
                notification.error({ message: "ไม่สามารถแก้ไขข้อมูลได้" })
            }
        } else {
            const req = await fetch('/api/getTypeFood', {
                headers: { 'Content-Type': 'application/json', },
                method: "POST",
                body: JSON.stringify(val)
            })
            const data = await req.json()
            if (!data.message) {
                notification.success({ message: "เพิ่มข้อมูลสำเร็จ" })
                reload()
            } else {
                notification.error({ message: "ไม่สามารถเพิ่มข้อมูลได้" })
            }

        }
    }
    const onFinishFailed = (e) => {
        // console.log(e)
    }
    const onCancel = () => {
        setModalAddType(false)
    }
    const showConfirmDel = async (val) => {
        confirm({
            title: `คุณต้องการจะลบประเภทอาหาร`,
            // icon: <DeleteIcon color="warning"/>,
            content: <div>
                {/* <h1>ข้อมูลผู้ใช้</h1> */}
                <p>ภาษาไทย : {val.name_th}</p>
                <p>ภาษาอังกฤษ : {val.name_en}</p>
            </div>,
            okText: "ตกลง",
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/getTypeFood", {
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
    const columns = [
        {
            title: 'ภาษาไทย',
            dataIndex: 'name_th',
            key: 'name_th',
        },
        {
            title: 'ภาษาอังกฤษ',
            dataIndex: 'name_en',
            key: 'name_en',
        },
        {
            title: 'การจัดการ',
            dataIndex: '',
            key: '',
            render: val => <div className="flex flex-wrap gap-2">
                {/* <Button type="text" className="bg-yellow-300" onClick={() => console.log(val)}>ดู</Button> */}
                <button className=" bg-yellow-200 hover:bg-yellow-300" disabled={foodTypeEdit && (foodTypeEdit?.id !== val?.id) || false} onClick={() => foodTypeEdit?.id === val?.id ? setFoodTypeEdit(null) : setFoodTypeEdit(val)}>{foodTypeEdit?.id === val?.id ? "ยกเลิก" : "แก้ไข"}</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val)}>ลบ</button>
            </div>,
        },

    ];
    return <>
        <Modal title={"จัดการประเภทอาหาร"}
            visible={modalAddType}
            okText={<>ตกลง</>}
            cancelText={<>ยกเลิก</>}
            footer={<></>}
            // onOk={onOk}
            onCancel={onCancel}
            width={640}
        >
            <Form
                form={form}
                // initialValues={{}}
                destroyOnClose={true}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onSubmit}
                onFinishFailed={onFinishFailed}>

                <Form.Item
                    name="name_th"
                    label="ชื่อภาษาไทย"
                    rules={[{ required: true }, {
                        pattern: /^[\u0E00-\u0E7F0-9 ]+$/,
                        message: 'กรอกภาษาไทย',
                    }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name_en"
                    label="ชื่อภาษาอังกฤษ"
                    rules={[{ required: true }, {
                        pattern: /^[a-zA-Z0-9- ]+$/,
                        message: 'กรอกภาษาอังกฤษ',
                    }]}>
                    <Input />
                </Form.Item>


                <div className="flex justify-end gap-2">
                    <Button htmlType="reset">ล้างค่า</Button>
                    <Button type="primary" htmlType="submit">{!!foodTypeEdit ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</Button>
                </div>
            </Form>
            <Divider />
            {!!foodType && <Table dataSource={foodType} columns={columns} />}
        </Modal>

    </>
}

const ModalView = () => {
    const { setModalView, modalView, reload } = useContext(Context)
    const onCancel = () => {
        setModalView(false)
    }
    console.log(modalView)
    if (!modalView) return null
    return <Modal title={modalView.name_th}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form labelCol={{ span: 4 }} labelAlign="left">
            <Form.Item label="หมวด"><span className='text-lg whitespace-pre-line'>{modalView.FoodType.name_th}({modalView.FoodType.name_en})</span></Form.Item>
            <Form.Item label={`รูปภาพ ${modalView.image.length} รูป`}>{modalView.image.map(({ name }) => <CusImage className="rounded-md shadow-lg" key={name} width="250px" height="150px" src={name} />)}</Form.Item>
            <Form.Item label="ชื่ออาหารภาษาไทย"><span className='text-lg whitespace-pre-line'>{modalView.name_th}</span></Form.Item>
            <Form.Item label="ชื่ออาหารภาษาอังกฤษ"><span className='text-lg whitespace-pre-line'>{modalView.name_en}</span></Form.Item>
            <Form.Item label="พลังงาน"><span className='text-lg whitespace-pre-line'>{modalView.calories} แคลอรี่</span></Form.Item>
            <Form.Item label="คำอธิบาย"><span className='text-md whitespace-pre-line'>{modalView.detail}</span></Form.Item>
            <Form.Item label="วิธีการทำ"><span className='text-md whitespace-pre-line'>{modalView.proceduce}</span></Form.Item>
            <Form.Item label="ส่วนผสม"><span className='text-md whitespace-pre-line'>{modalView.ingredient}</span></Form.Item>
            <Form.Item label="วิดีโอ"><ReactPlayer url={modalView.video} /></Form.Item>
            <Form.Item label={`โรคที่แนะนำ`}>{modalView.FoodNcds.map(({ suggess, ncds }, ind) => <>
                {suggess &&<> <span key={ncds.name_th + ind} className='text-md whitespace-pre-line text-green-700'>{ncds.name_th}({ncds.name_en})</span><br /></>}
            </>)}
            </Form.Item>
            <Form.Item label={`โรคที่ไม่แนะนำ`}>{modalView.FoodNcds.map(({ suggess, ncds }, ind) => <>
                {!suggess &&<> <span key={ncds.name_th + ind} className='text-md whitespace-pre-line text-red-700'>{ncds.name_th}({ncds.name_en})</span><br /></>}
            </>)}
            </Form.Item>
            <Form.Item label={`อ้างอิง ${modalView.ref.length}`}>{modalView.ref.map(({ url }) => <><a key={url} target="_blank"  href={url.split(",").at(-1)} className='text-md whitespace-pre-line' rel="noreferrer">{url}</a><br /></>)}</Form.Item>
        </Form>
    </Modal>

}
const showConfirmDel = async (val, reload) => {

    confirm({
        title: <>คุณต้องการจะลบอาหาร</>,
        content: <p>{val.name_th}({val.name_en})</p>,
        okText: "ตกลง",
        cancelText: "ยกเลิก",
        async onOk() {
            const res = await fetch("/api/getFood", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify(val)
            })
            if (res.status === 200) {
                notification.success({
                    message: 'ลบข้อมูลสำเร็จ',
                })
                fetch(`/api/uploads`)
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
const FetchTypeFood = async () => {
    const req = await fetch("/api/getTypeFood")
    if (req.status === 200) {
        const data = await req.json()
        return data
    }
    return null
}
const FetchNCDS = async () => {
    const req = await fetch("/api/getNCDS?select=name_th,name_en,id")
    if (req.status === 200) {
        const data = await req.json()
        return data
    }
    return null
}
