import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Form, Input, Upload, notification, InputNumber, Tooltip, Radio } from 'antd'
import CusImage from '/components/cusImage';
import ReactPlayer from 'react-player';
import { Button_Delete } from '/ulity/button';

// Report
import { FilePdfOutlined, DownloadOutlined, UploadOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv"
import { Chart as ChartJS, ArcElement, Tooltip as Too, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment'
import 'moment/locale/th'
moment.locale('th')
ChartJS.register(ArcElement, Too, Legend);
// END Report


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
    const [store, setStore] = useState([])
    const [food, setFood] = useState()
    const [NCDS, setNCDS] = useState()
    const [type, setType] = useState()

    const componentRef = useRef();
    const inputRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const columns = [
        {
            responsive: ["md"],
            title: <div classNamme="text-center" >ประเภท</div>,
            dataIndex: 'FoodType',
            key: 'FoodType',
            render: val => <Tooltip title={val.name_th} ><div >{val.name_th}</div></Tooltip>
        },
        {
            responsive: ["md"],
            title: <div classNamme="text-center" >ชื่ออาหาร</div>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: val => <Tooltip title={val} ><div >{val}</div></Tooltip>
        },
        {
            title: <div className="text-center" >คำอธิบาย</div>,
            dataIndex: 'detail',
            key: 'detail',
            width: '30%',
            render: val => <Tooltip title={val} ><div >{val}</div></Tooltip>
        },

        {
            title: <div className="text-center" >แนะนำ</div>,
            dataIndex: 'FoodNcds',
            key: 'FoodNcds',
            render: (text, val, index) => <>{val.FoodNcds.filter((v, ind) => v.suggess).map((v, ind) => <div key={v}>{ind + 1}. {v.ncds.name_th}<br /><span className="text-xs">{v.detail}</span></div>)}</>
        },
        {
            title: <div className="text-center" >ไม่แนะนำ</div>,
            dataIndex: 'FoodNcds',
            key: 'FoodNcds',
            render: (text, val, index) => <>{val.FoodNcds.filter((v, ind) => !v.suggess).map((v, ind) => <div key={v}>{ind + 1}. {v.ncds.name_th}<br /><span className="text-xs">{v.detail}</span></div>)}</>
        },
        {
            title: <div className="text-center" >จำนวนอ้างอิง</div>,
            dataIndex: 'ref',
            key: 'ref',
            width: "5%",
            render: val => <>{val.map((v, ind) => <div key={v} className="text-left text-xs" >{ind + 1}. {v.url}</div>)}</>
        },
    ];

    const reload = async () => {
        setLoading(true)
        const fetchTypeFood = await FetchTypeFood()
        Array.isArray(fetchTypeFood) && setType(fetchTypeFood)
        await fetch("/api/getFood").then(async res => {
            if (res.status === 200) {
                const data = await res.json()
                const _ = data.map(({ id, ...rest }) => ({ id: id, key: id, ...rest }))
                setFood(_)
                setStore(_)
            }
        })
        setLoading(false)
    }
    useEffect(() => {
        (async () => {
            const fetchNCDS = await FetchNCDS()
            Array.isArray(fetchNCDS) && setNCDS(fetchNCDS)
            reload()
        })()
        // return () => setFood()
    }, [])
    // if(!food || !type) return null
    return (
        <div
            className="ease-div flex flex-col gap-4">
            <Chart type={type} food={food} />
            <div className="flex justify-center sm:justify-between mt-4">
                <div className="text-xl sm:block hidden"></div>
                <div className="grid md:grid-cols-4 grid-cols-2 sm:justify-end justify-center gap-3">
                    <Button onClick={() => { componentRef.current.style.display = "block"; handlePrint(); componentRef.current.style.display = "none"; }} type="ghost" danger><FilePdfOutlined /> PDF </Button>
                    <Button className='green-ghost-green' icon={<DownloadOutlined />}>
                        <CSVLink
                            filename={`ตารางอาหาร ${inputRef.current?.value}-${moment().format("LLLL")}.csv`}
                            data={!!food ? food.map(({ FoodType, name_th, name_en, proceduce, calories, ingredient, video, views }) => ({ FoodType: FoodType.name_th, name_th, name_en, proceduce, calories, ingredient, video, views })) : []}
                            onClick={() => notification.success({ message: "ดาวน์โหลดไฟล์" })}
                        >
                            <span className="text-green-500">CSV</span>
                        </CSVLink>
                    </Button>
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
                type, setType,
                loading,
                food, setFood, store, setStore,
                inputRef,
            }}>
                <ModalView />
                <ModalAdd />
                <ModalEdit />
                <ModalManageType />
                <TableForm />
            </Context.Provider>
            <div className='hidden' ref={componentRef}>
                <Table size='small' title={() => <span className="text-lg">อาหาร {inputRef.current?.value}</span>} tableLayout='auto' pagination={false} dataSource={food} columns={columns} footer={() => <div className="flex justify-end"><span>พิมพ์ : {moment().format("LLLL")}</span></div>} />
            </div>
        </div>
    )
}

export default Index;



const countOccurrences = (arr, val) => arr.reduce((a, v) => (v.FoodType.name_th === val ? a + 1 : a), 0);
// const countOccurrences = (arr, val) => arr.reduce((a, v) => (val.includes(v.name_th) ? a + 1 : a), 0);

const TableForm = () => {

    const { food, setFood, reload,type,
        setModalEdit,
        setModalView,
        loading, store, inputRef } = useContext(Context)
    const [selectRows, setSelectRows] = useState([])

    if (!food) return null
    const columns = [
        {

            title: <div classNamme="text-center" >ประเภท</div>,
            dataIndex: 'FoodType',
            key: 'FoodType',
            onFilter: (value, record) => record.FoodType.name_th.includes(value),
            sorter: (a, b) => a.name_th.localeCompare(b.name_th),
            filters: type.map(val => ({ text: `${val.name_th}(${countOccurrences(food, val.name_th)})`, value: val.name_th })),
            render: val => <Tooltip title={val.name_th} ><Paragraph className="mt-3" ellipsis={ellipsis}>{val.name_th}</Paragraph></Tooltip>
        },
        {
            title: <div classNamme="text-center" >ชื่ออาหาร</div>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: <div className="text-center" >คำอธิบาย</div>,
            dataIndex: 'detail',
            key: 'detail',
            width: '30%',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: <div className="text-center" >จำนวนอ้างอิง</div>,
            dataIndex: 'ref',
            key: 'ref',
            sorter: (a, b) => a.ref.length - b.ref.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            responsive: ["md"],
            title: <div className="text-center" >จำนวนคำแนะนำ</div>,
            dataIndex: 'FoodNcds',
            key: 'FoodNcds',
            filters: [{ text: 'แนะนำ', value: true }, { text: 'ไม่แนะนำ', value: false }],
            sorter: (a, b) => a.FoodNcds.length - b.FoodNcds.length,
            onFilter: (value, record) => record.FoodNcds.every(v => v.suggess === value),
            render: (text, val, index) => <Tooltip title={<div>
                {val.FoodNcds.map((val, index) => <div key={index}>{val.ncds.name_th}({val.suggess ? "แนะนำ" : "ไม่แนะนำ"})</div>)}
            </div>}><Paragraph align="center" ellipsis={ellipsis}>{text.length}</Paragraph></Tooltip>
        },
        {
            title: <div className="text-center" >การจัดการ</div>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(val)}>ดู</button>
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(val)}>แก้ไข</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val, reload)}>ลบ</button>
            </div>,
        },

    ];
    const search = () => {
        const userInput = inputRef.current.value
        const findMatchNCDS = food.filter(val => {
            return val.name_th.toLowerCase().includes(userInput.toLowerCase()) || val.name_en.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatchNCDS)
        if (!userInput) {
            setFood(store)
        }
        else if (findMatchNCDS?.length <= 0) {
            setFood(store)
            notification.error({ message: "ไม่พบข้อมูล" })
        }
        else setFood(findMatchNCDS)
    }
    const showConfirmDelRows = async () => {
        console.log("delete", selectRows)
        if (selectRows.length <= 0) {
            notification.error({ message: "ไม่พบข้อมูลที่เลือก" })
            return
        }
        const userCon = await new Promise(async (resolve, reject) => {
            let id = []
            for (const rows of selectRows) {
                const a = await new Promise((res, rej) => {
                    confirm({
                        title: `คุณต้องการจะลบอาหาร`,
                        content: <div>
                            <p>{rows.name_th}({rows.name_en})</p>
                            {/* <p>คำอธิบาย : {rows.imply}</p> */}
                        </div>,
                        okText: "ตกลง",
                        cancelText: "ยกเลิก",
                        async onOk() { res(rows.id) },
                        onCancel() { rej(); },
                    })
                })
                id.push(a)
            }
            console.log("delete", id)
            const res = await fetch("/api/getFood", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify({ id: id })
            })
            if (res.status === 200) {
                notification.success({
                    message: 'ลบข้อมูลสำเร็จ',
                })
                setSelectRows([])
                await reload()
            } else if (res.status === 400) {
                notification.error({
                    message: 'ไม่สามารถลบข้อมูลได้',
                    description: 'ข้อมูลไม่ถูกต้อง ',
                })
            } else {
                notification.error({
                    message: 'ไม่สามารถลบข้อมูลได้',
                    description: 'ไม่สามารถติดต่อ server ',
                })
            }
            resolve();
        })

    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRows(selectedRows)
        },
    };


    return <div>
        <Table size='small' tableLayout='auto' dataSource={food} columns={columns}
            rowSelection={{ ...rowSelection }}
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '50', '100']}}
            title={() => <div className="flex justify-between items-center gap-2">
                <div className='flex items-center gap-2'>
                    ตารางอาหาร
                    <Tooltip title={"ดึงข้อมูลใหม่"}>
                        <button type="button" onClick={() => reload()} ><svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></Tooltip>
                </div>
                <div className='flex items-center gap-2'>
                    {selectRows?.length > 0 && <div className='flex gap-2 text-md'>
                        <Button_Delete className="text-gray-100" fx={() => showConfirmDelRows()} title={"ลบข้อมูลที่เลือก"} ></Button_Delete>
                    </div>}
                    <Tooltip title={"ค้นหาชื่ออาหาร"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setFood(store)} placeholder="ชื่ออาหาร" className='text-black rounded-md' /></Tooltip>
                    <Tooltip title={"ค้นหา"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
            </div>}
        />
    </div>
}
const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload, NCDS,type } = useContext(Context)
    const [fileList, setFileList] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);

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
                    form.resetFields();
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    setModalAdd(false)
                    fetch(`/api/uploads?name=food`)
                    form.resetFields()
                    setFileList([])
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
                    {!!type && type.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="name_th"
                label="ชื่ออาหารไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F0-9- ]+$/,
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
                className='sm:ml-10'
                rules={[{ required: true }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน url ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>

            <Form.Item
                name="image"
                label="รูปภาพ"
                className='sm:ml-10'
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
                    <Button className="w-full" icon={<UploadOutlined />}> {fileList?.length > 0 ? "เปลี่ยนรูป" : "เพิ่มรูป"}</Button>
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
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete className="text-gray-800" fx={() => remove(field.name)} /></Tooltip><div className="text-lg"> โรคที่ {ind + 1}</div>
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
                                    labelCol={{ span: 5 }}
                                    label={<div className="flex gap-3 items-center">
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete className="text-gray-800" fx={() => remove(field.name)} /></Tooltip>แหล่งอ้างอิงที่ {ind + 1}
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
    const { modalEdit, setModalEdit, reload, NCDS,type } = useContext(Context)
    const [fileList, setFileList] = useState()
    const [form] = Form.useForm();

    useEffect(() => {
        if (!!modalEdit) {
            const image = modalEdit.image.map(({ id, name }) => {
                return {
                    id: id,
                    status: "done",
                    url: `/static/${name}`,
                    name: name
                  }
            })
            form.setFieldsValue({...modalEdit,image});
            setFileList(image)
        }
        return () => {
            form.resetFields()
            setFileList([])
        }
    }, [form, modalEdit]);


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
                fL.response ? _tempimage.push({ name: fL.response.name }) : _tempimage.push({ ...fL })

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
                    notification.success({ message: "แก้ไขข้อมูลเรียบร้อย" })
                    setModalEdit(false)
                    reload()
                    fetch(`/api/uploads`)
                } else {
                    notification.error({ message: `ไม่สามารถแก้ไขข้อมูลได้ ${res.json().code}` })
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
    if (!modalEdit) return null
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
                    {!!type && type.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th} ({name_en})</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="name_th"
                label="ชื่ออาหารไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F0-9- ]+$/,
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
                className='sm:ml-10'
                rules={[{ required: true }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน url ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>
            {console.log(form.getFieldValue('image'))}
            <Form.Item
                name="image"
                label="รูปภาพ"
                className='sm:ml-10'
                rules={[{ required: true }]}
            >

                <Upload
                    multiple={false}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={!!form.getFieldValue('image') &&
                        !form.getFieldValue('image')?.fileList ? form.getFieldValue('image') :
                        form.getFieldValue('image')?.fileList?.length > 0 ? form.getFieldValue('image')?.fileList : []}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>{!!form.getFieldValue('image') &&
                        !form.getFieldValue('image')?.fileList ? "เปลี่ยนรูป" :
                        form.getFieldValue('image')?.fileList?.length > 0 ? "เปลี่ยนรูป" : "เพิ่มรูป"}</Button>
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
                                key={'food'+field.key+ind}
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
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete className="text-gray-800" fx={() => remove(field.name)} /></Tooltip><div className="text-lg"> โรคที่ {ind + 1}</div>
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
                                    labelCol={{ span: 5 }}
                                    {...field}
                                    label={<div className="flex gap-3 items-center">
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><Button_Delete className="text-gray-800" fx={() => remove(field.name)} /></Tooltip>แหล่งอ้างอิงที่ {ind + 1}
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
                <Button className="edit_button" type="primary" htmlType="submit">แก้ไขข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalManageType = () => {
    const { modalAddType, setModalAddType, type, setType, reload } = useContext(Context)
    const [foodTypeEdit, setFoodTypeEdit] = useState(null)


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
                form.resetFields();
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
                form.resetFields();
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
                    setFoodTypeEdit(null)
                    form.resetFields()
                    await reload()
                } else if (res.status === 400) {
                    const { error } = await res.json()
                    if (error.includes("violate the required relation ")) {
                        notification.error({
                            message: "ไม่สามารถลบข้อมูลได้",
                            description: 'มีข้อมูลอาหารที่เกี่ยวข้องกับประเภทอาหารนี้',
                        })
                    }
                } else {
                    notification.error({
                        message: 'ไม่สามารถลบข้อมูลได้',
                        description: 'ไม่ทราบข้อผิดพลาด',
                    })
                }
            },
            onCancel() { },
        });
    }
    const handleCancle = () => {
        form.resetFields();
        setFoodTypeEdit(null)
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
                <button className={foodTypeEdit ? (foodTypeEdit?.id === val?.id) && "bg-gray-200" : " bg-yellow-200 hover:bg-yellow-300"} disabled={foodTypeEdit && (foodTypeEdit?.id !== val?.id) || false} onClick={() => foodTypeEdit?.id === val?.id ? handleCancle() : setFoodTypeEdit(val)}>{foodTypeEdit?.id === val?.id ? "ยกเลิก" : "แก้ไข"}</button>
                <button className={foodTypeEdit ? (foodTypeEdit?.id === val?.id) && "bg-red-500" : " bg-red-300 hover:bg-red-400"} disabled={foodTypeEdit && (foodTypeEdit?.id !== val?.id) || false} onClick={() => showConfirmDel(val)}>ลบ</button>
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
                labelCol={{ span: 8 }}
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
                    <Button type="primary" className={`${!!foodTypeEdit && "edit_button"}`} htmlType="submit">{!!foodTypeEdit ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</Button>
                </div>
            </Form>
            <Divider />
            {!!type && <Table dataSource={type} columns={columns} 
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '50', '100']}}
            />}
        </Modal>

    </>
}

const ModalView = () => {
    const { setModalView, modalView, reload } = useContext(Context)
    const onCancel = () => {
        setModalView(false)
    }
    if (!modalView) return null
    return <Modal title={modalView?.name_th}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form labelCol={{ span: 4 }} labelAlign="left">
            <Form.Item label="หมวด"><span className='text-lg whitespace-pre-line'>{modalView?.FoodType.name_th}({modalView?.FoodType.name_en})</span></Form.Item>
            <Form.Item label={`รูปภาพ ${modalView?.image.length} รูป`}>{modalView?.image.map(({ name }) => <CusImage className="rounded-md shadow-lg" key={name} width="250px" height="150px" src={name} />)}</Form.Item>
            <Form.Item label="ชื่ออาหารภาษาไทย"><span className='text-lg whitespace-pre-line'>{modalView?.name_th}</span></Form.Item>
            <Form.Item label="ชื่ออาหารภาษาอังกฤษ"><span className='text-lg whitespace-pre-line'>{modalView?.name_en}</span></Form.Item>
            <Form.Item label="พลังงาน"><span className='text-lg whitespace-pre-line'>{modalView?.calories} แคลอรี่</span></Form.Item>
            <Form.Item label="คำอธิบาย"><span className='text-md whitespace-pre-line'>{modalView?.detail}</span></Form.Item>
            <Form.Item label="วิธีการทำ"><span className='text-md whitespace-pre-line'>{modalView?.proceduce}</span></Form.Item>
            <Form.Item label="ส่วนผสม"><span className='text-md whitespace-pre-line'>{modalView?.ingredient}</span></Form.Item>
            <Form.Item label="วิดีโอ"><div className="w-64 h-64 sm:w-96 sm:h-96"><ReactPlayer width="100%" url={modalView?.video} /></div></Form.Item>
            <Form.Item label={`โรคที่แนะนำ`}>{modalView?.FoodNcds.map(({ suggess, ncds, detail }, ind) => <>
                {suggess && <> <span key={ncds.name_th + ind} className='text-md whitespace-pre-line text-green-700'>{ncds.name_th}({ncds.name_en})</span><br /><span className='text-md '>{detail}</span><br /></>}
            </>)}
            </Form.Item>
            <Form.Item label={`โรคที่ไม่แนะนำ`}>{modalView?.FoodNcds.map(({ suggess, ncds, detail }, ind) => <>
                {!suggess && <> <span key={ncds.name_th + ind} className='text-md whitespace-pre-line text-red-700'>{ncds.name_th}({ncds.name_en})</span><br /><span className='text-md '>{detail}</span><br /></>}
            </>)}
            </Form.Item>
            <Form.Item label={`อ้างอิง ${modalView?.ref.length}`}>{modalView?.ref.map(({ url }) => <><a key={url} target="_blank" href={url.split(",").at(-1)} className='text-md whitespace-pre-line' rel="noreferrer">{url}</a><br /></>)}</Form.Item>
        </Form>
    </Modal>

}
const showConfirmDel = async (val, reload) => {

    confirm({
        title: <>คุณต้องการจะลบอาหาร</>,
        content: <p>{val.name_th}({val.name_en})</p>,
        okText: "ตกลง",
        cancelText: "ยกเลิก",
        okType: "danger",
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

const Chart = ({ food, type }) => {
    const [color, setColor] = useState()
    const [TYPE, setTYPE] = useState([])
    const [TYPE_SUGGESS, setTYPE_SUGGESS] = useState([])
    const [TYPE_NOT_SUGGESS, setTYPE_NOT_SUGGESS] = useState([])
    useEffect(() => {
        if (type && !color) setColor(type.map(v => randomRGB()))
        const getNameType = type?.map(({ name_th }) => name_th)
        const count_type = type?.reduce((acc, val) => {
            const count_food = food?.reduce((acc, val_food) => val.name_th === val_food.FoodType.name_th ? acc + 1 : acc, 0)
            acc.push(count_food)
            return acc
        }, [])
        const _TYPE = {
            labels: getNameType,
            datasets: [{
                data: count_type,
                backgroundColor: color,
                borderWidth: 0,
            }],
        }
        setTYPE(_TYPE)

        const countTypeFoodSuggess = type?.reduce((acc, val) => {
            const count_food = food?.reduce((acc, val_food) => val.name_th === val_food.FoodType.name_th && val_food.FoodNcds.some(({ suggess }) => suggess) ? acc + 1 : acc, 0)
            acc.push(count_food)
            return acc
        }, [])
        const countTypeFoodNotSuggess = type?.reduce((acc, val) => {
            const count_food = food?.reduce((acc, val_food) => val.name_th === val_food.FoodType.name_th && val_food.FoodNcds.some(({ suggess }) => !suggess) ? acc + 1 : acc, 0)
            acc.push(count_food)
            return acc
        }, [])

        // console.log(countTypeFoodSuggess,countTypeFoodNotSuggess)

        const _suggess = {
            labels: getNameType,
            datasets: [{
                data: countTypeFoodSuggess,
                backgroundColor: color,
                borderWidth: 0,
            }],
        }
        const _not_suggess = {
            labels: getNameType,
            datasets: [{
                data: countTypeFoodNotSuggess,
                backgroundColor: color,
                borderWidth: 0,
            }],
        }
        setTYPE_SUGGESS(_suggess)
        setTYPE_NOT_SUGGESS(_not_suggess)
        // console.log(type,food)
    }, [type, food])
    if (!food || !type) return <div className="flex gap-3 flex-wrap justify-center bg-gray-900 py-20 mb-5 rounded-sm">
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center" />
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center" />
    </div>
    // console.log(food,type)

    // const ncds_data = data.ncds.map(({ name, count }) => ({ name, value: count }))
    return (<div className="flex gap-3 flex-wrap justify-center bg-gray-900 py-20 mb-5 rounded-sm">
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">ประเภท</p><Doughnut data={TYPE} /></div>
        <div className="w-72 h-72 bg-green-100 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">แนะนำ</p><Doughnut data={TYPE_SUGGESS} /></div>
        <div className="w-72 h-72 bg-red-100 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">ไม่แนะนำ</p><Doughnut data={TYPE_NOT_SUGGESS} /></div>
    </div>)
}
const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;