import { useState, useEffect } from 'react';
import { Button, Table, Divider, Select, Modal, Form, Input, Upload, notification, InputNumber } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const { TextArea } = Input;
// import ImgCrop from 'antd-img-crop';
const { Option } = Select
function Index() {
    const [modalAddFood, setModalAddFood] = useState(false)
    const [modalAddType, setModalAddType] = useState(false)

    return (
        <div
            className="ease-div flex flex-col gap-4">
            <Board />
            <div className="flex justify-between mt-4">
                <div className="text-xl">ตารางอาหาร</div>
                <div className="flex gap-3">
                    <Button onClick={() => setModalAddType(true)}>จัดการประเภทอาหาร</Button>
                    <Button onClick={() => setModalAddFood(true)}>เพิ่มข้อมูลอาหาร</Button>
                </div>
            </div>
            <ModalAddFood setModalAddFood={setModalAddFood} modalAddFood={modalAddFood} />
            <ModalManageType setModalAddType={setModalAddType} modalAddType={modalAddType} />
            <CusTable />
        </div>
    )
}

export default Index;

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

const CusTable = () => {

    return <div>
        <Table />
    </div>
}

const ModalAddFood = ({ modalAddFood, setModalAddFood }) => {
    const [foodType, setFoodType] = useState(null)
    const [fileList, setFileList] = useState([{
        // "name": "xxx.png",
        // "status": "done",
        // "url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        // "thumbUrl": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    }])
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue();
    }, [form, foodType]);

    useEffect(() => {
        (async () => {
            if (modalAddFood) {
                const fetchTypeFood = await FetchTypeFood()
                Array.isArray(fetchTypeFood) && setFoodType(fetchTypeFood)
            }
        })()
    }, [modalAddFood])
    const onOk = () => {
        setModalAddFood(false)
    }
    const onCancel = () => {
        setModalAddFood(false)
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        console.log(fileList)
    }
    const onReset=()=>{
        setFileList(null)
    }
    return <Modal title={"เพิ่มข้อมูลอาหาร"}
        visible={modalAddFood}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}
        // onOk={onOk}
        onCancel={onCancel}
        width={1000}>
        <Form
            form={form}
            destroyOnClose={true}
            // initialValues={valUser}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            onFinish={onOk}
            onReset={onReset}
        // onFinishFailed={onCancel}
        >

            <Form.Item
                name="TypeFood"
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
                    pattern: /^[\u0E00-\u0E7F]+$/,
                    message: 'กรอกภาษาไทย',
                }]}>
                <Input placeholder="ภาษาไทย" />
            </Form.Item>
            <Form.Item
                name="name_en"
                label="ชื่ออาหารอังกฤษ"
                rules={[{ required: true }, {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: 'กรอกภาษาอังกฤษ',
                }]}>
                <Input placeholder="ภาษาอังกฤษ" />
            </Form.Item>
            <Form.Item
                name="proceduce"
                label="วิธีการทำ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="วิธีการทำ 1. 2. 3." />
            </Form.Item>
            <Form.Item
                name="calories"
                label="ปริมาณพลังงาน"
                rules={[{ required: true },]}>
                <InputNumber min="0" max="10000" step="0.01" stringMode placeholder="ปริมาณพลังงาน (Kilo Calories)" />
            </Form.Item>
            <Form.Item
                name="nutrition"
                label="คุณค่าทางโภชนาการ"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="ประโยชน์" />
            </Form.Item>
            <Form.Item
                name="video"
                label="ที่อยู่วิดีโอ"
                rules={[{ required: true },{
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน url ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>

            <Form.Item
                name="image"
                label="รูปภาพ"
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
                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList.length : 0 }/1)</Button>
                </Upload>
            </Form.Item>
            <div className="flex justify-end gap-2">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">เพิ่มข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalManageType = ({ modalAddType, setModalAddType }) => {
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
            const send = {...foodTypeEdit,...val}
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
            render: val => <div>
                {/* <Button type="text" className="bg-yellow-300" onClick={() => console.log(val)}>ดู</Button> */}
                <Button type="text" className="bg-yellow-300" disabled={foodTypeEdit && (foodTypeEdit?.id !== val?.id) || false} onClick={() => foodTypeEdit?.id === val?.id ? setFoodTypeEdit(null) : setFoodTypeEdit(val)}>{foodTypeEdit?.id === val?.id ? "ยกเลิก" : "แก้ไข"}</Button>
                <Button type="danger" onClick={() => showConfirmDel(val)}>ลบ</Button>
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
                        pattern: /^[\u0E00-\u0E7F]+$/,
                        message: 'กรอกภาษาไทย',
                    }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="name_en"
                    label="ชื่อภาษาอังกฤษ"
                    rules={[{ required: true }, {
                        pattern: /^[a-zA-Z0-9]+$/,
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

const FetchTypeFood = async () => {
    const req = await fetch("/api/getTypeFood")
    if (req.status === 200) {
        const data = await req.json()
        return data
    }
    return null
}
