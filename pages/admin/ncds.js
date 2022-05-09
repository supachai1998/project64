import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Spin, Form, Input, Upload, Collapse, notification, InputNumber, Space, Tooltip } from 'antd'
import Board from '../../components/admin/DisplayBoard';
import CusImage from '/components/cusImage';
import ReactPlayer from 'react-player';
import { Button_Delete } from '/ulity/button'
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
const { Panel } = Collapse;
const Context = createContext()
export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [loading, setLoading] = useState(false)
    const [ncds, setNcds] = useState([])
    const [store, setStore] = useState([])

    const componentRef = useRef();
    const inputRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const columns = [
        {
            title: < >ชื่อโรคภาษาไทย</>,
            dataIndex: 'name_th',
            key: 'name_th',
            width: "5%",
            render: (text, val, index) => <div className="h-76 overflow-hidden">{val.name_th}</div>
        },
        {
            title: < >ชื่อโรคภาษาอังกฤษ</>,
            dataIndex: 'name_en',
            key: 'name_en',
            width: "5%",
            render: (text, val, index) => <div className="h-76 overflow-hidden">{val.name_en}</div>
        },
        {
            title: < >ความหมาย</>,
            dataIndex: 'imply',
            key: 'imply',
            width: '10%',
            render: val => <div className="h-76 overflow-hidden">{val}</div>
        },
        {
            title: < >สาเหตุการเกิดโรค</>,
            dataIndex: 'cause',
            key: 'cause',
            render: val => <div className="h-76 overflow-hidden">{val}</div>
        },
        {
            title: < >ลดความเสี่ยงการเกิดโรค</>,
            dataIndex: 'reduce',
            key: 'reduce',
            render: val => <div className="h-76 overflow-hidden">{val}</div>
        },
        {
            title: < >สัญญาณการเกิดโรค</>,
            dataIndex: 'signs',
            key: 'signs',
            render: val => <div className="h-76 overflow-hidden">{val}</div>
        },
        {
            title: < >คำแนะนำในการปฏิบัติตัว</>,
            dataIndex: 'sugess',
            key: 'sugess',
            render: val => <div className="h-76 overflow-hidden">{val}</div>
        },
        {
            title: < >แหล่งอ้างอิง</>,
            dataIndex: 'ref',
            key: 'ref',
            render: val => <ul >{val.map(v => <li key={v.url} >{(v.url).match(/(?:[\w-]+\.)+[\w-]+/)}</li>)}</ul>
        },
        {
            title: < >จำนวนภาพ</>,
            dataIndex: 'image',
            key: 'image',
            render: val => <div >{val.length}</div>
        },

    ];


    const reload = async () => {
        setLoading(true)
        await fetch("/api/getNCDS").then(async res => {
            if (res.status === 200) {
                const data = await res.json()
                const _ = data.map(({ id, ...rest }) => ({ id: id, key: id, ...rest }))
                setNcds(_)
                setStore(_)
            }
        })
        setLoading(false)
    }
    useEffect(() => {
        reload()
        return () => { setNcds() }
    }, [])
    return (
        <div
            className="ease-div flex flex-col gap-4">
            {/* <Spin spinning={loading}> */}
            <div className="flex justify-end mt-4 mb-2 gap-3">
                <Button onClick={() => { componentRef.current.style.display = "block"; handlePrint(); componentRef.current.style.display = "none"; }} type="ghost" danger><FilePdfOutlined /> PDF </Button>
                <Button className='green-ghost-green' icon={<DownloadOutlined />}>
                    <CSVLink
                        filename={`ตารางอาหาร ${inputRef.current?.value}-${moment().format("LLLL")}.csv`}
                        data={!!ncds ? ncds.map(({ name_th, name_en, imply, video, cause, reduce, signs, sugess, views, ref }) => ({ name_th, name_en, imply, video, cause, reduce, signs, sugess, views, ref: ref.map(v => v.url) })) : []}
                        onClick={() => notification.success({ message: "ดาวน์โหลดไฟล์" })}
                    >
                        <span className="text-green-500">CSV</span>
                    </CSVLink>
                </Button>
                <Button onClick={() => setModalAdd(true)}>เพิ่มข้อมูล</Button>
            </div>
            <Context.Provider value={{
                reload,
                modalAdd,
                modalEdit,
                modalView,
                setModalAdd,
                setModalEdit,
                setModalView,
                loading,
                ncds, setNcds,
                store, setStore,
                inputRef
            }}>
                <ModalAdd />
                <ModalEdit />
                <ModalView />
                <TableForm />
            </Context.Provider>
            <div className='hidden' ref={componentRef}>
                <Table size='small' title={() => <span className="text-lg">โรคไม่ติดต่อ {inputRef.current?.value}</span>} tableLayout='auto' pagination={false} dataSource={ncds} columns={columns} footer={() => <div className="flex justify-end"><span>พิมพ์ : {moment().format("LLLL")}</span></div>} />
            </div>
        </div>
    )
}
const ModalView = () => {
    const { setModalView, modalView, reload } = useContext(Context)
    const onCancel = () => {
        setModalView(false)
    }
    if (!modalView) return null
    return <Modal title={modalView.name_th}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form labelCol={{ span: 4 }}>
            <Form.Item label={`รูปภาพ ${modalView.image.length} รูป`}>{modalView.image.map(({ name }) => <CusImage className="rounded-md shadow-lg sm:mx-3 " key={name} width="250px" height="150px" src={name} />)}</Form.Item>
            <Form.Item label="ชื่อโรคภาษาไทย"><span className='text-lg whitespace-pre-line'>{modalView.name_th}</span></Form.Item>
            <Form.Item label="ชื่อโรคภาษาอังกฤษ"><span className='text-lg whitespace-pre-line'>{modalView.name_en}</span></Form.Item>
            <Form.Item label="ความหมาย"><span className='text-md whitespace-pre-line'>{modalView.imply}</span></Form.Item>
            <Form.Item label="สาเหตุการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.cause}</span></Form.Item>
            <Form.Item label="ลดความเสี่ยงการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.reduce}</span></Form.Item>
            <Form.Item label="สัญญาณการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.signs}</span></Form.Item>
            <Form.Item label="คำแนะนำในการปฏิบัติตัว"><span className='text-md whitespace-pre-line'>{modalView.sugess}</span></Form.Item>
            <Form.Item label="วิดีโอ">{modalView?.video ? <div className="w-64 h-64 sm:w-96 sm:h-96"><ReactPlayer url={modalView.video} width="100%" height="100%" /> </div>: "ไม่พบวิดีโอ"}</Form.Item>
            <Form.Item label={`อ้างอิง ${modalView.ref.length}`}>{modalView.ref.map(({ url }) => <><a key={url} target="_blank" href={url.split(",").at(-1)} className='text-md whitespace-pre-line' rel="noreferrer">{url}</a><br /></>)}</Form.Item>
        </Form>
    </Modal>

}

const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload } = useContext(Context)
    const [fileList, setFileList] = useState(null)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);

    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        if (!val.ref) {
            notification.error({ message: "กรุณาเพิ่มแหล่งอ้างอิง" })
            return
        }
        const _tempimage = val?.image?.fileList.map(({ response }) => response.name) //เอาแค่ชื่อไฟล์
        const image = { create: _tempimage.map(val => { return { name: val } }) }
        val['image'] = image
        const ref = { create: val?.ref.map(({ url }) => { return { url: url } }) }
        val['ref'] = ref
        console.log(val)
        const res = await fetch(`/api/getNCDS`, {
            method: "POST",
            body: JSON.stringify(val)
        })
            .then(res => {
                if (res.ok) {
                    form.resetFields();
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    setModalAdd(false)
                    fetch(`/api/uploads?name=ncds`)
                    reload()
                    form.resetFields()
                    setFileList([])
                } else {
                    notification.error({ message: `ไม่สามารถเพิ่มข้อมูลได้ ${res.json().code}` })
                }
            })


    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log(newFileList)
    }
    return <Modal title={"เพิ่มข้อมูลโรคไม่ติดต่อเรื้อรัง"}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onSubmit}
        onCancel={onCancel}
        width="90%"
        footer={<></>}>
        <Form
            form={form}
            scrollToFirstError={true}
            labelWrap={true}
            // initialValues={{}}
            labelCol={{ span: 4 }}
            // wrapperCol={{ span: 18 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            onReset={onReset}>
            <Form.Item
                name="name_th"
                label="ชื่อโรคภาษาไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F0-9 ]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ชื่อโรคภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่อโรคภาษาอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z0-9 ]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ชื่อโรคภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="ความหมาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ความหมาย" />
            </Form.Item>
            <Form.Item
                name="cause"
                label="สาเหตุการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="สาเหตุการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="reduce"
                label="ลดความเสี่ยงการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ลดความเสี่ยงการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="signs"
                label="สัญญาณการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="สัญญาณการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="sugess"
                label="คำแนะนำในการปฏิบัติตัว"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำแนะนำในการปฏิบัติตัว" />
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ"
                rules={[{ required: false }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน ที่อยู่(url) ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://www.youtube.com/watch?v=" />
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
                    <Button disable={fileList && fileList?.length >= 5 && true} className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/5)</Button>
                </Upload>
            </Form.Item>
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
                                        <Tooltip title={"ลบแหล่งอ้างอิงที่ " + (ind + 1)}><Button_Delete className="text-gray-800" fx={() => remove(field.name)} title={`แหล่งอ้างอิงที่ ${(ind + 1)}`} /></Tooltip>
                                    </div>}
                                    name={[field.name, 'url']}
                                    fieldKey={[field.fieldKey, 'url']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="แหล่งอ้างอิง" />

                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
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
    const { setModalEdit, modalEdit, reload } = useContext(Context);
    const [fileList, setFileList] = useState()
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue(modalEdit);
        !!modalEdit && setFileList(modalEdit.image.map(({ id, name }) => {
            return {
                id: id,
                status: "done",
                url: `/static/${name}`,
                name: name
            }
        }))
        return () => {
            form.resetFields()
            setFileList([])
        }
    }, [form, modalEdit]);
    // useEffect(() => {
    //     !fileList && modalEdit  && setFileList({fileList : modalEdit.image.map(({ name }, index) => { return { name: name, url: `/static/${name}` } })})
    // }, [fileList, modalEdit]);

    const onCancel = () => {
        setModalEdit(false)
    }

    const onSubmit = async (val) => {
        console.log(val?.image?.fileList)
        let _tempimage = []
        if (val?.image?.fileList) {
            for (const i in val.image.fileList) {
                const fL = val.image.fileList[i]
                if (fL.response) {
                    _tempimage.push({ name: fL.response.name })
                } else {
                    _tempimage.push({ ...fL })
                }
            }
        }
        else { _tempimage = val?.image }
        val["id"] = modalEdit.id
        val['image'] = _tempimage
        console.log(val)
        // const ref = { create: val?.ref.map(({ url }) => { return { url: url } }) }
        // val['ref'] = ref
        // console.log(val)
        const res = await fetch(`/api/getNCDS`, {
            headers: { 'Content-Type': 'application/json', },
            method: "PATCH",
            body: JSON.stringify({ old: modalEdit, new: val })
        })
            .then(res => {
                if (res.ok) {
                    notification.success({ message: "แก้ไขข้อมูลเรียบร้อย" })
                    fetch(`/api/uploads?name=ncds`)
                    setModalEdit(false)
                    reload()
                }
            })
            .catch(err => notification.error({ message: "ไม่สามารถแก้ไขข้อมูลได้", description: err.message }))

    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log(newFileList)
    }
    if (!modalEdit) return null
    return <Modal title={"แก้ไขข้อมูลโรคไม่ติดต่อเรื้อรัง"}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form
            form={form}
            scrollToFirstError={true}
            labelWrap={true}
            initialValues={{}}
            labelCol={{ span: 4 }}
            // wrapperCol={{ span: 18 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            onReset={onReset}>
            <Form.Item
                name="name_th"
                label="ชื่อโรคภาษาไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F0-9 ]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ชื่อโรคภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่อโรคภาษาอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z0-9 ]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ชื่อโรคภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="ความหมาย"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ความหมาย" />
            </Form.Item>
            <Form.Item
                name="cause"
                label="สาเหตุการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="สาเหตุการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="reduce"
                label="ลดความเสี่ยงการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ลดความเสี่ยงการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="signs"
                label="สัญญาณการเกิดโรค"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="สัญญาณการเกิดโรค" />
            </Form.Item>
            <Form.Item
                name="sugess"
                label="คำแนะนำในการปฏิบัติตัว"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำแนะนำในการปฏิบัติตัว" />
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
                    <Button disable={fileList && fileList?.length >= 5 && true} className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/5)</Button>
                </Upload>
            </Form.Item>
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
                                    label={<div className="flex gap-3 items-center ">
                                        <Button_Delete className="text-gray-800" fx={() => remove(field.name)} title={`แหล่งอ้างอิงที่ ${(ind + 1)}`} />
                                    </div>}
                                    name={[field.name, 'url']}
                                    fieldKey={[field.fieldKey, 'url']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="แหล่งอ้างอิง" />
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
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
                <Button type="primary" htmlType="submit">แก้ไข</Button>
            </div>
        </Form>
    </Modal>
}

const showConfirmDel = async (val, reload) => {

    confirm({
        title: <>คุณต้องการจะลบบทความ</>,
        content: <p>{val.name_th}({val.name_en})</p>,
        okText: "ตกลง",
        cancelText: "ยกเลิก",
        okType: "danger",
        async onOk() {
            const res = await fetch("/api/getNCDS", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify(val)
            })
            if (res.status === 200) {
                notification.success({
                    message: 'ลบข้อมูลสำเร็จ',
                })
                fetch(`/api/uploads?name=ncds`)
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



const TableForm = () => {

    const { ncds, setNcds, reload,
        modalEdit, setModalEdit,
        modalView, setModalView,
        store,
        loading,
        inputRef } = useContext(Context)
    const [selectRows, setSelectRows] = useState([])
    const columns = [
        {
            title: <Paragraph className='mt-3' align="center" >ชื่อโรค</Paragraph>,
            dataIndex: 'name_th',
            key: 'name_th',
            width: [{sm:"40%"},{md:"30%"},{lg:"20%"}],
            render: (text, val, index) => <Tooltip title={val.name_th} ><Paragraph className='mt-3' ellipsis={ellipsis}>{val.name_th}({val.name_en})</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: <Paragraph className='mt-3' align="center" >ความหมาย</Paragraph>,
            dataIndex: 'imply',
            key: 'imply',
            width: '30%',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: <Paragraph className='mt-3' align="center" >จำนวนอ้างอิง</Paragraph>,
            dataIndex: 'ref',
            key: 'ref',
            sorter: (a, b) => a.ref.length - b.ref.length,
            render: val => <Paragraph className='my-auto' align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            responsive: ["md"],
            title: <Paragraph className='mt-3' align="center" >จำนวนภาพ</Paragraph>,
            dataIndex: 'image',
            key: 'image',
            sorter: (a, b) => a.image.length - b.image.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <Paragraph className='mt-3' align="center" >การจัดการ</Paragraph>,
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
        const findMatchNCDS = ncds.filter(val => {
            return val.name_th.toLowerCase().includes(userInput.toLowerCase()) || val.name_en.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatchNCDS)
        if (!userInput) {
            setNcds(store)
        }
        else if (findMatchNCDS?.length <= 0) {
            setNcds(store)
            notification.error({ message: "ไม่พบข้อมูล" })
        }
        else setNcds(findMatchNCDS)
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
                        title: `คุณต้องการจะลบบทความ`,
                        content: <div>
                            <p>{rows.name_th}({rows.name_en})</p>
                            <p>คำอธิบาย : {rows.imply}</p>
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
            const res = await fetch("/api/getNCDS", {
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
        <Table size='small' tableLayout='auto' dataSource={ncds} columns={columns}
            rowSelection={{ ...rowSelection }}
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '50', '100']}}
            title={() => <div className="flex justify-between items-center gap-2">
                <div className='flex items-center gap-2'>
                    ตารางโรคไม่ติดต่อเรื้อรัง
                    <Tooltip title={"ดึงข้อมูลใหม่"}>
                        <button type="button" onClick={() => reload()} ><svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></Tooltip>
                </div>
                <div className='flex items-center gap-2'>
                    {selectRows?.length > 0 && <div className='flex gap-2 text-md'>
                        <Button_Delete className="text-gray-200" fx={() => showConfirmDelRows()} title={"ลบข้อมูลที่เลือก"} ></Button_Delete>
                    </div>}
                    <Tooltip title={"ค้นหาชื่อโรค"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setNcds(store)} placeholder="ชื่อโรค" className='text-black rounded-md' /></Tooltip>
                    <Tooltip title={"ค้นหา"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
            </div>}
        />
    </div>
}