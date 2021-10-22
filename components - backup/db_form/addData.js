import { useState, } from 'react'
import { Button, Form, Space, Input, Modal, Select, InputNumber, Tooltip } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons';
import { noti } from '/components/noti.js'
const { TextArea } = Input;
const { Option } = Select
const AddData = ({ title, isModalVisible, handleOk, handleCancel }) => {
    const [selectVal, setSelectVal] = useState(null)
    const onFinish = val => {
        // Object { typeForm, name, typeOptional, optional }
        const { typeForm, name, typeOptional, optional } = val
        noti("success", `สร้างแบบประเมินสำเร็จ`, `แบบประเมินชื่อ ${name} ประเภท ${typeForm}`)
        setTimeout(() => {
            handleOk()
        }, 1000);
    };
    return (
        <Modal title={title} visible={isModalVisible}
            onOk={handleOk} onCancel={handleCancel}
            footer={[]}
            className="w-full h-full"
        >
            <Form name="สร้างแบบประเมิน" onFinish={onFinish} autoComplete="off" >
                <div className="grid grid-cols-1 gap-2">
                    <Form.Item
                        label="ประเภทแบบประเมิน"
                        name="typeForm"
                        rules={[{ required: true, message: 'เลือกประเภทแบบประเมิน' }]}
                    >
                        <Select >
                            {[
                                { k: "diabetes", v: "โรคเบาหวาน" },
                                { k: "pressure", v: "โรคความดันโลหิตสูง" },
                                { k: "emphysema", v: "โรคหัวใจ" },
                                { k: "staggers", v: "โรคสมอง" },
                                { k: "cancer", v: "โรคมะเร็ง" },
                                { k: "central_obesity", v: "โรคอ้วนลงพุง" },
                            ].map(({ k, v }, i) => <Option key={i} className="text-gray-300" value={k} >{v}</Option>
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="ชื่อแบบประเมิน"
                        name="name"
                        rules={[{ required: true, message: 'เลือกประเภทประเมิน' }]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <Form.Item
                    label="ประเภทตัวเลือก"
                    name="typeOptional"
                    rules={[{ required: true, message: 'เลือกประเภทตัวเลือก' }]}
                >
                    <Select onChange={v => setSelectVal(v)}>
                        {[
                            { k: "radio", v: "หลายตัวเลือก" },
                            { k: "checkbox", v: "ตัวเลือกเดียว" },
                            { k: "input.number", v: "ตัวเลข" }
                        ].map(({ k, v }, i) => <Option key={i} className="text-gray-300" value={k} >{v}</Option>
                        )}
                    </Select>
                </Form.Item>
                {selectVal && <Form.List name="optional">
                    {(fields, { add, remove }) => (
                        <>
                            {!!fields && fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Space key={key} className="flex flex-col w-full gap-1" align="baseline">
                                    <div className="flex w-full gap-4 h-9">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            fieldKey={[fieldKey, 'name']}
                                            rules={[{ required: true, message: 'ชื่อตัวเลือกห้ามว่าง!!' }]}
                                        >
                                            <Input placeholder="ชื่อตัวเลือก" />
                                        </Form.Item>
                                        {selectVal === "input.number" && <>
                                            <Form.Item
                                                {...restField}
                                                className="w-12"
                                                name={[name, 'sign']}
                                                fieldKey={[fieldKey, 'sign']}
                                                rules={[{
                                                    required: true, message: 'เครื่องหมายห้ามว่าง!!',
                                                    type: "regexp",
                                                    pattern: new RegExp(/[=><]{1,2}\s\d+/),
                                                }]}
                                            >
                                                <Input maxLength={2} />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'val']}
                                                fieldKey={[fieldKey, 'val']}
                                                rules={[{ required: true, message: 'ตัวเลขห้ามว่าง' }]}
                                            >
                                                <InputNumber placeholder="ตัวเลข" />
                                            </Form.Item>

                                        </>}
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'score']}
                                            fieldKey={[fieldKey, 'score']}
                                            rules={[{ required: true, message: 'คะแนนห้ามว่าง' }]}
                                        >
                                            <InputNumber placeholder="คะแนน" />
                                        </Form.Item>
                                        <Tooltip title="ลบตัวเลือก"><MinusCircleOutlined className="mt-2 " onClick={() => remove(name)} /></Tooltip>
                                    </div>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'detail']}
                                        fieldKey={[fieldKey, 'detail']}
                                    // rules={[{ required: true, message: '' }]}
                                    >
                                        <TextArea rows={2} placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับตัวเลือก" />
                                    </Form.Item>
                                </Space>
                            ))}
                            <Form.Item >
                                <Button type="dashed" onClick={() => add()} block disabled={!!!selectVal} className="mt-2" >
                                    เพิ่มตัวเลือก
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                }<Form.Item className="mt-2">
                    <Button type="primary" htmlType="submit" className="float-right">
                        เพิ่มแบบประเมิน
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddData