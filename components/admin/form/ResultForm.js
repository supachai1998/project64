import { useState, useEffect, createContext, useContext, useMemo, useCallback, } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, List, Steps, Form, Input, notification, Switch, InputNumber, Tooltip, Popconfirm } from 'antd'
import { UploadOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Board from '/components/admin/DisplayBoard';
const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
import { groupByNcds } from '/ulity/group';
import { Button_Delete } from '/ulity/button';
const ellipsis = {
    rows: 3,
    expandable: false,
}
const { Step } = Steps;
const ResultFormContext = createContext()
import { ContextForm } from '/pages/admin/form.js'
export default function ResultForm() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalAddSubForm, setModalAddSubForm] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [modalViewSubForm, setModalViewSubForm] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [resultForm, setResultForm] = useState()
    const { modalResultForm, setModalResultForm } = useContext(ContextForm)
    const reqForm = async () => await fetch(`/api/getResultForm?id=${modalResultForm.ncdsId}`)
        .then(res => {
            if (res.status === 200) return res.json()
            else if (res.status === 404) notification.error({ message: `ไม่พบข้อมูลการประเมินผล${modalResultForm.name_th}` })
            else notification.error({ message: `ไม่สามารถดึงข้อมูลการประเมินผล${modalResultForm.name_th}` })
        })
        .then(data => setResultForm(data))
        .catch(err => notification.error({ message: "Error", description: err.message }))

    const reload = (async () => {
        setLoading(true)
        modalResultForm !== -1 && await reqForm()
        setLoading(false)
    })
    useEffect(() => {
        (async () => {
            await reload()
        })()
        return () => setResultForm()
    }, [modalResultForm])
    const onCancel = () => {
        setModalResultForm(-1)
    }
    return (
        <Modal title={`การประเมินผล${modalResultForm.name_th}`}
            visible={modalResultForm !== -1 ? true : false}
            okText={<>ตกลง</>}
            cancelText={<>ยกเลิก</>}
            footer={<></>}

            // onOk={onOk}
            onCancel={onCancel}
            width="90%"
        >
            <div className="ease-div flex flex-col gap-4 w-full">
                <div className="flex justify-between mt-4">
                    <div className="text-xl"></div>
                    <Button onClick={() => setModalAdd(true)}>เพิ่มการประเมินผล</Button>
                </div>
                <ResultFormContext.Provider value={{
                    reload,
                    resultForm, setResultForm,
                    modalAdd, setModalAdd,
                    modalEdit, setModalEdit,
                    modalViewSubForm, setModalViewSubForm,
                    modalView, setModalView,
                    modalAddSubForm, setModalAddSubForm,
                    loading,
                }}>
                    <ModalEdit />
                    <ModalAdd />
                    <TableResultForm />
                </ResultFormContext.Provider>
            </div>
        </Modal>
    )
}

const TableResultForm = () => {
    const { reload, setModalEdit,
        loading, resultForm } = useContext(ResultFormContext)
    useEffect(() => { }, [resultForm])
    const columns = [
        {
            title: <Paragraph align="center" >ระดับความเสี่ยง</Paragraph>,
            dataIndex: 'title',
            key: 'title',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <Paragraph align="center" >คะแนนเริ่มต้น</Paragraph>,
            dataIndex: 'start',
            key: 'start',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <Paragraph align="center" >คะแนนสิ้นสุด</Paragraph>,
            dataIndex: 'end',
            key: 'end',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <Paragraph align="center" >คำแนะนำ</Paragraph>,
            dataIndex: 'recommend',
            key: 'recommend',
            width: '30%',
            render: (text, val, index) => <Tooltip color={"#111827"} title={<div className='m-3 overflow-scroll'><p className='text-lg'>คำแนะนำ</p>{text}</div>}><Paragraph align="left" >{text.split("\n").map((v, i) => i < 2 && `${v}\n`)}</Paragraph></Tooltip>
        },

        {
            title: <Paragraph align="left" >การจัดการ</Paragraph>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                {/* <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(resultForm[index])}>ดู</button> */}
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(resultForm[index])}>แก้ไข</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(resultForm[index], reload)}>ลบ</button>
            </div>,
        },

    ];

    // console.log(resultForm)
    return <div>
        <Table size='small' tableLayout='auto' dataSource={resultForm} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางการประเมินผล
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
    const { modalAdd, setModalAdd, reload } = useContext(ResultFormContext)
    const { modalResultForm } = useContext(ContextForm)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);
    useEffect(() => {
        (async () => {

        })()
    }, [modalAdd])
    const onReset = () => {
        form.setFieldsValue();
    }
    const onOk = async (val) => {
        const v = val.resultForm.map(v => ({
            start: v.start, end: v.end, recommend: v.recommend, title: v.title, ncdsId: modalResultForm.ncdsId
        }))
        const res = await fetch("/api/getResultForm", { method: "POST", body: JSON.stringify(v) })
            .then(async res => {
                if (res.ok) {
                    await reload()
                    setModalAdd(false)
                } else notification.error({ message: `ไม่สามารถเพิ่มข้อมูลผลประเมิน${modalResultForm.name_th}` })
            })
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    return <Modal title={`เพิ่มการประเมินผล${modalResultForm.name_th}`}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}
        onOk={onOk}
        onCancel={onCancel}
        width="50vw"
    >
        <Form
            form={form}
            initialValues={[]}
            labelCol={{ span: 3 }}
            onFinish={onOk}
            onReset={onReset}
            // onValuesChange={v=>console.log(v)}
            scrollToFirstError={true}
            labelWrap={true}
            labelAlign="left"
        // onFinishFailed={onCancel}
        >
            <Form.List initialValues={[]} name="resultForm" rules={[{ required: true, message: "คุณลืมเพิ่มผลแบบประเมิน" }]}>
                {(fields, { add, remove }, { errors }) => {
                    const RiskChange = (v, field, ind) => {
                        // const val = form.getFieldValue(field.fieldKey)
                        let resultForm = form.getFieldValue("resultForm")
                        console.log(resultForm)
                        resultForm[ind] = { ...resultForm[ind], toggleRisk: v }
                        form.setFieldsValue({ resultForm: resultForm })
                    }
                    return <>
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...field}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >
                                <Form.Item
                                    labelCol={{ span: 0 }}
                                    label={null}
                                >
                                    <div className="flex justify-center items-center gap-2 text-lg"><Button_Delete fx={()=>remove(ind)}/> ช่วงคะแนนที่ {ind + 1} </div>
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 8 }}
                                    label={<>ระดับความเสี่ยง <Switch onChange={v => RiskChange(v, field, ind)} checkedChildren="กรอก" unCheckedChildren="เลือก" /></>}
                                    name={[field.name, 'title']}
                                    fieldKey={[field.fieldKey, 'title']}
                                    rules={[{ required: true }]}
                                >
                                    {form.getFieldValue("resultForm")[ind]?.toggleRisk
                                        ? <Input placeholder="เช่น เสี่ยงต่ำมาก เสี่ยงสูงมาก" />
                                        : <Select >
                                            {["เสี่ยงต่ำมาก", "เสี่ยงต่ำ", "เสี่ยงปานกลาง", "เสี่ยงสูง", "เสี่ยงสูงมาก"].map((v, i) => <Option key={v} value={v}>{v}</Option>)}
                                        </Select>}
                                </Form.Item>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        // wrapperCol={14}
                                        label={`คะแนนเริ่มต้น`}
                                        name={[field.name, 'start']}
                                        fieldKey={[field.fieldKey, 'start']}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={0} max={100} step={1} stringMode={false} placeholder="คะแนน 0 - 100" />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        // wrapperCol={14}
                                        label={`คะแนนสิ้นสุด`}
                                        name={[field.name, 'end']}
                                        fieldKey={[field.fieldKey, 'end']}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={0} max={100} step={1} stringMode={false} placeholder="คะแนน 0 - 100" />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    label={`คำแนะนำ`}
                                    name={[field.name, 'recommend']}
                                    fieldKey={[field.fieldKey, 'recommend']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={7} placeholder="คำแนะนำ" />
                                </Form.Item>
                                <hr className='mt-2 mb-4' />
                            </Form.Item>))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มช่วงคะแนน</span>
                            </button>
                        </div>

                        <Form.ErrorList errors={errors} />
                    </>

                }}
            </Form.List>
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">เพิ่มข้อมูล</Button>
            </div>
        </Form>

    </Modal>
}
const ModalEdit = () => {
    const { modalEdit, setModalEdit, reload } = useContext(ResultFormContext)
    const { modalResultForm } = useContext(ContextForm)
    const [form] = Form.useForm();

    useEffect(() => {
        if (!!modalEdit) {
            form.setFieldsValue({ resultForm: [{ ...modalEdit }] });
        }
    }, [form, modalEdit]);

    const onOk = async (val) => {
        const v = val.resultForm.map(v => ({
            id: v.id, start: v.start, end: v.end, recommend: v.recommend, title: v.title
        }))
        console.log(v)
        const res = await fetch("/api/getResultForm", { method: "PATCH", body: JSON.stringify(v) })
            .then(async res => {
                if (res.ok) {
                    notification.success({ message: `แก้ไขข้อมูลสำเร็จ` })
                    await reload()
                    setModalEdit(false)
                } else notification.error({ message: `ไม่สามารถแก้ไขข้อมูลผลประเมิน${modalResultForm.name_th}` })
            })
    }
    const onCancel = () => {
        setModalEdit(null)
    }
    const onReset = () => {
        form.setFieldsValue();
    }
    return <Modal title={`แก้ไขการประเมินผล${modalResultForm.name_th}`}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}
        zIndex={10000}
        // onOk={onOk}
        onCancel={onCancel}
        forceRender
        width="50vw"
    >
        <Form
            form={form}
            labelCol={{ span: 3 }}
            onFinish={onOk}
            onReset={onReset}
            // onValuesChange={v=>console.log(v)}
            scrollToFirstError={true}
            labelWrap={true}
            labelAlign="left"
        // onFinishFailed={onCancel}
        >
            <Form.List name="resultForm" rules={[{ required: true, message: "คุณลืมเพิ่มผลแบบประเมิน" }]}>
                {(fields, { add, remove }, { errors }) => {
                    const RiskChange = (v, field, ind) => {
                        // const val = form.getFieldValue(field.fieldKey)
                        let resultForm = form.getFieldValue("resultForm")
                        console.log(resultForm)
                        resultForm[ind] = { ...resultForm[ind], toggleRisk: v }
                        form.setFieldsValue({ resultForm: resultForm })
                    }
                    return <>
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...field}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >
                                
                                <Form.Item
                                    labelCol={{ span: 5 }}
                                    label={<>ระดับความเสี่ยง </>}
                                    name={[field.name, 'title']}
                                    fieldKey={[field.fieldKey, 'title']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น เสี่ยงต่ำมาก เสี่ยงสูงมาก" />
                                </Form.Item>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        // wrapperCol={14}
                                        label={`คะแนนเริ่มต้น`}
                                        name={[field.name, 'start']}
                                        fieldKey={[field.fieldKey, 'start']}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={0} max={100} step={1} stringMode={false} placeholder="คะแนน 0 - 100" />
                                    </Form.Item>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        // wrapperCol={14}
                                        label={`คะแนนสิ้นสุด`}
                                        name={[field.name, 'end']}
                                        fieldKey={[field.fieldKey, 'end']}
                                        rules={[{ required: true }]}
                                    >
                                        <InputNumber min={0} max={100} step={1} stringMode={false} placeholder="คะแนน 0 - 100" />
                                    </Form.Item>
                                </div>
                                <Form.Item
                                    label={`คำแนะนำ`}
                                    name={[field.name, 'recommend']}
                                    fieldKey={[field.fieldKey, 'recommend']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={7} placeholder="คำแนะนำ" />
                                </Form.Item>
                                <hr className='mt-2 mb-4' />
                            </Form.Item>))}

                        <Form.ErrorList errors={errors} />
                    </>

                }}
            </Form.List>
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">แก้ไขข้อมูล</Button>
            </div>
        </Form>

    </Modal>
}

const showConfirmDel = async (val, reload) => {
    let del = true
    confirm({
        title: <>คุณต้องผลการจะลบผลแบบประเมิน</>,
        content: <ul>
            <li>ระดับความเสี่ยง {val.title}</li>
            <li>คะแนนเริ่มต้น {val.start} - {val.end}</li>
            <li>คำแนะนำ {val.recommend} </li>
        </ul>,
        okType: 'danger',
        okText: "ลบ",
        cancelText: "ยกเลิก",
        async onOk() {
            const res = await fetch("/api/getResultForm", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify({ id: val.id })
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
            del = false

        },
        onCancel() { },
    });
}


