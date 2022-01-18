import { useState, useRef } from 'react'
import { Button,} from 'antd'
import FoodTable from '/components/db_form/table'
import AddData from '/components/db_form/addData';
import { PlusCircleOutlined } from '@ant-design/icons';
import { color } from '../../../ulity/color';


export default function Index() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div className="w-full h-full min-h-screen">
            {/* header */}
            <div className="flex flex-col gap-6 p-6 text-gray-800 rounded-xl">
                {/* <div className="text-4xl font-bold border-l-4 border-gray-800 font-Charm"><span className="ml-3">ข้อมูลสถิติแบบประเมิน</span></div> */}
                {/* Card */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 ">
                    {[
                        { title: "จำนวนแบบประเมินทั้งหมด", content: 10 ,bg : "bg-yellow-700"},
                        { title: "จำนวนครั้งที่ตอบแบบประเมิน", content: 1400 , bg : "bg-red-700"},
                        { title: "ข้อมูล", content: 9999, bg : "bg-green-700"},
                        { title: "ข้อมูล", content: 120 ,bg : "bg-blue-700"},

                    ].map(({ title, content,bg }, index) => (
                        <div className={bg+` flex flex-col gap-4 p-4 text-center text-gray-50`} key={index} >
                            <span className="text-4xl font-bold">{content}</span>
                            <span className="text-sm text-gray-300">{title}</span>
                        </div>
                    ))}
                </div>
                {/* End Card */}
                <div className="flex justify-between w-full text-4xl font-bold border-l-4 border-gray-800 font-Charm">
                    <span className="ml-3">จัดการข้อมูล</span>
                    <Button className="text-xl font-Poppins" onClick={showModal} icon={<PlusCircleOutlined className="w-4 h-4"/>}>เพิ่มข้อมูล</Button>
                </div>
                <FoodTable />
            </div>
            {isModalVisible && <AddData title={"เพิ่มข้อมูลแบบประเมิน"} isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />}
        </div>
    )
}




