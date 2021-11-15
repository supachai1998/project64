import {useState} from 'react';
import {Button, Table,Divider,Modal} from 'antd'
export default function Index(){
    const [modalAdd,setModalAdd] = useState(false)

    return (
        <div 
            className="ease-div flex flex-col gap-4">
            <Board/>
            <div className="flex justify-between mt-4">
                 <div className="text-xl">ตารางแบบประเมินโรค</div>
                 <Button onClick={()=>setModalAdd(true)}>เพิ่มข้อมูล</Button>
            </div>
            <ModalAdd setModalAdd={setModalAdd} modalAdd={modalAdd}/>
            <TableForm/>
        </div>
    )
}

const Board = () =>{
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

const TableForm = () =>{

    return <div>
        <Table/>
    </div>
}

const ModalAdd = ({modalAdd , setModalAdd}) =>{
    const onOk = () =>{
        setModalAdd(false)
    }
    const onCancel = () =>{
        setModalAdd(false)
    }
    return <Modal title={"เพิ่มข้อมูลแบบประเมิน"} 
        visible={modalAdd}
        okText={<>ตกลง</>}
        cancelText={<>ยกเลิก</>}
        onOk={onOk}
        onCancel={onCancel}
        width="100%">

    </Modal>
}