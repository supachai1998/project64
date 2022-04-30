import { useState, useEffect, createContext, useContext, useRef, } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, List, Steps, Form, Input, notification, Switch, InputNumber, Tooltip, Popconfirm } from 'antd'
import { UploadOutlined, DeleteOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
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
const riskArr = ["เสี่ยงต่ำมาก", "เสี่ยงต่ำ", "เสี่ยงปานกลาง", "เสี่ยงสูง", "เสี่ยงสูงมาก"]
import { ContextForm } from '/pages/admin/form.js'
export default function ResultForm() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalAddSubForm, setModalAddSubForm] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [modalViewSubForm, setModalViewSubForm] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [resultForm, setResultForm] = useState()
    const [store, setStore] = useState()
    const { modalResultForm, setModalResultForm } = useContext(ContextForm)
    const reqForm = async () => await fetch(`/api/getResultForm?id=${modalResultForm.ncdsId}`)
        .then(res => {
            if (res.status === 200) return res.json()
            else if (res.status === 404) {
                notification.error({ message: `ไม่พบข้อผลการประเมิน${modalResultForm.name_th}` })
                setResultForm();
                setStore()
                return []
            }
            return []
        })
        .then(data => {
            if (data.length > 0) {
                const _ = data.map(({ id, ...rest }) => ({ id: id, key: id, ...rest }))
                setResultForm(_);
                setStore(_)
            }
        })
    // .catch(err => notification.error({ message: "Error", description: err.message }))

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
        <Modal title={`ผลการประเมิน${modalResultForm.name_th}`}
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
                    <Button onClick={() => setModalAdd(true)}>เพิ่มผลการประเมิน</Button>
                </div>
                <ResultFormContext.Provider value={{
                    reload,
                    resultForm, setResultForm,
                    modalAdd, setModalAdd,
                    modalEdit, setModalEdit,
                    modalViewSubForm, setModalViewSubForm,
                    modalView, setModalView,
                    modalAddSubForm, setModalAddSubForm,
                    loading, store, setStore,
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
        loading, resultForm, setResultForm, store, setStore } = useContext(ResultFormContext)
    const inputRef = useRef()
    const [selectRows, setSelectRows] = useState([])
    useEffect(() => { }, [resultForm])
    const columns = [
        {
            title: <div className="text-center" >ระดับความเสี่ยง</div>,
            dataIndex: 'title',
            key: 'title',
            filters: riskArr.map((v) => ({ text: v, value: v })),
            onFilter: (value, record) => record.title === value,
            sorter: (a, b) => a.title.localeCompare(b.type),
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <div className="text-center" >คะแนนเริ่มต้น</div>,
            dataIndex: 'start',
            key: 'start',
            sorter: (a, b) => a.start - b.start,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <div className="text-center" >คะแนนสิ้นสุด</div>,
            dataIndex: 'end',
            key: 'end',
            sorter: (a, b) => a.end - b.end,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val}</Paragraph>
        },
        {
            title: <div className="text-center" >คำแนะนำ</div>,
            dataIndex: 'recommend',
            key: 'recommend',
            width: '30%',
            render: (text, val, index) => <Tooltip color={"#111827"} title={<div className='m-3 overflow-scroll'><p className='text-lg'>คำแนะนำ</p>{text}</div>}><Paragraph align="left" >{text.split("\n").map((v, i) => i < 2 && `${v}\n`)}</Paragraph></Tooltip>
        },

        {
            title: <div className="text-left" >การจัดการ</div>,
            dataIndex: '',
            key: '',
            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                {/* <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(resultForm[index])}>ดู</button> */}
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(val)}>แก้ไข</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val, reload)}>ลบ</button>
            </div>,
        },
    ];
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
                        title: `คุณต้องการจะลบผลการประเมิน`,
                        content: <div>
                            <p>{rows.title}</p>
                            <p>ช่วงคะแนน : {rows.start} - {rows.end}</p>
                        </div>,
                        okType: "danger",
                        okText: "ตกลง",
                        cancelText: "ยกเลิก",
                        async onOk() { res(rows.id) },
                        onCancel() { rej(); },
                    })
                })
                id.push(a)
            }
            console.log("delete", id)
            const res = await fetch("/api/getResultForm", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify({ id: id })
            })
            if (res.status === 200) {
                notification.success({
                    message: 'ลบข้อมูลสำเร็จ',
                })
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
    if (!resultForm) return null
    const search = () => {
        const userInput = inputRef.current.value
        const findMatch = resultForm.filter(val => {
            return val.title.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatch)
        if (!userInput) {
            setResultForm(store)
        }
        else if (findMatch?.length <= 0) {
            setResultForm(store)
            notification.error({ message: "ไม่พบข้อมูล" })
        }
        else setResultForm(findMatch)
    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows)
            setSelectRows(selectedRows)
        },
    };
    // console.log(resultForm)
    return <div>
        <Table size='small' tableLayout='auto' dataSource={resultForm} columns={columns}
            rowSelection={{ ...rowSelection }}
            title={() => <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    ตารางผลการประเมิน
                    <Tooltip title={"ดึงข้อมูลใหม่"}><button type="button" onClick={() => reload()} >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    </Tooltip>
                </div>
                <div className='flex items-center gap-2'>
                    {selectRows?.length > 0 && <div className='flex gap-2 text-md'>
                        <Button_Delete fx={() => showConfirmDelRows()} title={"ลบข้อมูลที่เลือก"} ></Button_Delete>
                    </div>}
                    <Tooltip title={"ค้นหาหาระดับความเสี่ยง"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setResultForm(store)} placeholder="ระดับความเสี่ยง" className='text-black rounded-md' /></Tooltip>
                    <Tooltip title={"ค้นหา"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
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

    return <Modal title={`เพิ่มผลการประเมิน${modalResultForm.name_th}`}
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
                                    <div className="flex justify-center items-center gap-2 text-lg"><Button_Delete fx={() => remove(ind)} /> ช่วงคะแนนที่ {ind + 1} </div>
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
                                            {riskArr.map((v, i) => <Option key={v} value={v}>{v}</Option>)}
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
    return <Modal title={`แก้ไขกผลการประเมิน${modalResultForm.name_th}`}
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


