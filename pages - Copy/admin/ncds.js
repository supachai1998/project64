import { useState, useEffect } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Board from '../../components/admin/DisplayBoard';
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
    const [ncds, setNcds] = useState([])
    const reload = async () => {
        await fetch("/api/getNCDS").then(async res => {
            if (res.status === 200) {
                const data = await res.json()
                console.log(data)
                setNcds(data)
            }
        })

    }
    useEffect(() => {
        reload()
        return () => { setNcds() }
    }, [modalAdd, modalEdit, modalView])
    return (
        <div
            className="ease-div flex flex-col gap-4">
            <Board data={{}} />
            <div className="flex justify-between mt-4">
                <div className="text-xl">ตารางโรคไม่ติดต่อเรื้อรัง</div>
                <Button onClick={() => setModalAdd(true)}>เพิ่มข้อมูล</Button>
            </div>
            <ModalAdd setModalAdd={setModalAdd} modalAdd={modalAdd} reload={reload} />
            {/* <ModalEdit setModalEdit={setModalEdit} modalEdit={modalEdit} reload={reload} />
            <ModalView setModalView={setModalView} modalView={modalView} reload={reload} /> */}
            {/* <TableForm blogs={blogs} reload={reload} modalEdit={modalEdit} setModalEdit={setModalEdit} modalView={modalView} setModalView={setModalView} /> */}
        </div>
    )
}
const ModalAdd = ({ modalAdd, setModalAdd, reload }) => {
    const [fileList, setFileList] = useState(null)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);
    useEffect(() => {

    }, []);

    const onOk = () => {
        setModalAdd(false)
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        val['image'] = val?.image?.fileList.map(({name})=>name) //เอาแค่ชื่อไฟล์
        console.log(val)
    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileList(null)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    return <Modal title={"เพิ่มข้อมูลโรคไม่ติดต่อเรื้อรัง"}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%"
        // footer={<></>}
        >
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            onReset={onReset}>
            <Form.Item
                name="name_th"
                label="ชื่อโรคภาษาไทย"
                rules={[{ required: true }, {
                    pattern: /^[\u0E00-\u0E7F ]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ชื่อโรคภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่อโรคภาษาอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z ]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ชื่อโรคภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="บทย่อ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="บทย่อ" />
            </Form.Item>
            <Form.Item
                name="mean"
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
                                    label={`แหล่งอ้างอิงที่ ${ind + 1}`}
                                    name={[field.name, 'url']}
                                    fieldKey={[field.fieldKey, 'url']}
                                    rules={[{ required: true }]}
                                >
                                    <div className="flex gap-3 items-center">
                                        <Input placeholder="แหล่งอ้างอิง" />
                                        <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined onClick={() => remove(field.name)} /></Tooltip>
                                    </div>
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