import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Button, Table, Divider, Typography, Select, Modal, Spin, Form, Input, Upload, notification, InputNumber, Space, Tooltip } from 'antd'
import CusImage from '/components/cusImage';
import { Button_Delete } from '/ulity/button';
import ReactPlayer from 'react-player';
import { useRouter, } from 'next/router'

// Report
import { FilePdfOutlined, DownloadOutlined, UploadOutlined,EyeOutlined, MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CSVLink } from "react-csv"
import { Chart as ChartJS, ArcElement, Tooltip as Too, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment'
import 'moment/locale/th'
moment.locale('th')
ChartJS.register(ArcElement, Too, Legend);
// END Report


// import {blogs} from '@prisma/client'

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
    const [blogs, setBlogs] = useState([])
    const [store, setStore] = useState([])
    const [ncdsLoading, setNCDSLoading] = useState()
    const [foodLoading, setFoodLoading] = useState()
    const [ncds, setNCDS] = useState()
    const [food, setFood] = useState()


    const inputRef = useRef()
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const columns = [
        {
            title: 'ประเภทบทความ',
            dataIndex: 'type',
            key: 'type',
            render: val => <div >
                {val === "NCDS" ? "โรคไม่ติดต่อ" : val === "FOOD" ? "อาหาร" || val === "ALL" : "อาหารและโรค"}
            </div>
        },
        {
            title: 'ชื่อบทความ',
            dataIndex: 'name',
            key: 'name',
            width: "10%",
            render: val => <div >{val}</div>
        },
        {
            title: 'คำอธิบาย',
            dataIndex: 'imply',
            key: 'imply',
            width: "20%",
            render: val => <div >{val}</div>
        },

        {
            title: 'ชื่อหัวข้อย่อย',
            dataIndex: 'subBlog',
            key: 'subBlog',
            render: val => <>{val.map((v, ind) => <div key={ind} className="text-left" >{ind + 1}. {v.name}</div>)}</>
        },
        {
            title: 'ความสัมพันธ์',
            dataIndex: 'related',
            key: 'related',
            render: val => <>{val?.map((v, ind) => <div key={ind}>{ind + 1}. {v?.ncds?.name_th || v?.Foods?.name_th}</div>)}</>
        },
        {
            title: 'ผลโหวต',
            dataIndex: 'avg_vote',
            key: 'avg_vote',
            render: (val) => <div className="text-center" ellipsis={ellipsis}>{val >= 0 ? val : 0}</div>
        },
        {
            title: <div className='text-center'>การอนุมัติ</div>,
            dataIndex: 'approve',
            key: 'approve',
            render: (val, source) => <button className="w-full ml-3 mb-2" >
                {val === 1 ? <Tooltip title="อนุมัติ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg></Tooltip>
                    : val === 2 ?
                        <Tooltip title="ไม่อนุมัติ"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg></Tooltip>
                        : <Tooltip title="รออนุมัติ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Tooltip>
                }
            </button>
        },
    ];

    const reload = async () => {
        setLoading(true)
        const reqBlogs = await fetch("/api/getBlogs?approve=true")
            .then(res => res.status === 200 && res.json())
            .then(data => {
                if (!!data && data.length > 0) {
                    const _ = data.map(({ id, ...rest }) => ({ key: id, id: id, ...rest }))
                    setBlogs(_)
                    setStore(_)
                }
            })
            .catch(err => notification.error({ message: "Error", description: err.message }))
        setLoading(false)
    }

    useEffect(() => {
        (async () => {
            setNCDSLoading(true)
            reload()
            const req_ncds = await fetch('/api/getNCDS?select=id,name_th,name_en')
                .then(async resp => resp.ok && resp.json())
                .then(data => setNCDS(data)).catch(err => notification.error({ message: "Error", description: err.message }))
            setNCDSLoading(false)
            setFoodLoading(true)
            const req_food = await fetch('/api/getFood?select=id,name_th,name_en')
                .then(async resp => resp.ok && resp.json())
                .then(data => setFood(data)).catch(err => notification.error({ message: "Error", description: err.message }))
            setFoodLoading(false)
        })()
        return () => setBlogs([])
    }, [])
    return (
        <div className="ease-div flex flex-col gap-4 w-full">
            <Chart ncds={ncds} food={food} blogs={blogs} />
            <hr />
            <div className="flex justify-end mt-4">
                <div className="flex gap-3">
                    <Button onClick={() => { componentRef.current.style.display = "block"; handlePrint(); componentRef.current.style.display = "none"; }} type="ghost" danger><FilePdfOutlined /> PDF </Button>
                    <Button className='green-ghost-green' icon={<DownloadOutlined />}>
                        <CSVLink
                            filename={`ตารางบทความ ${inputRef.current?.value}-${moment().format("LLLL")}.csv`}
                            data={blogs.map(({ name, imply, type, video, approve, avg_vote, total_vote, views }) => ({ name, imply, type, video, approve, avg_vote, total_vote, views }))}
                            onClick={() => notification.success({ message: "ดาวน์โหลดไฟล์" })}
                        >
                            <span className="text-green-500">CSV</span>
                        </CSVLink>
                    </Button>
                    <Button onClick={() => setModalAdd(true)}>เพิ่มบทความ</Button>
                </div>
            </div>
            <Context.Provider value={{
                reload,
                modalAdd, setModalAdd,
                modalEdit, setModalEdit,
                modalView, setModalView,
                loading,
                ncds, food,
                ncdsLoading, foodLoading,
                blogs, setBlogs, store,
                inputRef
            }}>
                <ModalAdd />
                <ModalEdit />
                <ModalView />
                <TableForm />
            </Context.Provider>
            <div className='hidden' ref={componentRef}>
                <Table size='small' title={() => <span className="text-lg">บทความ {inputRef.current?.value}</span>} tableLayout='auto' pagination={false} dataSource={blogs} columns={columns} footer={() => <div className="flex justify-end"><span>พิมพ์ : {moment().format("LLLL")}</span></div>} />
            </div>
        </div>
    )
}



const TableForm = () => {
    const { blogs, setBlogs, store, reload, loading,
        setModalEdit,
        setModalView, inputRef } = useContext(Context)

    const [selectRows, setSelectRows] = useState([])

    const columns = [
        {
            title: 'ประเภทบทความ',
            dataIndex: 'type',
            key: 'type',
            filters: [{ text: 'โรคไม่ติดต่อ', value: "NCDS", }, { text: 'อาหาร', value: "FOOD", }, { text: 'อาหารและโรค', value: "ALL", }],
            onFilter: (value, record) => record.type === value,
            sorter: (a, b) => a.type.localeCompare(b.type),
            render: val => <Paragraph className='mt-3' >
                {val === "NCDS" ? "โรคไม่ติดต่อ" : val === "FOOD" ? "อาหาร" || val === "ALL" : "อาหารและโรค"}
            </Paragraph>
        },
        {
            title: 'ชื่อบทความ',
            dataIndex: 'name',
            key: 'name',

            render: val => <Tooltip title={val} ><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: 'คำอธิบาย',
            dataIndex: 'imply',
            key: 'imply',
            width: "20%",
            render: val => <Tooltip title={val}><Paragraph ellipsis={ellipsis}>{val}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: 'ผลโหวต',
            dataIndex: 'avg_vote',
            key: 'avg_vote',
            sorter: (a, b) => a.avg_vote.length - b.avg_vote.length,
            render: (val) => <Tooltip title={`${val >= 0 ? val : 0}/5`}><Paragraph align="center" ellipsis={ellipsis}>{val >= 0 ? val : 0}</Paragraph></Tooltip>
        },
        {
            responsive: ["md"],
            title: 'จำนวนหัวข้อย่อย',
            dataIndex: 'subBlog',
            key: 'subBlog',
            sorter: (a, b) => a.subBlog.length - b.subBlog.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            responsive: ["md"],
            title: 'จำนวนโรคที่เกี่ยวข้อง',
            dataIndex: 'related',
            key: 'related',
            sorter: (a, b) => a.related.length - b.related.length,
            render: val => <Paragraph align="center" ellipsis={ellipsis}>{val.length}</Paragraph>
        },
        {
            title: <div className='text-center'>การอนุมัติ</div>,
            dataIndex: 'approve',
            key: 'approve',
            filters: [{ text: 'รออนุมัติ', value: 0, }, { text: 'อนุมัติ', value: 1, }, { text: 'ไม่อนุมัติ', value: 2, }],
            onFilter: (value, record) => record.approve === value,
            sorter: (a, b) => a.approve - b.approve,
            render: (val, source) => <button className="w-full ml-3 mb-2" onClick={() => showConfirmApprove(source)}>
                {val === 1 ? <Tooltip title="อนุมัติ">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg></Tooltip>
                    : val === 2 ?
                        <Tooltip title="ไม่อนุมัติ"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg></Tooltip>
                        : <Tooltip title="รออนุมัติ">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Tooltip>
                }
            </button>
        },
        {
            title: 'การจัดการ',
            dataIndex: '',
            key: '',

            render: (text, val, index) => <div className="flex flex-wrap gap-2">
                <button className=" bg-gray-100 hover:bg-gray-200" onClick={() => setModalView(val)}>ดู</button>
                <button className=" bg-yellow-200 hover:bg-yellow-300" onClick={() => setModalEdit(val)}>แก้ไข</button>
                <button className=" bg-red-300 hover:bg-red-400" onClick={() => showConfirmDel(val)}>ลบ</button>
            </div>,
        },

    ];
    const showConfirmDel = async (val) => {
        console.log("delete", val)
        confirm({
            title: `คุณต้องการจะลบบทความ`,
            content: <div>
                <p>{val.name}</p>
                <p>ประเภท : {val.type}</p>
            </div>,
            okText: "ตกลง",
            okType: "danger",
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/getBlogs", {
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
            },
            onCancel() { },
        });
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
                            <p>{rows.name}</p>
                            <p>ประเภท : {rows.type}</p>
                        </div>,
                        okText: "ตกลง",
                        okType: "danger",
                        cancelText: "ยกเลิก",
                        async onOk() { res(rows.id) },
                        onCancel() { rej(); },
                    })
                })
                id.push(a)
            }
            console.log("delete", id)
            const res = await fetch("/api/getBlogs", {
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
    const showConfirmApprove = async (val) => {
        const { approve } = val
        const th_approve = approve === 0 ? "รอการอนุมัติ" : approve === 1 ? "อนุมัติ" || approve === 2 : "ไม่อนุมัติ"
        const th_request = approve === 0 ? "อนุมัติ" : approve === 1 ? "ไม่อนุมัติ" || approve === 2 : "อนุมัติ"
        const preData = { id: val.id, approve: approve === 0 ? 1 : approve === 1 ? 2 || approve === 2 : 1 }
        confirm({
            title: `คุณต้องการจะ${approve === 0 ? "อนุมัติ" : approve === 1 ? "ไม่อนุมัติ" || approve === 2 : "อนุมัติ"}`,
            content: <div>
                <p>หัวข้อ : {val.name}</p>
                <p>สถานะ : {th_approve}</p>
            </div>,
            okText: th_request,
            okType: approve === 0 || approve === 2 ? "primary" : "danger",
            cancelText: "ยกเลิก",
            async onOk() {
                const res = await fetch("/api/getBlogs", {
                    headers: { 'Content-Type': 'application/json', },
                    method: "PATCH",
                    body: JSON.stringify(preData)
                })
                if (res.status === 200) {
                    notification.success({
                        message: `${th_request}สำเร็จ`,
                    })
                    await reload()
                } else {
                    notification.error({
                        message: `${th_request}ไม่สำเร็จ`,
                        description: 'ไม่สามารถติดต่อ server ',
                    })
                }
            },
            onCancel() { },
        });
    }
    if (!blogs) return null
    const search = () => {
        let userInput = inputRef.current.value
        const findMatch = blogs.filter(val => {
            return val.name.toLowerCase().includes(userInput.toLowerCase()) || val.type.toLowerCase().includes(userInput.toLowerCase())
        })
        console.log(userInput, findMatch)
        if (!userInput) {
            setBlogs(store)
        }
        else if (findMatch?.length <= 0) {
            setBlogs(store)
            notification.error({ message: "ไม่พบข้อมูล" })
        }
        else setBlogs(findMatch)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectRows(selectedRows)
        },
    };


    return <div >
        <Table size='small' tableLayout='auto'
            dataSource={blogs} columns={columns}
            rowSelection={{ ...rowSelection }}
            title={() => <div className="flex justify-between items-center gap-2">
                <div className='flex items-center gap-2'>
                    ตารางบทความ
                    <Tooltip title={"ดึงข้อมูลใหม่"}>
                        <button type="button" onClick={() => reload()} ><svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading && "animate-spin text-indigo-600"} hover:text-indigo-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></Tooltip>
                </div>

                <div className='flex items-center gap-2'>

                    {selectRows?.length > 0 && <div className='flex gap-2 text-md'>
                        <Button_Delete className="text-gray-100" fx={() => showConfirmDelRows()} title={"ลบข้อมูลที่เลือก"} ></Button_Delete>
                    </div>}

                    <Tooltip title={"ค้นหาชื่อบทความ"}>
                        <input ref={inputRef} onKeyDown={(e) => e.key === 'Enter' ? search() : setBlogs(store)} placeholder="ชื่อบทความ" className='text-black rounded-md p-0.5' /></Tooltip>
                    <Tooltip title={"ค้นหา"}>
                        <button type="button" onClick={() => search()} ><SearchOutlined /></button></Tooltip>
                </div>
            </div>}
        />

    </div>
}
const ModalAdd = () => {
    const { modalAdd, setModalAdd, reload, ncds, food, ncdsLoading, foodLoading } = useContext(Context)
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [type, setType] = useState(null)
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue();
    }, [form, modalAdd]);


    const onOk = () => {
        setModalAdd(false)
    }
    const onCancel = () => {
        setModalAdd(false)
    }

    const onSubmit = async (val) => {
        if (!Array.isArray(val?.image?.fileList)) {
            notification.error({ message: "คุณไม่ได้เพิ่มรูปภาพ" })
            return
        }
        if (!Array.isArray(val?.subBlog)) {
            notification.error({ message: "คุณไม่ได้เพิ่มบทความย่อย" })
            return
        }
        const _tempimage = val?.image?.fileList
        console.log(val.subBlog)
        const _tempsubBlog = val?.subBlog.map((val) => {
            return {
                ...val,
                ...(val?.image?.fileList?.length > 0) && { image: val.image.fileList[0].response.name }
            }
        })
        delete val['image']
        delete val['subBlog']
        const subBlog = { create: _tempsubBlog }
        const image = { create: _tempimage.map(({ response }) => ({ name: response.name })) }
        val['image'] = image
        val['subBlog'] = subBlog
        let related = []
        if (val['foodId']) {
            related = [...related, ...val['foodId'].map((v) => { return { foodId: v } })]
            delete val['foodId']
        }
        if (val['ncdsId']) {
            related = [...related, ...val['ncdsId'].map((v) => { return { ncdsId: v } })]
            delete val['ncdsId']
        }
        val['related'] = { create: [...related] }
        val["ref"] = { create: [...val["ref"]] }
        console.log(val.related)
        // return
        const res = await fetch(`/api/getBlogs`, {
            headers: { 'Content-Type': 'application/json', },
            method: "POST",
            body: JSON.stringify(val)
        })

        // console.log('send:', val);
        if (res.status === 200) {
            notification.success({
                message: "เพิ่มข้อมูลสำเร็จ"
            })
            reload()
            setModalAdd(false)
            fetch(`/api/uploads`)
            setFileListSubBlogs([])
            setFileList([])
            form.resetFields();
        } else notification.error({
            message: 'ไม่สามารถเพิ่มข้อมูลได้',
            description: res.message,
        })

    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileListSubBlogs([])
        setFileList([])
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const onChangeSubBlogs = ({ fileList: newFileList }) => {
        setFileListSubBlogs(newFileList);
    }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    return <Modal title={"เพิ่มข้อมูลบทความ"}
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ span: 3 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภทความสัมพันธ์"
                labelAlign="left"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทความสัมพันธ์' }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onChange={onTypeChange}
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={`${name_en}_${ind}`} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>

            {(type === "NCDS" || type === "ALL") && <Form.Item
                labelCol={{ span: 3, offset: 3 }}
                labelAlign="left"
                name="ncdsId"
                label="เลือกโรค"
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={ncdsLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            {(type === "FOOD" || type === "ALL") && <Form.Item
                labelCol={{ span: 3, offset: 3 }}
                labelAlign="left"
                name="foodId"
                label="เลือกรายการอาหาร"
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={foodLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                labelAlign="left"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="คำอธิบาย"
                labelAlign="left"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำอธิบาย" />
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ"
                labelAlign="left"
                rules={[{ required: false }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน ที่อยู่(url) ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>
            <Form.Item
                name="image"
                label="รูปภาพ"
                labelAlign="left"
                rules={[{ required: true, message: 'กรุณาเลือกรูปภาพ' }]}>


                <Upload
                    multiple={true}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    defaultFileList={fileList}
                    onChange={onChange}
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList ? fileList?.length : 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" rules={[{ required: true, message: "คุณลืมเพิ่มหัวข้อย่อย" }]} >
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
                                <Form.Item
                                    {...field}
                                    labelCol={null}
                                    wrapperCol={0}
                                >
                                    <> {ind !== 0 && <Divider />}
                                        <div className="flex gap-3 items-center text-lg  justify-center pt-2 mb-4">
                                            <Button_Delete className="text-gray-800" fx={() => remove(field.name)} /><div > หัวข้อย่อยที่ {ind + 1}</div>
                                        </div>
                                    </>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    labelAlign="left"
                                    labelCol={{ span: 2, offset: 3 }}
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="ชื่อหัวข้อ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    labelAlign="left"
                                    labelCol={{ span: 2, offset: 3 }}
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder="เนื้อความ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'image']}
                                    labelCol={{ span: 2, offset: 3 }}
                                    fieldKey={[field.fieldKey, 'image']}
                                    label="รูปภาพ"
                                    labelAlign="left"
                                // rules={[{ required: true , message: 'กรุณาเลือกรูปภาพ' }]}
                                >

                                    <Upload
                                        multiple={true}
                                        accept='image/png,image/jpeg'
                                        maxCount={1}
                                        action="/api/uploads"
                                        listType="picture"
                                        defaultFileList={[]}
                                        // onChange={onChangeSubBlogs}
                                        className="upload-list-inline"
                                    >
                                        <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป</Button>
                                    </Upload>
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อย่อย</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" rules={[{ required: true, message: "คุณลืมเพิ่มอ้างอิง" }]} >
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
                                        <Button_Delete className="text-gray-800" fx={() => remove(field.name)} /> แหล่งอ้างอิงที่ {ind + 1}
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
            <div className="flex justify-end gap-2">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button type="primary" htmlType="submit">เพิ่มข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}
const ModalEdit = () => {
    const { modalEdit, setModalEdit, reload, ncds, food, ncdsLoading, foodLoading } = useContext(Context)
    const [type, setType] = useState(modalEdit?.type)
    const [fileList, setFileList] = useState([])
    const [fileListSubBlogs, setFileListSubBlogs] = useState([])
    const [form] = Form.useForm();

    useEffect(() => {
        if (modalEdit) {
            setFileList(modalEdit?.image || [])
            setFileListSubBlogs(modalEdit?.subBlog?.map(({ image }) => image) || [])
        }
        form.setFieldsValue(modalEdit);
        return () => {
            form.resetFields()
            setFileList([])
            setFileListSubBlogs([])
        }
    }, [form, modalEdit]);


    const onOk = () => {
        setModalEdit(false)
    }
    const onCancel = () => {
        setModalEdit(false)
    }

    const onSubmit = async (val) => {
        let _tempimage = []
        if (val?.image?.fileList) {
            for (const i in val.image.fileList) {
                const fL = val.image.fileList[i]
                fL.response ? _tempimage.push({ name: fL.response.name }) : _tempimage.push({ ...fL })

            }
        }
        else { _tempimage = val?.image }
        const _tempsubBlog = val?.subBlog.map((val) => {
            return {
                ...val,
                ...(val?.image?.fileList?.length > 0) && { image: val.image.fileList[0].response.name }
            }
        })
        // console.log(val.subBlog)
        delete val['image']
        delete val['subBlog']
        val['image'] = _tempimage
        val['subBlog'] = _tempsubBlog
        val['id'] = modalEdit.id
        let relatedFood = []
        let relatedNcds = []
        // console.log(val['foodId'], val['ncdsId'])
        // console.log(form.getFieldValue("related"))
        if (val['foodId']?.length > 0) {
            // console.log("loop food")
            if (modalEdit?.related?.length > 0) {
                for (const [kk, vv] of Object.entries(form.getFieldValue("related"))) {
                    val['foodId'].map((v) => {
                        if (vv.foodId === v) relatedFood.push({ id: vv.id, foodId: vv.foodId })
                        relatedFood.push({ foodId: v })
                    })
                }
                // console.log("food",relatedFood)
                relatedFood = relatedFood.filter((v, i, a) => a.findIndex(v2 => (v2.foodId === v.foodId)) === i)
            } else {
                val['foodId'].map(v => relatedFood.push({ foodId: v }))
            }
        }
        if (val['ncdsId']?.length > 0) {
            // console.log("loop ncds")
            if (modalEdit?.related?.length > 0) {
                for (const [kk, vv] of Object.entries(form.getFieldValue("related"))) {
                    val['ncdsId'].map((v) => {
                        if (vv.ncdsId === v) relatedNcds.push({ id: vv.id, ncdsId: vv.ncdsId })
                        relatedNcds.push({ ncdsId: v })
                    })
                }
                // console.log("ncds",relatedNcds)
                relatedNcds = relatedNcds.filter((v, i, a) => a.findIndex(v2 => (v2.ncdsId === v.ncdsId)) === i)
            } else {
                val['ncdsId'].map(v => relatedNcds.push({ ncdsId: v }))
            }
        }
        val["ref"] = [...val["ref"]]
        val["related"] = [...relatedNcds,...relatedFood]

        delete val['foodId']
        delete val['ncdsId']
        // console.log(val.related)
        // return
        const res = await fetch(`/api/getBlogs`, {
            headers: { 'Content-Type': 'application/json', },
            method: "PATCH",
            body: JSON.stringify({ old: modalEdit, new: val })
        })

        // console.log('send:', val);
        if (res.status === 200) {
            notification.success({
                message: "แก้ไขข้อมูลสำเร็จ"
            })
            setModalEdit(false)
            fetch(`/api/uploads`)
            reload()
        } else notification.error({
            message: 'ไม่สามารถแก้ไขข้อมูลได้',
            description: res.message,
        })
    }
    const onFinishFailed = () => {

    }
    const onReset = () => {
        setFileListSubBlogs([])
        setFileList([])
    }
    const onTypeChange = (val) => {
        val !== 1 && setType(val)
    }
    if (!modalEdit) return null
    return <Modal title={"แก้ไขข้อมูลบทความ"}
        visible={modalEdit}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form
            form={form}
            // initialValues={{}}
            labelCol={{ span: 3 }}
            onFinish={onSubmit}
            onFinishFailed={onFinishFailed}
            scrollToFirstError={true}
            onReset={onReset}>
            <Form.Item
                name="type"
                label="ประเภทความสัมพันธ์"
                labelAlign="left"
                rules={[{ required: true, message: 'กรุณาเลือกประเภทความสัมพันธ์' }]}>
                <Select
                    showSearch
                    placeholder="เลือกประเภทอาหาร"
                    optionFilterProp="children"
                    onChange={onTypeChange}
                    // filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {Type.map(({ name_th, name_en }, ind) => <Option key={`${name_en}_${ind}`} value={name_en}>{name_th}</Option>)}
                </Select>
            </Form.Item>
            {/* {console.log()} */}
            {(form.getFieldValue("type") === "NCDS" || form.getFieldValue("type") === "ALL") && <Form.Item
                labelCol={{ span: 3, offset: 3 }}
                labelAlign="left"
                name="ncdsId"
                label="เลือกโรค"
                initialValue={form.getFieldValue("related").filter(({ ncdsId }) => ncdsId).map(({ id, ncdsId }) => ncdsId)}
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={ncdsLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!ncds && ncds.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            {/* {console.log(form.getFieldValue("related"))} */}
            {(form.getFieldValue("type") === "FOOD" || form.getFieldValue("type") === "ALL") && <Form.Item
                labelCol={{ span: 3, offset: 3 }}
                labelAlign="left"
                name="foodId"
                label="เลือกรายการอาหาร"
                initialValue={form.getFieldValue("related").filter(({ foodId }) => foodId).map(({ foodId }) => foodId)}
                rules={[{ required: true }]}>
                <Select mode="multiple"
                    loading={foodLoading}
                    filterOption={(input, option) => !!option && option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}>
                    {!!food && food.map(({ id, name_th, name_en }, ind) => <Option key={`${ind}_${name_th}`} value={id}>{name_th}</Option>)}
                </Select>
            </Form.Item>}
            <Form.Item
                name="name"
                label="ชื่อบทความ"
                labelAlign="left"
                rules={[{ required: true },]}>
                <Input placeholder="ชื่อบทความ" />
            </Form.Item>
            <Form.Item
                name="imply"
                label="คำอธิบาย"
                labelAlign="left"
                rules={[{ required: true },]}>
                <TextArea rows={4} placeholder="คำอธิบาย" />
            </Form.Item>
            <Form.Item
                name="video"
                label="วิดีโอ"
                labelAlign="left"
                rules={[{ required: false }, {
                    pattern: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                    message: 'ป้อน ที่อยู่(url) ให้ถูกต้อง',
                }]}>
                <Input placeholder="https://youtube.com/watch?" />
            </Form.Item>
            <Form.Item
                name="image"
                label="รูปภาพ"
                labelAlign="left"
                rules={[{ required: true, message: 'กรุณาเลือกรูปภาพ' }]}
            >

                <Upload
                    multiple={true}
                    accept='image/png,image/jpeg'
                    maxCount={1}
                    action="/api/uploads"
                    listType="picture"
                    className="upload-list-inline"
                >
                    <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป ({fileList?.length || 0}/1)</Button>
                </Upload>
            </Form.Item>
            <Form.List name="subBlog" rules={[{ required: true, message: "คุณลืมเพิ่มหัวข้อย่อย" }]} >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Divider />
                        {!!fields && fields.map((field, ind) => (
                            <Form.Item
                                {...fields}
                                noStyle
                                shouldUpdate
                                key={`หัวข้อย่อย ${field.key}`}
                                required
                            >
                                <Form.Item
                                    {...field}
                                    labelCol={null}
                                    wrapperCol={0}
                                    key={`หัวข้อย่อยที่ ${ind}`}
                                >
                                    <> {ind !== 0 && <Divider />}
                                        <div className="flex gap-3 items-center text-lg  justify-center pt-2 mb-4">
                                            <Button_Delete className="text-gray-800" fx={() => { remove(field.name); setFileListSubBlogs(prev => prev.filter((v, i) => i !== ind)) }} />{`หัวข้อย่อยที่ ${ind + 1}`}
                                        </div>
                                    </>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="ชื่อหัวข้อ"
                                    labelAlign="left"
                                    labelCol={{ span: 2, offset: 3 }}
                                    key={`image ${ind}`}
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true }]}
                                >

                                    <Input placeholder="ชื่อหัวข้อ" />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    label="เนื้อความ"
                                    labelAlign="left"
                                    labelCol={{ span: 2, offset: 3 }}
                                    key={`detail ${ind}`}
                                    name={[field.name, 'detail']}
                                    fieldKey={[field.fieldKey, 'detail']}
                                    rules={[{ required: true }]}
                                >
                                    <TextArea rows={4} placeholder="เนื้อความ" />
                                </Form.Item>
                                {/* {console.log(form?.getFieldValue("subBlog"))} */}
                                <Form.Item
                                    {...field}
                                    key={`image ${ind}`}
                                    name={[field.name, 'image']}
                                    labelCol={{ span: 2, offset: 3 }}
                                    fieldKey={[field.fieldKey, 'image']}
                                    label="รูปภาพ"
                                    labelAlign="left"
                                // rules={[{ required: true , message: 'กรุณาเลือกรูปภาพ' }]}
                                >
                                    <Upload
                                        multiple={true}
                                        accept='image/png,image/jpeg'
                                        maxCount={1}
                                        action="/api/uploads"
                                        listType="picture"
                                        // onChange={(e) => onChangeSubBlogs(ind, e)}
                                        defaultFileList={form?.getFieldValue("subBlog")?.length > 0 ? (
                                            form?.getFieldValue("subBlog")?.[ind]?.fileList ?
                                                form?.getFieldValue("subBlog")?.[ind]?.fileList :
                                                form?.getFieldValue("subBlog")?.[ind]?.image?.name ?
                                                    [form?.getFieldValue("subBlog")?.[ind]?.image] : []
                                        ) : []}
                                        className="upload-list-inline"
                                    >
                                        <Button className="w-full" icon={<UploadOutlined />}>เพิ่มรูป</Button>
                                    </Upload>
                                </Form.Item>
                            </Form.Item>

                        ))}
                        <div className="flex justify-center">
                            <button className="flex gap-1 items-center hover:text-blue-500 hover:text-lg  hover:shadow-md p-2 rounded-lg hover:uppercase ease-anima btn-sm"
                                onClick={() => add()}
                                type="button">
                                <PlusOutlined />
                                <span className="text-blue-900">เพิ่มหัวข้อย่อย</span>
                            </button>
                        </div>
                        <Form.ErrorList errors={errors} />
                    </>

                )}
            </Form.List>
            <Form.List name="ref" rules={[{ required: true, message: "คุณลืมเพิ่มอ้างอิง" }]} >
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
                                        <Button_Delete className="text-gray-800" fx={() => { remove(field.name); }} />ลบอ้างอิงที่ {ind + 1}
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
            <div className="flex justify-end gap-2">
                <Button htmlType="reset">ล้างค่า</Button>
                <Button className='edit_button' type="primary" htmlType="submit">แก้ไขข้อมูล</Button>
            </div>
        </Form>
    </Modal>
}

const ModalView = () => {
    const router = useRouter()
    const { setModalView, modalView, reload } = useContext(Context)
    const onCancel = () => {
        setModalView(false)
    }
    
    if (!modalView) return null
    const handleRouterMenuClick = ()=>{
        console.log(modalView)
        router.push(`/blogs/${modalView.type.toLowerCase()}/${modalView.id}`)
    }
    return <Modal title={<div className='flex items-center gap-2'><span>{modalView.name}</span><Tooltip title="กดเพื่อดูตัวอย่าง"><EyeOutlined onClick={handleRouterMenuClick}  className="text-sm"/></Tooltip></div>}
        visible={modalView}
        okText={null}
        cancelText={<>ยกเลิก</>}
        // onOk={onSubmit}
        onCancel={onCancel}
        width="100%"
        footer={<></>}>
        <Form labelCol={{ span: 4 }} labelAlign="left">
            <Form.Item label={`รูปภาพ`}>{modalView?.image?.map(({ name }) => <>{name ? <CusImage className="rounded-md shadow-lg" key={name} width="250px" height="150px" src={name} /> : "ไม่พบรูปภาพ"}</>)}</Form.Item>
            <Form.Item label="ประเภท"><span className='text-lg whitespace-pre-line'>{modalView.type === "ALL" ? "อาหารและโรค" : modalView.type === "NCDS" ? "โรคไม่ติดต่อ" : modalView.type === "FOOD" ? "อาหาร" : ""}</span></Form.Item>
            <Form.Item label={`ความเกี่ยวข้อง ${modalView?.related?.length}`}>
                <div className="flex gap-2"> {!!modalView?.related && modalView?.related?.length > 0 ? modalView?.related?.map(({ id, Foods, ncds }, index) => <>
                    <span key={`${id}_${index}`} className='text-md whitespace-pre-line'>{Foods?.name_th || ncds?.name_th}</span>
                </>) : "ไม่พบความเกี่ยวข้อง"}
                </div>
            </Form.Item>

            <Form.Item label="การอนุมัติ"><span className='text-md whitespace-pre-line'>{modalView.approve === 1 ? "อนุมัติ" : modalView.approve === 2 ? "ไม่อนุมัติ" : "รอการอนุมัติ"}</span></Form.Item>
            <Form.Item label="ชื่อบทความ"
                labelAlign="left"><span className='text-lg whitespace-pre-line'>{modalView.name}</span></Form.Item>
            <Form.Item label="คำอธิบาย"
                labelAlign="left"><span className='text-md whitespace-pre-line'>{modalView.imply}</span></Form.Item>
            <Form.Item label="หัวข้อย่อย">
                {modalView.subBlog.map(({ name, image, detail }, index) => <div key={`${name}_${index}`}>
                    <Form labelCol={{ span: 4 }} labelAlign="left">
                        <Form.Item label={`หัวข้อย่อย ${index + 1}`}></Form.Item>
                        <Form.Item label={`รูปภาพ`}>{image?.name ? <CusImage className="rounded-md shadow-lg" width="250px" height="150px" src={image.url} /> : "ไม่พบรูปภาพ"}</Form.Item>
                        <Form.Item label={`ชื่อหัวข้อย่อย`}><span className='text-md whitespace-pre-line'>{name}</span></Form.Item>
                        <Form.Item label={`เนื้อหา`}><span className='text-md whitespace-pre-line'>{detail}</span></Form.Item>
                    </Form>
                </div>)}
            </Form.Item>
            <Form.Item label="วิดีโอ"
                labelAlign="left">{modalView?.video ? <div className="w-64 h-64 sm:w-96 sm:h-96"><ReactPlayer width="100%" url={modalView.video} /> </div>: "ไม่พบวิดีโอ"}</Form.Item>
            <Form.Item label={`อ้างอิง ${modalView?.ref?.length}`}>{!!modalView?.ref && modalView?.ref?.length > 0 ? modalView?.ref?.map(({ url }) => <><a key={url} rel="noopener noreferrer" target="_blank" href={url.split(",").at(-1)} className='text-md whitespace-pre-line hover:bg-gray-100 hover:p-3 hover:rounded-md'>{url}</a><br /></>) : "ไม่พบข้อมูลอ้างอิง"}</Form.Item>

        </Form>
    </Modal>

}
const Type = [
    { name_en: "NCDS", name_th: "โรคไม่ติดต่อ" },
    { name_en: "FOOD", name_th: "อาหาร" },
    { name_en: "ALL", name_th: "อาหารและโรค" },
]

const Chart = ({ food, ncds, blogs }) => {

    // console.log(blogs)
    const type_blog = {
        labels: ["โรคไม่ติดต่อ", "อาหาร", "อาหารและโรค"],
        datasets: [{
            data: blogs.reduce((acc, { type }) => {
                switch (type) {
                    case "NCDS": acc[0] += 1; break;
                    case "FOOD": acc[1] += 1; break;
                    case "ALL": acc[2] += 1; break;
                }
                return acc
            }, [0, 0, 0]),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        }],
    }
    const approve_blog = {
        labels: ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ"],
        datasets: [{
            data: blogs.reduce((acc, { approve }) => {
                switch (approve) {
                    case 0: acc[0] += 1; break;
                    case 1: acc[1] += 1; break;
                    case 2: acc[2] += 1; break;
                }
                return acc
            }, [0, 0, 0]),
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
                '#caefe3',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                '#10b981',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
        }],
    }
    // const ncds_data = data.ncds.map(({ name, count }) => ({ name, value: count }))
    return (<div className="flex gap-3 flex-wrap justify-center bg-gray-900 py-20 mb-5 rounded-sm">
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">ประเภท</p><Doughnut data={type_blog} /></div>
        <div className="w-72 h-72 bg-blue-50 p-7 rounded-md flex flex-col justify-center"><p className="text-xs text-center text-gray-800">การอนุมัติ</p><Doughnut data={approve_blog} /></div>
    </div>)
}