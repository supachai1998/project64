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
    const [ncds, setNcds] = useState([])
    const reload = async () => {
        setLoading(true)
        await fetch("/api/getNCDS").then(async res => {
            if (res.status === 200) {
                const data = await res.json()
                setNcds(data)
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
            <Board data={{}} />
            {/* <Spin spinning={loading}> */}
            <div className="flex justify-end mt-4 mb-2">
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
                ncds,
            }}>
                <ModalAdd />
                <ModalEdit />
                <ModalView />
                <TableForm />
            </Context.Provider>
            {/* </Spin> */}
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
            <Form.Item label={`รูปภาพ ${modalView.image.length} รูป`}>{modalView.image.map(({ name }) => <CusImage className="rounded-md shadow-lg" key={name} width="250px" height="150px" src={name} />)}</Form.Item>
            <Form.Item label="ชื่อโรคภาษาไทย"><span className='text-lg whitespace-pre-line'>{modalView.name_th}</span></Form.Item>
            <Form.Item label="ชื่อโรคภาษาอังกฤษ"><span className='text-lg whitespace-pre-line'>{modalView.name_en}</span></Form.Item>
            <Form.Item label="ความหมาย"><span className='text-md whitespace-pre-line'>{modalView.imply}</span></Form.Item>
            <Form.Item label="สาเหตุการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.cause}</span></Form.Item>
            <Form.Item label="ลดความเสี่ยงการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.reduce}</span></Form.Item>
            <Form.Item label="สัญญาณการเกิดโรค"><span className='text-md whitespace-pre-line'>{modalView.signs}</span></Form.Item>
            <Form.Item label="คำแนะนำในการปฏิบัติตัว"><span className='text-md whitespace-pre-line'>{modalView.sugess}</span></Form.Item>
            <Form.Item label="วิดีโอ"><ReactPlayer url={modalView.video} /></Form.Item>
            <Form.Item label={`อ้างอิง ${modalView.ref.length}`}>{modalView.ref.map(({ url }) => <><span key={url} className='text-md whitespace-pre-line'>{url}</span><br /></>)}</Form.Item>
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
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    setModalAdd(false)
                    fetch(`/api/uploads?name=ncds`)
                    reload()
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
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => remove(field.name)} /></Tooltip><> แหล่งอ้างอิงที่ {ind + 1}</>
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
                url: `/uploads/${name}`,
                name: name
            }
        }))
    }, [form, modalEdit]);
    // useEffect(() => {
    //     !fileList && modalEdit  && setFileList({fileList : modalEdit.image.map(({ name }, index) => { return { name: name, url: `/uploads/${name}` } })})
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
                                    label={<div className="flex gap-3 items-center">
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => remove(field.name)} /></Tooltip><> แหล่งอ้างอิงที่ {ind + 1}</>
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
    const { ncds, reload,
        modalEdit, setModalEdit,
        modalView, setModalView,
        loading } = useContext(Context)
    const columns = [
        {
            title: <Paragraph align="center" >ชื่อโรค</Paragraph>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >ความหมาย</Paragraph>,
            dataIndex: 'imply',
            key: 'imply',
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
            title: <Paragraph align="center" >จำนวนภาพ</Paragraph>,
            dataIndex: 'image',
            key: 'image',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <Paragraph align="center" >การจัดการ</Paragraph>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className="button-cus bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(ncds[index])}>ดู</button>
                <button className="button-cus bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(ncds[index])}>แก้ไข</button>
                <button className="button-cus bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(ncds[index], reload)}>ลบ</button>
            </div>,
        },

    ];


    return <div>
        <Table size='small' tableLayout='auto' dataSource={ncds} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางโรคไม่ติดต่อเรื้อรัง
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