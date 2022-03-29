import { useState, useEffect, createContext, useContext } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, List, Steps, Form, Input, notification, InputNumber, Tooltip, Popconfirm } from 'antd'
import { UploadOutlined,DeleteOutlined , MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Board from '../../components/admin/DisplayBoard';
const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
import { groupByNcds } from '../../ulity/group';
import { Button_Delete } from '../../ulity/button';
const ellipsis = {
    rows: 3,
    expandable: false,
}
const { Step } = Steps;
const Context = createContext()

export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [modalViewSubForm, setModalViewSubForm] = useState(false)
    const [modalAddSubForm, setModalAddSubForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [NCDS, setNCDS] = useState()
    const [_form, setForm] = useState([])
    const reqForm = async () => await fetch("/api/getForm")
        .then(res => res.status === 200 ? res.json() : notification.error({ message: "ไม่สามารถดึงข้อมูลแบบฟอร์ม" }))
        .then(data => data)
        .catch(err => notification.error({ message: "Error", description: err.message }))

    const reload = async () => {
        setLoading(true)
        const data = await reqForm()
        setForm(!!data && data.length > 0 && data || [])
        setLoading(false)
    }
    useEffect(() => {
        (async () => {
            await reload()
            const fetchNCDS = await FetchNCDS()
            Array.isArray(fetchNCDS) && setNCDS(fetchNCDS)
        })()
    }, [])
    // useEffect(() => {
    //     reload()
    // }, [modalEdit])
    return (
        <div className="ease-div flex flex-col gap-4 w-full">
            <Board data={{}} />
            <div className="flex justify-between mt-4">
                <div className="text-xl"></div>
                <Button onClick={() => setModalAdd(true)}>เพิ่มแบบประเมิน</Button>
            </div>
            <Context.Provider value={{
                reload,
                modalAdd, setModalAdd,
                modalEdit, setModalEdit,
                modalViewSubForm, setModalViewSubForm,
                modalView, setModalView,
                modalAddSubForm, setModalAddSubForm,
                loading,
                _form, NCDS
            }}>
                <ModalEdit />
                <ModalView />
                <ModalAdd />
                <ModalViewSubForm />
                <ModalAddSubForm />
                <TableForm />
            </Context.Provider>
        </div>
    )
}

const TableForm = () => {
    const { _form, reload,
        setModalEditSubForm,
        setModalViewSubForm,
        loading } = useContext(Context)

    const columns = [
        {
            title: <Paragraph align="left" >ชื่อโรค</Paragraph>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: (text, val, index) => <Tooltip title={`${val.name_th} (${val.name_en})`} ><Paragraph ellipsis={ellipsis}>{val.name_th}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >จำนวนหัวข้อ</Paragraph>,
            dataIndex: 'data',
            key: 'data',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <Paragraph align="center" >จำนวนคำถาม</Paragraph>,
            dataIndex: 'data',
            key: 'data',
            render: val => <Tooltip><Paragraph align="center" ellipsis={ellipsis}>{val.map(({ subForm }) => subForm.length).reduce((a, b) => a + b)}</Paragraph></Tooltip>
        },

        {
            title: <Paragraph align="left" >การจัดการ</Paragraph>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className="button-cus bg-gray-100 hover:bg-gray-200" onClick={() => setModalViewSubForm(__form[index])}>จัดการ</button>
                {/* <button className="button-cus bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(_form[index].data)}>แก้ไข</button>
                <button className="button-cus bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(_form[index].data, reload)}>ลบ</button> */}
            </div>,
        },

    ];

    const __form = groupByNcds(_form, 'ncdsId')
    return <div>
        <Table size='small' tableLayout='auto' dataSource={__form} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางแบบประเมิน
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

const TableFormSub = () => {
    const { _form, reload,
        setModalEdit,
        setModalView,
        modalAddSubForm, setModalAddSubForm,
        loading } = useContext(Context)

    const columns = [
        {
            title: <Paragraph align="left" >ชื่อหัวข้อ</Paragraph>,
            dataIndex: 'title',
            key: 'title',
            render: val => <Tooltip title={`${val}`} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="center" >จำนวนคำถาม</Paragraph>,
            dataIndex: 'subForm',
            key: 'subForm',
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <Paragraph align="center" >จำนวนตัวเลือก</Paragraph>,
            dataIndex: 'subForm',
            key: 'subForm',
            render: val => <Tooltip><Paragraph align="center" ellipsis={ellipsis}>{val.map(({ choice }) => choice.length).reduce((a, b) => a + b)}</Paragraph></Tooltip>
        },
        {
            title: <Paragraph align="left" >การจัดการ</Paragraph>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className="button-cus bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(_form[index])}>ดู</button>
                <button className="button-cus bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(_form[index])}>แก้ไข</button>
                <button className="button-cus bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(_form[index], reload)}>ลบ</button>
            </div>,
        },

    ];

    return <div>
        <button className="button-cus  hover:bg-gray-200 float-right" onClick={() => setModalAddSubForm(_form[0])}>เพิ่มหัวข้อ</button>

        <Table size='small' tableLayout='auto' dataSource={_form} columns={columns}
            title={() => <div className="flex items-center gap-2">ตารางแบบประเมิน
                <Tooltip title={"ดึงข้อมูลใหม่"}><button type="button" onClick={() => reload()} >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
                </Tooltip>
            </div>}
        // footer={() => 'Footer'} 
        />
    </div>
}

const ModalView = () => {
    const { setModalView, modalView, reload, } = useContext(Context)
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const onCancel = () => {
        setModalView(false)
        setCurrent(0)
    }
    if (!modalView) return null
    return <Modal title={`คำถามที่ ${current + 1}. ${modalView.subForm[current].name}`}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        className="w-full sm:w-1/2 "
        footer={<div className='w-full flex justify-end gap-3'>
            {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    คำถามก่อนหน้า
                </Button>
            )}
            {current < modalView.subForm.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                    คำถามถัดไป
                </Button>
            )}
            {current === modalView.subForm.length - 1 && (
                <Button type="ghost" onClick={onCancel}>
                    ปิด
                </Button>
            )}
        </div>}>
        ตัวเลือก
        <div className="steps-content">
            <List
                itemLayout="horizontal"
                dataSource={modalView.subForm[current].choice}
                renderItem={({ name, detail, score }, ind) => (
                    <List.Item>
                        <List.Item.Meta
                            title={`${ind + 1}. ${name}`}
                            description={`คะแนน ${score} ${detail ? `คำอธิบาย ${detail}` : ""}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    </Modal>

}
const ModalViewSubForm = () => {
    const { reload,
        modalAdd, setModalAdd,
        modalEdit, setModalEdit,
        modalView, setModalView,
        modalViewSubForm, setModalViewSubForm,
        loading,
        _form, NCDS } = useContext(Context)

    if (!modalViewSubForm) return null
    return <Modal title={`แบบประเมิน ${modalViewSubForm.name_th}`}
        visible={modalViewSubForm}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={() => setModalViewSubForm(false)}
        className="w-full sm:w-1/2 "
        width={"100%"}
        footer={null}>


        <TableFormSub />
    </Modal>

}

const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload, _form, NCDS } = useContext(Context)
    const [form] = Form.useForm();
    const [ncds, setNcds] = useState()

    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);
    useEffect(() => {
        (async () => {
            if (modalAdd) {
                if (Array.isArray(NCDS)) {
                    !!_form && _form.length > 0 ? setNcds(NCDS.filter(({ id }) => _form.find(({ ncds }) => ncds.id !== id))) : setNcds(NCDS)
                }
            }
        })()
    }, [NCDS, _form, modalAdd])
    const onOk = async (val) => {
        let err = false
        await val.form.map(async f => {
            f["subForm"] = f?.subForm?.map((subForm) => {
                return {
                    ...subForm,
                    choice: { create: subForm.choice.map(choice => { return { ...choice, score: parseInt(choice.score) } }) }
                }
            })
            f["subForm"] = { create: [...f["subForm"]] }
            f["ncdsId"] = val.ncdsId
            const res = await fetch(`/api/getForm`, {
                method: "POST",
                body: JSON.stringify(f)
            })
                .then(res => {
                    if (res.ok) {
                        return true
                    } else {
                        notification.error({ message: `ไม่สามารถเพิ่มหัวข้อ ${title}` })
                    }
                })
            !res ? err = true : err = false
        })
        if (!err) {
            notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
            setModalAdd(false)
            reload()
        }
    }
    const onCancel = () => {
        setModalAdd(false)
    }
    const onReset = () => {
        form.setFieldsValue();
    }
    return <Modal title={"เพิ่มข้อมูลแบบประเมิน"}
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
            // onValuesChange={v=>console.log(v)}
            scrollToFirstError={true}
            labelWrap={true}
        // onFinishFailed={onCancel}
        >
            <Form.Item
                name="ncdsId"
                label="โรคไม่ติดต่อ"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกโรคไม่ติดต่อ"
                    optionFilterProp="children"
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.List name="form" rules={[{ required: true, message: "คุณลืมเพิ่มหัวข้อแบบประเมิน" }]}>
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...field}
                                noStyle
                                shouldUpdate
                                key={field.key}
                                required
                            >
                                <Form.Item
                                    {...field}
                                    labelCol={{ span: 0 }}

                                >
                                    {ind !== 0 && <hr />}
                                    <div className="flex gap-3 items-center  justify-center py-2">
                                        <div className="text-lg text-blue-500">หัวข้อแบบประเมินที่ {ind + 1}</div> <Tooltip title={"ลบหัวข้อที่ " + (ind + 1)}><MinusCircleOutlined style={{ color: "red" }} onClick={() => remove(fieldsubForm.name)} /></Tooltip>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    label={`ชื่อหัวข้อที่ ${ind + 1}`}
                                    name={[field.name, 'title']}
                                    fieldKey={[field.fieldKey, 'title']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น พฤติกรรมการรับประทานอาหาร" />
                                </Form.Item>
                                <Form.List name={[field.name, 'subForm']} rules={[{ required: true, message: "คุณลืมเพิ่มคำถาม" }]} >
                                    {(subForm, { add, remove }, { errors }) => (
                                        <>
                                            {!!subForm && subForm.map((fieldsubForm, ind) => (
                                                <Form.Item
                                                    {...subForm}
                                                    noStyle
                                                    shouldUpdate
                                                    key={fieldsubForm.key}
                                                    required
                                                >

                                                    {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}

                                                    <Form.Item
                                                        label={`ชื่อคำถามที่ ${ind + 1}`}
                                                        name={[fieldsubForm.name, 'name']}
                                                        fieldKey={[fieldsubForm.fieldKey, 'name']}
                                                        rules={[{ required: true }]}
                                                    >
                                                        <Input placeholder="เช่น พฤติกรรมการรับประทานอาหาร" />
                                                    </Form.Item>
                                                    <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "คุณลืมเพิ่มตัวเลือก" }]} >
                                                        {(choice, { add, remove }, { errors }) => (
                                                            <>

                                                                {!!choice && choice.map((fieldchoice, ind) => (
                                                                    <Form.Item
                                                                        {...choice}
                                                                        noStyle
                                                                        shouldUpdate
                                                                        key={fieldchoice.key}
                                                                        required
                                                                    >
                                                                        {/* {ind !== 0 && <Divider />} */}
                                                                        {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}
                                                                        <div className='mx-auto sm:flex justify-center'>
                                                                            <Form.Item
                                                                                label={"ชื่อตัวเลือก"}
                                                                                name={[fieldchoice.name, 'name']}
                                                                                fieldKey={[fieldchoice.fieldKey, 'name']}
                                                                                rules={[{ required: true }]}
                                                                                labelCol={{ span: 10 }}
                                                                            >
                                                                                <Input placeholder="เช่น กินเผ็ดมาก" />
                                                                            </Form.Item>
                                                                            <Form.Item
                                                                                label="รายละเอียด"
                                                                                name={[fieldchoice.name, 'detail']}
                                                                                fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                                                rules={[{ required: false }]}
                                                                                labelCol={{ span: 10 }}
                                                                            >
                                                                                <TextArea rows={1} placeholder="รายละเอียด" />
                                                                            </Form.Item>
                                                                            <Form.Item
                                                                                label="คะแนน"
                                                                                labelCol={{ span: 10 }}
                                                                                name={[fieldchoice.name, 'score']}
                                                                                fieldKey={[fieldchoice.fieldKey, 'score']}
                                                                                rules={[{ required: true }, {
                                                                                    pattern: /^[0-9.]+$/,
                                                                                    message: 'ป้อนตัวเลข',
                                                                                }]}>
                                                                                <InputNumber min="0" max="5" step="1" stringMode placeholder="คะแนน 0 - 5" />
                                                                            </Form.Item>
                                                                            <Form.Item labelCol={{ span: 1 }} >
                                                                                <div className="flex gap-2">
                                                                                    <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>ลบ</button>
                                                                                    {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>เพิ่ม</button>}
                                                                                </div>
                                                                            </Form.Item>
                                                                        </div>
                                                                    </Form.Item>
                                                                ))}
                                                                {choice.length === 0 && <div className="flex justify-center ">
                                                                    <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease btn-sm"
                                                                        onClick={() => add()}
                                                                        type="button">
                                                                        <PlusOutlined />
                                                                        <span className="text-blue-500">เพิ่มตัวเลือก</span>
                                                                    </button>
                                                                </div>}
                                                                <Form.ErrorList errors={errors} />
                                                                <hr className='w-1/2 mx-auto' />
                                                            </>

                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                            ))}
                                            <div className="flex justify-center ">
                                                <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                                    onClick={() => add()}
                                                    type="button">
                                                    <PlusOutlined />
                                                    <span className="text-blue-900">เพิ่มคำถาม</span>
                                                </button>
                                            </div>

                                            <Form.ErrorList errors={errors} />
                                        </>

                                    )}
                                </Form.List>
                            </Form.Item>))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อแบบประเมิน</span>
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
    const { modalEdit, setModalEdit, reload, _form, NCDS } = useContext(Context)
    const [form] = Form.useForm();
    const [ncds, setNcds] = useState()

    useEffect(() => {
        form.setFieldsValue({ ...modalEdit, ncdsId: modalEdit?.ncds?.id });
    }, [form, modalEdit]);
    useEffect(() => {
        (async () => {
            if (modalEdit) {
                Array.isArray(NCDS) && setNcds(NCDS)
            }
        })()
    }, [modalEdit])
    const onOk = async (val) => {
        if (!val.subForm) {
            notification.error({ message: "กรุณาเพิ่มหัวข้อแบบประเมิน" })
            return
        } else if (!val.subForm.map(({ choice }) => choice).every(arr => Array.isArray(arr) && arr.length > 0)) {
            notification.error({ message: "กรุณาเพิ่มคำถาม" })
            return
        }
        val["id"] = modalEdit.id
        const res = await fetch(`/api/getForm`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ old: modalEdit, new: val })
        })
            .then(async res => {
                if (res.ok) {
                    notification.success({ message: "แก้ไขข้อมูลเรียบร้อย" })
                    await reload()
                    setModalEdit(false)
                } else {
                    notification.error({ message: `ไม่สามารถแก้ไขข้อมูลได้` })
                }
            })
        await reload()
    }
    const onCancel = () => {
        setModalEdit(false)
    }
    const onReset = () => {
        form.setFieldsValue();
    }
    return <Modal title={"แก้ไขข้อมูลแบบประเมิน"}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}
        zIndex={10000}
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
            // onValuesChange={v=>console.log(v)}
            scrollToFirstError={true}
            labelWrap={true}
        // onFinishFailed={onCancel}
        >
            <Form.Item
                name="ncdsId"
                label="โรคไม่ติดต่อ"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกโรคไม่ติดต่อ"
                    optionFilterProp="children"
                    disabled
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                label="ชื่อหัวข้อ"
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.List name="subForm" rules={[{ required: true, message: "คุณลืมเพิ่มคำถาม" }]} >
                {(subForm, { add, remove }, { errors }) => (
                    <>
                        {!!subForm && subForm.map((fieldsubForm, ind) => (
                            <Form.Item
                                {...subForm}
                                noStyle
                                shouldUpdate
                                key={fieldsubForm.key}
                                required
                            >

                                {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}

                                <Form.Item
                                    label={`ชื่อคำถามที่ ${ind + 1}`}
                                    name={[fieldsubForm.name, 'name']}
                                    fieldKey={[fieldsubForm.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น พฤติกรรมการรับประทานอาหาร" />
                                </Form.Item>
                                <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "คุณลืมเพิ่มตัวเลือก" }]} >
                                    {(choice, { add, remove }, { errors }) => (
                                        <>

                                            {!!choice && choice.map((fieldchoice, ind) => (
                                                <Form.Item
                                                    {...choice}
                                                    noStyle
                                                    shouldUpdate
                                                    key={fieldchoice.key}
                                                    required
                                                >
                                                    {/* {ind !== 0 && <Divider />} */}
                                                    {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}
                                                    <div className='mx-auto sm:flex justify-center'>
                                                        <Form.Item
                                                            label={"ชื่อตัวเลือก"}
                                                            name={[fieldchoice.name, 'name']}
                                                            fieldKey={[fieldchoice.fieldKey, 'name']}
                                                            rules={[{ required: true }]}
                                                            labelCol={{ span: 10 }}
                                                        >
                                                            <Input placeholder="เช่น กินเผ็ดมาก" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="รายละเอียด"
                                                            name={[fieldchoice.name, 'detail']}
                                                            fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                            rules={[{ required: false }]}
                                                            labelCol={{ span: 10 }}
                                                        >
                                                            <TextArea rows={1} placeholder="รายละเอียด" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="คะแนน"
                                                            labelCol={{ span: 10 }}
                                                            name={[fieldchoice.name, 'score']}
                                                            fieldKey={[fieldchoice.fieldKey, 'score']}
                                                            rules={[{ required: true }, {
                                                                pattern: /^[0-9.]+$/,
                                                                message: 'ป้อนตัวเลข',
                                                            }]}>
                                                            <InputNumber min="0" max="5" step="1" stringMode placeholder="คะแนน 0 - 5" />
                                                        </Form.Item>
                                                        <Form.Item labelCol={{ span: 1 }} >
                                                            <div className="flex gap-2">
                                                                <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>ลบ</button>
                                                                {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>เพิ่ม</button>}
                                                            </div>
                                                        </Form.Item>
                                                    </div>
                                                </Form.Item>
                                            ))}
                                            {choice.length === 0 && <div className="flex justify-center ">
                                                <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease btn-sm"
                                                    onClick={() => add()}
                                                    type="button">
                                                    <PlusOutlined />
                                                    <span className="text-blue-500">เพิ่มตัวเลือก</span>
                                                </button>
                                            </div>}
                                            <Form.ErrorList errors={errors} />
                                            <hr className='w-1/2 mx-auto' />
                                        </>

                                    )}
                                </Form.List>
                            </Form.Item>
                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มคำถาม</span>
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
const ModalAddSubForm = () => {
    const { modalAddSubForm, setModalAddSubForm, reload, _form, NCDS } = useContext(Context)
    const [form] = Form.useForm();

    useEffect(() => {
        !!modalAddSubForm && form.setFieldsValue({
            ncdsId: modalAddSubForm.ncdsId
        });
        console.log(modalAddSubForm)
    }, [form, modalAddSubForm]);

    const onOk = async (val) => {
        console.log(val)
        delete val["ncds"]
        delete val["id"] 
        const res = await fetch(`/api/getForm?addSubForm=true`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(val)
        })
            .then(async res => {
                if (res.ok) {
                    notification.success({ message: "เพิ่มข้อมูลเรียบร้อย" })
                    onReset()
                    setModalAddSubForm(false)
                } else {
                    notification.error({ message: `ไม่สามารถเพิ่มข้อมูลได้` })
                }
            })
        await reload()
    }
    const onCancel = () => {
        setModalAddSubForm(false)
    }
    const onReset = () => {
        form.setFieldsValue({
            ncdsId: modalAddSubForm.ncdsId
        });
    }
    return <Modal title={"เพิ่มข้อมูลแบบประเมิน"}
        visible={modalAddSubForm}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        footer={<></>}
        zIndex={10000}
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
            // onValuesChange={v=>console.log(v)}
            scrollToFirstError={true}
            labelWrap={true}
        // onFinishFailed={onCancel}
        >
            <Form.Item
                name="ncdsId"
                label="โรคไม่ติดต่อ"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="เลือกโรคไม่ติดต่อ"
                    optionFilterProp="children"
                    disabled
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!NCDS && NCDS.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                label="ชื่อหัวข้อ"
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.List name="subForm" rules={[{ required: true, message: "คุณลืมเพิ่มคำถาม" }]} >
                {(subForm, { add, remove }, { errors }) => (
                    <>
                        {!!subForm && subForm.map((fieldsubForm, ind) => (
                            <Form.Item
                                {...subForm}
                                noStyle
                                shouldUpdate
                                key={fieldsubForm.key}
                                required
                            >

                                {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}

                                <Form.Item
                                    label={<><Button_Delete fx={()=>remove(fieldsubForm.name)}/>ชื่อคำถามที่ {ind + 1}</>}
                                    name={[fieldsubForm.name, 'name']}
                                    fieldKey={[fieldsubForm.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="เช่น พฤติกรรมการรับประทานอาหาร" />
                                </Form.Item>
                                <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "คุณลืมเพิ่มตัวเลือก" }]} >
                                    {(choice, { add, remove }, { errors }) => (
                                        <>

                                            {!!choice && choice.map((fieldchoice, ind) => (
                                                <Form.Item
                                                    {...choice}
                                                    noStyle
                                                    shouldUpdate
                                                    key={fieldchoice.key}
                                                    required
                                                >
                                                    {/* {ind !== 0 && <Divider />} */}
                                                    {/* <Form.Item label={`แหล่งอ้างอิงที่ ${ind + 1}`}><Divider /></Form.Item> */}
                                                    <div className='mx-auto sm:flex justify-center'>
                                                        <Form.Item
                                                            label={"ชื่อตัวเลือก"}
                                                            name={[fieldchoice.name, 'name']}
                                                            fieldKey={[fieldchoice.fieldKey, 'name']}
                                                            rules={[{ required: true }]}
                                                            labelCol={{ span: 10 }}
                                                        >
                                                            <Input placeholder="เช่น กินเผ็ดมาก" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="รายละเอียด"
                                                            name={[fieldchoice.name, 'detail']}
                                                            fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                            rules={[{ required: false }]}
                                                            labelCol={{ span: 10 }}
                                                        >
                                                            <TextArea rows={1} placeholder="รายละเอียด" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="คะแนน"
                                                            labelCol={{ span: 10 }}
                                                            name={[fieldchoice.name, 'score']}
                                                            fieldKey={[fieldchoice.fieldKey, 'score']}
                                                            rules={[{ required: true }, {
                                                                pattern: /^[0-9.]+$/,
                                                                message: 'ป้อนตัวเลข',
                                                            }]}>
                                                            <InputNumber min="0" max="5" step="1" stringMode placeholder="คะแนน 0 - 5" />
                                                        </Form.Item>
                                                        <Form.Item labelCol={{ span: 1 }} >
                                                            <div className="flex gap-2">
                                                                <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>ลบ</button>
                                                                {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>เพิ่ม</button>}
                                                            </div>
                                                        </Form.Item>
                                                    </div>
                                                </Form.Item>
                                            ))}
                                            {choice.length === 0 && <div className="flex justify-center ">
                                                <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease btn-sm"
                                                    onClick={() => add()}
                                                    type="button">
                                                    <PlusOutlined />
                                                    <span className="text-blue-500">เพิ่มตัวเลือก</span>
                                                </button>
                                            </div>}
                                            <Form.ErrorList errors={errors} />
                                            <hr className='w-1/2 mx-auto' />
                                        </>

                                    )}
                                </Form.List>
                            </Form.Item>
                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มคำถาม</span>
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

const showConfirmDel = async (val, reload) => {
    console.log(val)
    let del = true
    confirm({
        title: <>คุณต้องการจะลบแบบประเมิน</>,
        content: <ul>
            {val.subForm.map(({ name, choice }, ind) =>
                <li key={name}>{ind + 1}. {name} <br />
                    {choice.map(({ name, score }, ind2) => <li key={name} className="ml-3">{ind + 1}.{ind2 + 1} {name}</li>)}
                </li>)}
        </ul>,
        okType: 'danger',
        okText: <Popconfirm
            okType='danger'
            onConfirm={async () => {
                const res = await fetch("/api/getForm", {
                    headers: { 'Content-Type': 'application/json', },
                    method: "DELETE",
                    body: JSON.stringify({ id: val.id })
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
                del = false
            }}
            onCancel={() => { del = false }}
            okText="ลบทั้งหมด"
            cancelText="ยกเลิก">ลบทั้งหมด</Popconfirm>,
        cancelText: "ยกเลิก",
        async onOk() {
            while (del) {
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        },
        onCancel() { },
    });
}
const FetchNCDS = async () => {
    const req = await fetch("/api/getNCDS")
    if (req.status === 200) {
        const data = await req.json()
        return data
    }
    return null
}
