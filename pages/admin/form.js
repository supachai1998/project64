import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Collapse, List, Steps, Form, Input, notification, InputNumber, Tooltip, Popconfirm } from 'antd'
import Board from '../../components/admin/DisplayBoard';
const { Title, Paragraph, Text, Link } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select
import { groupByNcds } from '../../ulity/group';
import { Button_Delete, Button_Collapsed } from '../../ulity/button';
import ResultForm from '/components/admin/form/ResultForm';
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
ChartJS.defaults.font.size = 16;
// END Report
const ellipsis = {
    rows: 3,
    expandable: false,
}
const { Panel } = Collapse;

const { Step } = Steps;
export const ContextForm = createContext()

export default function Index() {
    const [modalAdd, setModalAdd] = useState(false)
    const [modalAddSubForm, setModalAddSubForm] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [modalViewSubForm, setModalViewSubForm] = useState(-1)
    const [modalResultForm, setModalResultForm] = useState(-1)
    const [loading, setLoading] = useState(false)
    const [NCDS, setNCDS] = useState()
    const [_form, setForm] = useState([])
    const [store, setStore] = useState([])
    const [_formGroupBy, setFormGroupBy] = useState([])

    const componentRef = useRef();
    const inputRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const columns = [
        {
            title: <div className="text-left" >?????????????????????</div>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: (text, val, index) => <Tooltip title={`${val.name_th} (${val.name_en})`} ><div >{val.name_th}</div></Tooltip>
        },
        {
            title: <div className="text-center" >?????????</div>,
            dataIndex: 'data',
            key: 'data',
            render: val => <div className="text-left" >{val.map((v, ind) => <p key={v.title}>{ind + 1}. {v.title}</p>)}</div>
        },
        {
            title: <div className="text-center" >??????????????????????????????</div>,
            dataIndex: 'data',
            key: 'data',
            render: val => <div className="text-center" >{val.map(({ subForm }) => <li key={subForm.id}>{subForm.length}</li>)}</div>
        },
        {
            title: <div className="text-center" >???????????????</div>,
            dataIndex: 'data',
            key: 'data',
            render: val => <div className="text-center" >{val.map(({ subForm }) => <li key={subForm.id}>{subForm.reduce((sum, { choice }) => sum += choice.reduce((sum2, { score }) => sum2 += score, 0), 0)}</li>)}</div>
        },

    ];

    const reqForm = async () => await fetch("/api/getForm")
        .then(res => res.status === 200 ? res.json() : notification.error({ message: "????????????????????????????????????????????????????????????????????????????????????" }))
        .then(data => data)
        .catch(err => notification.error({ message: "Error", description: err.message }))

    const reload = useCallback(async () => {
        setLoading(true)
        const data = await reqForm()
        if (!!data) {
            setForm(data)
            const g = groupByNcds(data, 'ncdsId')
            const _ = g.map(({ id, data, ...rest }) =>
            ({
                id: id, key: id, data: data.map(({ id, subForm, ...rest2 }) =>
                    ({ id: id, key: id, subForm: subForm.map(({ id, ...rest3 }) => ({ id: id, key: id, ...rest3 })), ...rest2 })), ...rest
            }))
            setFormGroupBy(_)
            setStore(_)
            console.log(_)
        } else {
            setForm([])
            setFormGroupBy([])
        }
        setLoading(false)
    }, [])
    useEffect(() => {
        (async () => {
            const fetchNCDS = await FetchNCDS()
            Array.isArray(fetchNCDS) && setNCDS(fetchNCDS)
            await reload()
        })()
    }, [])
    useEffect(() => {
        async () => { await reload() }
    }, [modalAddSubForm, modalAdd])

    return (
        <div className="ease-div flex flex-col gap-4 w-full">
            <Chart NCDS={NCDS} _form={_form} _formGroupBy={_formGroupBy} />
            <div className="flex justify-between mt-4">
                <div className="text-xl"></div>
                <div className="flex gap-3">
                    <Button onClick={() => { componentRef.current.style.display = "block"; handlePrint(); componentRef.current.style.display = "none"; }} type="ghost" danger><FilePdfOutlined /> PDF </Button>
                    <Button className='green-ghost-green' icon={<DownloadOutlined />}>
                        <CSVLink
                            filename={`?????????????????????????????? ${inputRef.current?.value}-${moment().format("LLLL")}.csv`}
                            data={!!_formGroupBy ? _formGroupBy.map(({ name_th, name_en, data }) => ({ name_th, name_en, subFormTotal: data.length, choiceTotal: data.map(({ subForm }) => subForm.length).reduce((a, b) => a + b) })) : []}
                            onClick={() => notification.success({ message: "???????????????????????????????????????" })}
                        >
                            <span className="text-green-500">CSV</span>
                        </CSVLink>
                    </Button>
                    <Button onClick={() => setModalAdd(true)}>?????????????????????????????????????????????</Button>
                </div>
            </div>
            <ContextForm.Provider value={{
                reload,
                _formGroupBy, setFormGroupBy,
                modalAdd, setModalAdd,
                modalEdit, setModalEdit,
                modalViewSubForm, setModalViewSubForm,
                modalView, setModalView,
                modalAddSubForm, setModalAddSubForm,
                modalResultForm, setModalResultForm,
                loading,
                _form, NCDS,
                store, setStore, inputRef
            }}>
                <ModalEdit />
                <ModalView />
                <ModalAdd />
                <ModalViewSubForm />
                <ModalAddSubForm />
                <TableForm />
                <ResultForm />
            </ContextForm.Provider>
            <div className='hidden' ref={componentRef}>
                <Table size='small' bordered title={() => <span className="text-lg">?????????????????????????????? {inputRef.current?.value}</span>} tableLayout='auto' pagination={false} dataSource={_formGroupBy} columns={columns} footer={() => <div className="flex justify-end"><span>??????????????? : {moment().format("LLLL")}</span></div>} />
            </div>
        </div>
    )
}

const TableForm = () => {
    const { _formGroupBy, setFormGroupBy, reload,
        setModalViewSubForm,
        setModalResultForm,
        loading, store, inputRef } = useContext(ContextForm)
    const columns = [
        {
            title: <div className="text-left" >?????????????????????</div>,
            dataIndex: 'name_th',
            key: 'name_th',
            render: (text, val, index) => <Tooltip title={`${val.name_th} (${val.name_en})`} ><Paragraph ellipsis={ellipsis}>{val.name_th}</Paragraph></Tooltip>
        },
        {
            title: <div className="text-center" >????????????????????????</div>,
            dataIndex: 'data',
            key: 'data',
            sorter: (a, b) => a.data.length - b.data.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <div className="text-center" >??????????????????????????????</div>,
            dataIndex: 'data',
            key: 'data',
            sorter: (a, b) => a.data.map(({ subForm }) => subForm.length).reduce((a, b) => a + b) - b.data.map(({ subForm }) => subForm.length).reduce((a, b) => a + b),
            render: val => <Tooltip><Paragraph align="center" ellipsis={ellipsis}>{val.map(({ subForm }) => subForm.length).reduce((a, b) => a + b)}</Paragraph></Tooltip>
        },

        {
            title: <div className="text-left" >??????????????????</div>,
            dataIndex: '',
            key: '',
            width: "20%",
            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalViewSubForm(_formGroupBy.findIndex(({ id }) => id === val.id))}>??????????????????????????????</button>
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalResultForm(val)}>???????????????????????????</button>
                {/* <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(_form[index].data, reload)}>??????</button> */}
            </div>,
        },

    ];
    const search = () => {
        const userInput = inputRef.current.value
        const findMatchNCDS = _formGroupBy.filter(val => {
            return val.name_th.toLowerCase().includes(userInput.toLowerCase()) || val.name_en.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatchNCDS)
        if (!userInput) {
            setFormGroupBy(store)
        }
        else if (findMatchNCDS?.length <= 0) {
            setFormGroupBy(store)
            notification.error({ message: "?????????????????????????????????" })
        }
        else setFormGroupBy(findMatchNCDS)
    }
    // console.log(_formGroupBy)
    return <div>
        <Table size='small' tableLayout='auto' dataSource={_formGroupBy} columns={columns}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '50', '100']}}
            title={() => <div className="flex justify-between items-center gap-2">
                <div className='flex items-center gap-2'>
                    ?????????????????????????????????????????????
                    <Tooltip title={"???????????????????????????????????????"}>
                        <button type="button" onClick={() => reload()} ><svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></Tooltip>
                </div>
                <div className='flex items-center gap-2'>
                    <Tooltip title={"???????????????????????????????????????????????????????????????"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setFormGroupBy(store)}
                            placeholder="????????????????????????????????????????????????" className='text-black rounded-md' /></Tooltip>
                    <Tooltip title={"???????????????"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
            </div>}
        />
    </div>
}
const ModalView = () => {
    const { setModalView, modalView, reload, } = useContext(ContextForm)
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
    if (modalView === false) return null
    return <Modal title={`???????????????????????? ${current + 1}. ${modalView.subForm[current].name}`}
        visible={modalView}
        okText={null}
        cancelText={<>??????????????????</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        className="w-full sm:w-1/2 "
        footer={<div className='w-full flex justify-end gap-3'>
            {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    ???????????????????????????????????????
                </Button>
            )}
            {current < modalView.subForm.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                    ??????????????????????????????
                </Button>
            )}
            {current === modalView.subForm.length - 1 && (
                <Button type="ghost" onClick={onCancel}>
                    ?????????
                </Button>
            )}
        </div>}>
        ????????????????????????
        <div className="steps-content">
            <List
                itemLayout="horizontal"
                dataSource={modalView.subForm[current].choice}
                renderItem={({ name, detail, score }, ind) => (
                    <List.Item>
                        <List.Item.Meta

                            title={`${ind + 1}. ${name}`}
                            description={`${detail ? `???????????????????????? ${detail}\n` : ""}??????????????? ${score} `}
                        />
                    </List.Item>
                )}
            />
        </div>
    </Modal>

}

const TableFormSub = () => {

    const { _formGroupBy, setFormGroupBy, reload,
        setModalView,
        modalViewSubForm, setModalViewSubForm,
        modalAddSubForm, setModalAddSubForm,
        setModalEdit,
        loading, store } = useContext(ContextForm)
    const inputRef = useRef()
    const [saveId, setSaveId] = useState(null)
    useEffect(() => {
        // console.log(_formGroupBy,modalViewSubForm,_formGroupBy[modalViewSubForm]?.id)
        setSaveId(_formGroupBy[modalViewSubForm].id)

    }, [_formGroupBy, modalViewSubForm])
    // const _ =  _formGroupBy[modalViewSubForm].data.map(({id,...rest})=>({id:id,key:id,...rest}))
    // const [data, setData] = useState(_)
    // console.log(data)
    useEffect(() => { }, [_formGroupBy, setFormGroupBy, store])
    const [selectRows, setSelectRows] = useState([])
    const columns = [
        {
            title: <div className="text-left" >?????????????????????</div>,
            dataIndex: 'title',
            key: 'title',
            render: val => <Tooltip title={`${val}`} ><div >{val}</div></Tooltip>
        },
        {
            title: <div className="text-center" >??????????????????????????????</div>,
            dataIndex: 'subForm',
            key: 'subForm',
            sorter: (a, b) => a.subForm.length - b.subForm.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <div className="text-center" >???????????????????????????????????????</div>,
            dataIndex: 'subForm',
            key: 'subForm',
            sorter: (a, b) => a.subForm.map(({ choice }) => choice.length).reduce((a, b) => a + b) - b.subForm.map(({ choice }) => choice.length).reduce((a, b) => a + b),
            render: val => <Tooltip><Paragraph align="center" ellipsis={ellipsis}>{val.map(({ choice }) => choice.length).reduce((a, b) => a + b)}</Paragraph></Tooltip>
        },
        {
            title: <div className="text-left" >???????????????????????????????????????</div>,
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(val)}>??????</button>
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(val)}>???????????????</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val, reload)}>??????</button>
            </div>,
        },

    ];
    const search = () => {
        const userInput = inputRef.current.value
        const findMatchNCDS = _formGroupBy[modalViewSubForm].data.filter(val => {
            return val.title.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatchNCDS)
        if (!userInput) {
            setFormGroupBy(store)
        }
        else if (findMatchNCDS?.length <= 0) {
            setFormGroupBy(store)
            notification.error({ message: "?????????????????????????????????" })
        }
        else {
            const reFormG = store.map((v, i) => {
                if (i === modalViewSubForm) {
                    return { ...v, data: findMatchNCDS }
                } else {
                    return { ...v }
                }
            })
            setFormGroupBy(reFormG)
        }
    }
    // console.log(_formGroupBy[modalViewSubForm])
    if (!!!_formGroupBy[modalViewSubForm]) return null
    if (saveId !== _formGroupBy[modalViewSubForm].id && saveId !== null) {
        // console.log(saveId,_formGroupBy[modalViewSubForm].id)
        notification.error({ message: "???????????????????????????????????????????????????????????????" })
        setModalViewSubForm(-1)
    }
    const showConfirmDelRows = async () => {
        console.log("delete", selectRows)
        if (selectRows.length <= 0) {
            notification.error({ message: "?????????????????????????????????????????????????????????" })
            return
        }
        const userCon = await new Promise(async (resolve, reject) => {
            let id = []
            for (const rows of selectRows) {
                const a = await new Promise((res, rej) => {
                    confirm({
                        title: `????????????????????????????????????????????????????????????????????????`,
                        content: <div>
                            <p>{rows.title}</p>
                            {/* <p>???????????????????????? : {rows.imply}</p> */}
                        </div>,
                        okText: "????????????",
                        cancelText: "??????????????????",
                        async onOk() { res(rows.id) },
                        onCancel() { rej(); },
                    })
                })
                id.push(a)
            }
            console.log("delete", id)
            const res = await fetch("/api/getForm", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify({ id: id })
            })
            if (res.status === 200) {
                notification.success({
                    message: '??????????????????????????????????????????',
                })
                setSelectRows([])
                await reload()
            } else if (res.status === 400) {
                notification.error({
                    message: '????????????????????????????????????????????????????????????',
                    description: '???????????????????????????????????????????????? ',
                })
            } else {
                notification.error({
                    message: '????????????????????????????????????????????????????????????',
                    description: '????????????????????????????????????????????? server ',
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
    return <div className=''>
        <div className='flex gap-2 justify-end items-end flex-row '>
            <button className="  hover:bg-gray-200 " onClick={() => setModalAddSubForm(_formGroupBy[modalViewSubForm])}>????????????????????????</button>
            {/* <button className="  bg-red-400 hover:bg-red-500 " onClick={() => deleteAll(_formGroupBy[modalViewSubForm].data, reload, setModalViewSubForm)}>???????????????????????????</button> */}
        </div>
        <Table size='small' tableLayout='auto' dataSource={_formGroupBy[modalViewSubForm].data} columns={columns}
            rowSelection={{ ...rowSelection }}
            title={() => <div className="flex items-center justify-between gap-2">
                <div className='flex items-center gap-2'>
                    ????????????????????????????????????????????? {_formGroupBy[modalViewSubForm]?.name_th}
                    <Tooltip title={"???????????????????????????????????????"}><button type="button" onClick={() => reload()} >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    </Tooltip>
                </div>
                <div className='flex items-center gap-2'>
                    {selectRows?.length > 0 && <div className='flex gap-2 text-md'>
                        <Button_Delete className='text-gray-200' fx={() => showConfirmDelRows()} title={"????????????????????????????????????????????????"} ></Button_Delete>
                    </div>}
                    <Tooltip title={"????????????????????????????????????"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setFormGroupBy(store)} placeholder="?????????????????????" className='text-black rounded-md' /></Tooltip>
                    <Tooltip title={"???????????????"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
            </div>}
        // footer={() => 'Footer'} 
        />
    </div>
}


const ModalViewSubForm = () => {
    const { reload,
        _formGroupBy,
        modalViewSubForm, setModalViewSubForm,
    } = useContext(ContextForm)
    useEffect(() => { }, [_formGroupBy])
    if (!!!_formGroupBy[modalViewSubForm]) return null
    return <Modal title={`?????????????????????????????? ${_formGroupBy[modalViewSubForm]?.name_th}`}
        visible={!!_formGroupBy[modalViewSubForm]}
        okText={null}
        cancelText={<>??????????????????</>}
        // onOk={onSubmit}
        onCancel={() => setModalViewSubForm(-1)}
        className="w-full sm:w-1/2 "
        width={"100%"}
        forceRender
        footer={null}>

        <TableFormSub />
    </Modal>

}

const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload, _form, NCDS } = useContext(ContextForm)
    const [form] = Form.useForm();
    const [ncds, setNcds] = useState()

    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);
    useEffect(() => {
        (async () => {
            if (modalAdd && Array.isArray(NCDS)) {
                if (!!_form && _form.length > 0) {
                    const counts = {};
                    _form.forEach(({ ncdsId }) => {
                        counts[ncdsId] = (counts[ncdsId] || 0) + 1;
                    });
                    setNcds(NCDS.filter(({ id }) => (counts[id] <= 0) || !counts[id]))
                } else {
                    setNcds(NCDS)
                }
            }
        })()
    }, [NCDS, _form, modalAdd])
    const onReset = () => {
        form.setFieldsValue();
    }
    const onOk = async (val) => {
        val = val.form.map(f => {
            f["subForm"] = f?.subForm?.map((subForm) => {
                return {
                    ...subForm,
                    choice: { create: subForm.choice.map(choice => { return { ...choice, score: parseInt(choice.score) } }) }
                }
            })
            f["subForm"] = { create: [...f["subForm"]] }
            f["ncdsId"] = val.ncdsId
            return f
        })
        console.log(val)
        // return
        const res = await fetch(`/api/getForm?addForm=true`, {
            method: "POST",
            body: JSON.stringify(val)
        })
            .then(async res => {
                if (res.ok) {
                    form.resetFields();
                    notification.success({ message: "????????????????????????????????????????????????????????????" })
                    setModalAdd(false)
                } else {
                    const json = await res.json()
                    notification.error({ message: `????????????????????????????????????????????????????????????????????????`, description: json.statusText })
                }
            })
        await reload()
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    return <Modal title={"???????????????????????????????????????????????????????????????"}
        visible={modalAdd}
        okText={<>????????????</>}
        cancelText={<>??????????????????</>}
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
                label="????????????????????????????????????"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="???????????????????????????????????????????????????"
                    optionFilterProp="children"
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.List name="form" rules={[{ required: true, message: "????????????????????????????????????????????????????????????????????????" }]}>
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
                                        <div className="text-lg text-blue-500">???????????????????????????????????????????????? {ind + 1}</div> <Tooltip title={"???????????????????????? " + (ind + 1)}><Button_Delete fx={() => remove(field.name)} /></Tooltip>
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    label={`?????????????????????????????? ${ind + 1}`}
                                    name={[field.name, 'title']}
                                    fieldKey={[field.fieldKey, 'title']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="???????????? ???????????????????????????????????????????????????????????????????????????" />
                                </Form.Item>
                                <Form.List name={[field.name, 'subForm']} rules={[{ required: true, message: "????????????????????????????????????????????????" }]} >
                                    {(subForm, { add, remove }, { errors }) =>
                                    (
                                        <>
                                            {!!subForm && subForm.map((fieldsubForm, ind2) => (
                                                <Form.Item
                                                    {...subForm}
                                                    noStyle
                                                    shouldUpdate
                                                    key={fieldsubForm.key}
                                                    required
                                                >
                                                    {/* {console.log(form.getFieldValue("form")[ind]?.subForm)} */}
                                                    <Collapse defaultActiveKey={{}} ghost collapsible="header" >
                                                        <Panel showArrow={false} header={<Form.Item
                                                            label={<>???????????????????????????????????? {ind2 + 1} <Button_Delete fx={() => remove(fieldsubForm.name)} /></>}
                                                            name={[fieldsubForm.name, 'name']}
                                                            fieldKey={[fieldsubForm.fieldKey, 'name']}
                                                            rules={[{ required: true }]}
                                                        >
                                                            <Input placeholder="???????????? ???????????????????????????????????????????????????????????????????????????" />
                                                        </Form.Item>} key={ind2}>
                                                            {form.getFieldValue("form")[ind]?.subForm?.length > 1 && <Form.Item
                                                                label={<>??????????????????????????????</>}
                                                                labelCol={{ span: 3, offset: 1 }}
                                                            // name={[fieldsubForm.name, 'pattern']}
                                                            // fieldKey={[fieldsubForm.fieldKey, 'pattern']}

                                                            >
                                                                <Select
                                                                    showSearch
                                                                    placeholder="?????????????????????????????????????????????"
                                                                    defaultValue={false}
                                                                    onChange={v => {
                                                                        if (v !== false) {
                                                                            let data = form.getFieldValue("form")
                                                                            const selectData = data[ind]?.subForm[v].choice
                                                                            data[ind].subForm[ind2] = { ...data[ind].subForm[ind2], choice: selectData }
                                                                            console.log(data[ind].subForm[ind2])
                                                                            form.setFieldsValue(data)
                                                                        }
                                                                    }}
                                                                >
                                                                    {form.getFieldValue("form")[ind]?.subForm.map((subForm, ind) => !!subForm && <Option key={`${ind}.${subForm?.name}`} value={ind}>???????????????????????????????????? {ind + 1}. {subForm?.name}</Option>)}
                                                                    <Option value={false}>?????????????????????</Option>
                                                                </Select>
                                                            </Form.Item>}
                                                            <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "?????????????????????????????????????????????????????????" }]} >
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
                                                                                {/* <Form.Item label={`????????????????????????????????????????????? ${ind + 1}`}><Divider /></Form.Item> */}
                                                                                <div className='mx-auto sm:flex justify-center'>
                                                                                    <Form.Item
                                                                                        label={"????????????????????????????????????"}
                                                                                        name={[fieldchoice.name, 'name']}
                                                                                        fieldKey={[fieldchoice.fieldKey, 'name']}
                                                                                        rules={[{ required: true }]}
                                                                                        labelCol={{ span: 10 }}
                                                                                    >
                                                                                        <Input placeholder="???????????? ??????????????????????????????" />
                                                                                    </Form.Item>
                                                                                    <Form.Item
                                                                                        label="??????????????????????????????"
                                                                                        name={[fieldchoice.name, 'detail']}
                                                                                        fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                                                        rules={[{ required: false }]}
                                                                                        labelCol={{ span: 10 }}
                                                                                    >
                                                                                        <TextArea rows={1} placeholder="??????????????????????????????" />
                                                                                    </Form.Item>
                                                                                    <Form.Item
                                                                                        label="???????????????"
                                                                                        labelCol={{ span: 10 }}
                                                                                        name={[fieldchoice.name, 'score']}
                                                                                        fieldKey={[fieldchoice.fieldKey, 'score']}
                                                                                        rules={[{ required: true }, {
                                                                                            pattern: /^[0-9.]+$/,
                                                                                            message: '??????????????????????????????',
                                                                                        }]}>
                                                                                        <InputNumber min="0" max="5" step="1" stringMode={false} placeholder="??????????????? 0 - 5" />
                                                                                    </Form.Item>
                                                                                    <Form.Item labelCol={{ span: 1 }} >
                                                                                        <div className="flex gap-2 ml-2">
                                                                                            <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>??????</button>
                                                                                            {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>???????????????</button>}
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
                                                                                <span className="text-blue-500">???????????????????????????????????????</span>
                                                                            </button>
                                                                        </div>}
                                                                        <Form.ErrorList errors={errors} />
                                                                        <hr className='w-1/2 mx-auto' />
                                                                    </>

                                                                )}
                                                            </Form.List>
                                                        </Panel>
                                                    </Collapse>
                                                </Form.Item>
                                            ))}
                                            <div className="flex justify-center ">
                                                <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                                    onClick={() => add()}
                                                    type="button">
                                                    <PlusOutlined />
                                                    <span className="text-blue-900">??????????????????????????????</span>
                                                </button>
                                            </div>

                                            <Form.ErrorList errors={errors} />
                                        </>

                                    )
                                    }
                                </Form.List>
                            </Form.Item>))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">??????????????????????????????????????????????????????</span>
                            </button>
                        </div>

                        <Form.ErrorList errors={errors} />
                    </>
                )}
            </Form.List>
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">?????????????????????</Button>
                <Button type="primary" htmlType="submit">?????????????????????????????????</Button>
            </div>
        </Form>

    </Modal>
}
const ModalEdit = () => {
    const { modalEdit, setModalEdit, reload, NCDS } = useContext(ContextForm)
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
            notification.error({ message: "?????????????????????????????????????????????????????????????????????" })
            return
        } else if (!val.subForm.map(({ choice }) => choice).every(arr => Array.isArray(arr) && arr.length > 0)) {
            notification.error({ message: "?????????????????????????????????????????????" })
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
                    await reload()
                    notification.success({ message: "????????????????????????????????????????????????????????????" })
                    setModalEdit(null)
                } else {
                    notification.error({ message: `?????????????????????????????????????????????????????????????????????` })
                }
            })
    }
    const onCancel = () => {
        setModalEdit(null)
    }
    const onReset = () => {
        form.setFieldsValue();
    }
    return <Modal title={"???????????????????????????????????????????????????????????????"}
        visible={modalEdit}
        okText={<>????????????</>}
        cancelText={<>??????????????????</>}
        footer={<></>}
        zIndex={10000}
        // onOk={onOk}
        onCancel={onCancel}
        forceRender
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
                label="????????????????????????????????????"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="???????????????????????????????????????????????????"
                    optionFilterProp="children"
                    disabled
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                label="?????????????????????"
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.List name="subForm" rules={[{ required: true, message: "????????????????????????????????????????????????" }]} >
                {(subForm, { add, remove }, { errors }) => (
                    // 
                    <>

                        {!!subForm && subForm.map((fieldsubForm, ind) => (
                            <Form.Item
                                {...subForm}
                                noStyle
                                shouldUpdate
                                key={fieldsubForm.key}
                                required
                            >
                                <Collapse defaultActiveKey={0} ghost collapsible="header" >
                                    <Panel showArrow={false} header={<Form.Item
                                        label={<>???????????????????????????????????? {ind + 1} <Button_Delete fx={() => remove(fieldsubForm.name)} /></>}
                                        name={[fieldsubForm.name, 'name']}
                                        fieldKey={[fieldsubForm.fieldKey, 'name']}
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="???????????? ???????????????????????????????????????????????????????????????????????????" />
                                    </Form.Item>} key="1">
                                        {form.getFieldValue("subForm").length > 1 && <Form.Item
                                            label={<>??????????????????????????????</>}
                                            labelCol={{ span: 3, offset: 1 }}
                                        // name={[fieldsubForm.name, 'pattern']}
                                        // fieldKey={[fieldsubForm.fieldKey, 'pattern']}

                                        >
                                            <Select
                                                showSearch
                                                placeholder="?????????????????????????????????????????????"
                                                defaultValue={false}
                                                onChange={v => {
                                                    if (v !== false) {
                                                        let data = form.getFieldValue("subForm")
                                                        const selectData = data[v].choice
                                                        data[ind] = { ...data[ind], choice: selectData }
                                                        console.log(selectData)
                                                        form.setFieldsValue({ "subForm": data })
                                                    }
                                                }}
                                            >
                                                {form.getFieldValue("subForm").map((subForm, ind) => !!subForm && <Option key={`${ind}.${subForm?.name}`} value={ind}>???????????????????????????????????? {ind + 1}. {subForm?.name}</Option>)}
                                                <Option value={false}>?????????????????????</Option>
                                            </Select>
                                        </Form.Item>}
                                        <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "?????????????????????????????????????????????????????????" }]} >
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
                                                            {/* <Form.Item label={`????????????????????????????????????????????? ${ind + 1}`}><Divider /></Form.Item> */}
                                                            <div className='mx-auto sm:flex justify-center'>
                                                                <Form.Item
                                                                    label={"????????????????????????????????????"}
                                                                    name={[fieldchoice.name, 'name']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'name']}
                                                                    rules={[{ required: true }]}
                                                                    labelCol={{ span: 10 }}
                                                                >
                                                                    <Input placeholder="???????????? ??????????????????????????????" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="??????????????????????????????"
                                                                    name={[fieldchoice.name, 'detail']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                                    rules={[{ required: false }]}
                                                                    labelCol={{ span: 10 }}
                                                                >
                                                                    <TextArea rows={1} placeholder="??????????????????????????????" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="???????????????"
                                                                    labelCol={{ span: 10 }}
                                                                    name={[fieldchoice.name, 'score']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'score']}
                                                                    rules={[{ required: true }, {
                                                                        pattern: /^[0-9.]+$/,
                                                                        message: '??????????????????????????????',
                                                                    }]}>
                                                                    <InputNumber min="0" max="5" step="1" stringMode={false} placeholder="??????????????? 0 - 5" />
                                                                </Form.Item>
                                                                <Form.Item labelCol={{ span: 1 }} >
                                                                    <div className="flex gap-2 ml-2">
                                                                        <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>??????</button>
                                                                        {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>???????????????</button>}
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
                                                            <span className="text-blue-500">???????????????????????????????????????</span>
                                                        </button>
                                                    </div>}
                                                    <Form.ErrorList errors={errors} />
                                                    <hr className='w-1/2 mx-auto' />
                                                </>
                                            )}
                                        </Form.List>
                                    </Panel>
                                </Collapse>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">??????????????????????????????</span>
                            </button>
                        </div>

                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">?????????????????????</Button>
                <Button type="primary" htmlType="submit">?????????????????????????????????</Button>
            </div>
        </Form>

    </Modal>
}
const ModalAddSubForm = () => {
    const { modalAddSubForm, setModalAddSubForm, setModalViewSubForm, reload, _form, NCDS } = useContext(ContextForm)
    const [form] = Form.useForm();

    useEffect(() => {
        !!modalAddSubForm && form.setFieldsValue({
            ncdsId: modalAddSubForm.ncdsId
        });
    }, [form, modalAddSubForm]);
    const onReset = () => {
        form.setFieldsValue({
            ncdsId: modalAddSubForm.ncdsId
        });
    }
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
                if (res.status === 404) {
                    notification.error({ title: `?????????????????????????????????????????????????????????????????????`, message: "???????????????????????????????????????????????????" })
                }
                else if (res.ok) {
                    notification.success({ message: "????????????????????????????????????????????????????????????" })
                    onReset()
                    setModalAddSubForm(false)
                    await reload()
                } else {
                    notification.error({ message: `?????????????????????????????????????????????????????????????????????` })
                }
            })

    }
    const onCancel = () => {
        setModalAddSubForm(false)
    }

    return <Modal title={"??????????????????????????????????????????????????????"}
        visible={modalAddSubForm}
        okText={<>????????????</>}
        cancelText={<>??????????????????</>}
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
                label="????????????????????????????????????"
                rules={[{ required: true }]}>
                <Select
                    showSearch
                    placeholder="???????????????????????????????????????????????????"
                    optionFilterProp="children"
                    disabled
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!NCDS && NCDS.map(({ name_th, name_en, id }, ind) => <Option key={ind} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            <Form.Item
                name="title"
                label="?????????????????????"
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.List name="subForm" rules={[{ required: true, message: "????????????????????????????????????????????????" }]} >
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
                                <Collapse defaultActiveKey={0} ghost collapsible="header" >
                                    <Panel showArrow={false} header={<Form.Item
                                        label={<>???????????????????????????????????? {ind + 1} <Button_Delete fx={() => remove(fieldsubForm.name)} /></>}
                                        name={[fieldsubForm.name, 'name']}
                                        fieldKey={[fieldsubForm.fieldKey, 'name']}
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="???????????? ???????????????????????????????????????????????????????????????????????????" />
                                    </Form.Item>} key="1">

                                        {form.getFieldValue("subForm").length > 1 && <Form.Item
                                            label={<>??????????????????????????????</>}
                                            labelCol={{ span: 3, offset: 1 }}
                                        // name={[fieldsubForm.name, 'pattern']}
                                        // fieldKey={[fieldsubForm.fieldKey, 'pattern']}

                                        >
                                            <Select
                                                showSearch
                                                placeholder="?????????????????????????????????????????????"
                                                defaultValue={false}
                                                onChange={v => {
                                                    if (v !== false) {
                                                        let data = form.getFieldValue("subForm")
                                                        const selectData = data[v].choice
                                                        data[ind] = { ...data[ind], choice: selectData }
                                                        console.log(selectData)
                                                        form.setFieldsValue({ "subForm": data })
                                                    }
                                                }}
                                            >
                                                {form.getFieldValue("subForm").map((subForm, ind) => !!subForm && <Option key={`${ind}.${subForm?.name}`} value={ind}>???????????????????????????????????? {ind + 1}. {subForm?.name}</Option>)}
                                                <Option value={false}>?????????????????????</Option>
                                            </Select>
                                        </Form.Item>}


                                        <Form.List name={[fieldsubForm.name, 'choice']} rules={[{ required: true, message: "?????????????????????????????????????????????????????????" }]} >
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
                                                            {/* <Form.Item label={`????????????????????????????????????????????? ${ind + 1}`}><Divider /></Form.Item> */}
                                                            <div className='mx-auto sm:flex justify-center'>
                                                                <Form.Item
                                                                    label={"????????????????????????????????????"}
                                                                    name={[fieldchoice.name, 'name']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'name']}
                                                                    rules={[{ required: true }]}
                                                                    labelCol={{ span: 10 }}
                                                                >
                                                                    <Input placeholder="???????????? ??????????????????????????????" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="??????????????????????????????"
                                                                    name={[fieldchoice.name, 'detail']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'detail']}
                                                                    rules={[{ required: false }]}
                                                                    labelCol={{ span: 10 }}
                                                                >
                                                                    <TextArea rows={1} placeholder="??????????????????????????????" />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="???????????????"
                                                                    labelCol={{ span: 10 }}
                                                                    name={[fieldchoice.name, 'score']}
                                                                    fieldKey={[fieldchoice.fieldKey, 'score']}
                                                                    rules={[{ required: true }, {
                                                                        pattern: /^[0-9.]+$/,
                                                                        message: '??????????????????????????????',
                                                                    }]}>
                                                                    <InputNumber min="0" max="5" step="1" stringMode={false} placeholder="??????????????? 0 - 5" />
                                                                </Form.Item>
                                                                <Form.Item labelCol={{ span: 1 }} >
                                                                    <div className="flex gap-2 ml-2">
                                                                        <button className="button bg-red-300" onClick={() => remove(fieldchoice.name)}>??????</button>
                                                                        {ind === choice.length - 1 && <button className="button bg-green-300" onClick={() => add()}>???????????????</button>}
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
                                                            <span className="text-blue-500">???????????????????????????????????????</span>
                                                        </button>
                                                    </div>}
                                                    <Form.ErrorList errors={errors} />
                                                    <hr className='w-1/2 mx-auto' />
                                                </>

                                            )}
                                        </Form.List>


                                    </Panel>
                                </Collapse>
                            </Form.Item>
                        ))}
                        <div className="flex justify-center ">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">??????????????????????????????</span>
                            </button>
                        </div>

                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>

            <div className="flex justify-end gap-2 sm:mt-0 mt-3">
                <Button htmlType="reset">?????????????????????</Button>
                <Button type="primary" htmlType="submit">?????????????????????????????????</Button>
            </div>
        </Form>

    </Modal>
}

const showConfirmDel = async (val, reload) => {
    let del = true
    confirm({
        title: <>????????????????????????????????????????????????????????????????????????</>,
        content: <ul>
            <li> ????????????????????? : {val.title} </li><br />
            {val.subForm.map(({ name, choice }, ind) =>
                <li key={name}>{ind + 1}. {name} <br />
                    {choice.map(({ name, score }, ind2) => <li key={name} className="ml-3">{ind + 1}.{ind2 + 1} {name}</li>)}
                </li>)}
        </ul>,
        okType: 'danger',
        okText: "???????????????????????????",
        cancelText: "??????????????????",
        async onOk() {
            const res = await fetch("/api/getForm", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify({ id: val.id })
            })
            if (res.status === 200) {
                notification.success({
                    message: '??????????????????????????????????????????',
                })
                await reload()

            } else {
                notification.error({
                    message: '????????????????????????????????????????????????????????????',
                    description: '????????????????????????????????????????????? server ',
                })
            }
        },
        onCancel() { },
    });
}
const deleteAll = async (vals, reload, setModalViewSubForm) => {
    confirm({
        title: <>????????????????????????????????????????????????????????????????????????</>,
        content: <ul>
            {vals.map(val => {
                return <li key={val.id}>???????????? : {val.title}<br />
                    {val.subForm.map(({ name, choice }, ind) =>
                        <li key={name}>{ind + 1}. {name} <br />
                            {choice.map(({ name, score }, ind2) => <li key={name} className="ml-3">{ind + 1}.{ind2 + 1} {name}</li>)}
                        </li>)}</li>
            })}
        </ul>,
        okType: 'danger',
        okText: "???????????????????????????",
        cancelText: "??????????????????",
        async onOk() {
            const res = await fetch("/api/getForm?allForm=true", {
                headers: { 'Content-Type': 'application/json', },
                method: "DELETE",
                body: JSON.stringify(vals)
            })
            if (res.status === 200) {
                notification.success({
                    message: '??????????????????????????????????????????',
                })
                setModalViewSubForm(null)
            } else {
                notification.error({
                    message: '????????????????????????????????????????????????????????????',
                    description: '????????????????????????????????????????????? server ',
                })
            }
            await reload()
        },
        onCancel() { },
    });
}
const FetchNCDS = async () => {
    const req = await fetch("/api/getNCDS?select=name_th,name_en,id")
    if (req.status === 200) {
        const data = await req.json()
        return data
    }
    return null
}

const Chart = ({ NCDS,
    _form,
    _formGroupBy }) => {
    const [color, setColor] = useState()
    useEffect(() => {
        if (!!_formGroupBy) {
            setColor([_formGroupBy.map(v => v.data.map(() => randomRGB())), _formGroupBy.map(() => randomRGB())])
        }
    }, [_formGroupBy])
    if (!!!_form || !!!_formGroupBy || !color) return <div className="flex gap-3 flex-wrap justify-center bg-gray-900 py-20 mb-5 rounded-sm">
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center" />
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center" />
    </div>
    // console.log(color)



    // const ncds_data = data.ncds.map(({ name, count }) => ({ name, value: count }))
    return (
        <div className="flex gap-3 flex-wrap justify-center bg-gray-900 py-20 mb-5 rounded-sm">
            {_formGroupBy?.map((v, ind) => <div key={ind} className="h-80 w-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">??????????????????????????????{v.name_th}</p><Doughnut data={{
                labels: v.data.map(({ title }) => title),
                datasets: [{
                    data: v.data.map(({ subForm }) => subForm.length),
                    backgroundColor: color[0][ind],
                    borderWidth: 0,
                }],
            }} />
            </div>)}
            <div className="w-72 h-80 bg-blue-50 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">????????????????????????????????????</p><Doughnut data={{
                labels: _formGroupBy.map(({ name_th }) => name_th),
                datasets: [{
                    //  data =>_formGroupBy => subForm => choice => score
                    data: _formGroupBy.reduce((acc, val) => [...acc, val.data.reduce((acc2, val2) => acc2 + val2.subForm.reduce((acc3, val3) => acc3 + val3.choice.reduce((acc4, val4) => acc4 + val4.score, 0), 0), 0)], []),
                    backgroundColor: color[1],
                    borderWidth: 0,
                }],
            }} />
            </div>
        </div>)
}
const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;