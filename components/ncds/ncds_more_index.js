import { Button, Card, Input, message, Modal, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState, useRef, useEffect, createRef } from 'react';
import ReactPlayer from 'react-player';

import { VideoCameraOutlined } from '@ant-design/icons';


const { Option, OptGroup } = Select
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('../cusImage.js'));
import { noti } from '../noti';
import { ThumbDownAlt, ThumbUpAlt } from '@mui/icons-material';

const Ncds = ({ ncds }) => {
    const [data, setData] = useState(ncds || null)
    const [loading, setLoading] = useState(false)
    const [contentModal, setContentModal] = useState(null);

    const [sortData, setSortData] = useState('suggess_des')


    const showModal = (title, videoUrl) => {
        setContentModal({
            title: title,
            videoUrl: videoUrl
        });
    };

    const handleCancel = () => {
        setContentModal(null);
    };

    const refSearchInput = useRef()
    const handleSearch = () => {
        const val = refSearchInput.current.state.value
        if (!!val && val.length > 2) {
            setLoading(true)
            const timer = setTimeout(() => {
                const filter = data.filter(({ ncds, because }) => ncds.toLowerCase().indexOf(val) > -1)
                if (filter.length < 1) noti("error", "ไม่พบข้อมูล")
                else setData(filter)
                setLoading(false)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setData(ncds)
        }
    }


    const onChange = () => {

        const val = refSearchInput.current.state.value
        if (!!val && val.length <= 1) setData(ncds) //ถ้า val ไม่มีหรือ <= 1 ให้ reset data กลับ

    }
    if (!data) return null
    return (
        <div className="mx-0 lg:mx-10">
            <div className="flex justify-center text-center flex-col">

                <div className="flex w-full gap-3 md:w-1/2 mt-5 ml-auto">

                    <select className="w-full md:w-1/3" defaultValue={sortData} placeholder="จัดเรียงตาม" >
                        {/* {[
                            { label: "เรียงตามวัน", data: [{ k: "date_des", v: "วันล่าสุด" }, { k: "date_asc", v: "วันสุดท้าย" }] },
                            { label: "เรียงตามชื่อโรค", data: [{ k: "name_des", v: "ชื่อ ฮ-ก" }, { k: "name_asc", v: "ชื่อ ก-ฮ" }] },
                            { label: "คำแนะนำ", data: [{ k: "suggess_des", v: "แนะนำ" }, { k: "suggess_asc", v: "ไม่แนะนำ" }] },
                        ].map(({ label, data }, index) => (
                            <OptGroup key={index + label} label={label} >
                                {data.map(({ k, v }, index) => (<Option key={index + k} value={k} >{v}</Option>))}
                            </OptGroup >))} */}
                        <option>อาหาร</option>
                        <option>โรคไม่ติดต่อเรื้อรัง</option>
                        <option>บทความ</option>
                    </select>
                    <Search className="w-1/4 input search loading with enterButton" disabled={loading} onChange={onChange} onSearch={handleSearch} maxLength={30} onPressEnter={handleSearch} loading={loading} enterButton inputMode="search" placeholder={`ชื่อโรค`} ref={refSearchInput} />
                </div>
                <p className="card-header-top">โรคติดต่อไม่เรื้อรัง</p>
                <span className=' w-full text-right mb-4 border-b border-b-green' >

                </span>
            </div>
            <div className='lg:grid lg:grid-cols-3   gap-2 w-full'>
                {data.map(({ ncds,
                    because,
                    suggess,
                    imgUrl,
                    videoUrl,
                    ref, }, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className='shadow-lg m-5 rounded-lg '>
                        {imgUrl && <div className="w-full h-1/3 md:w-full "><CusImage src={imgUrl} alt={ref} className="w-full h-full  " width="100%" height="100%" preview={false} /></div>}
                        <div className="flex flex-col w-full h-full gap-3 px-5 pb-5 text-center mt-5">
                            <div className="flex flex-col  ">
                                <span className="card-header"> Hiabetes </span>
                                <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                <span className="card-header"> {ncds} </span>
                            </div>
                            <div>

                            </div>
                            <p className='break-words overflow-hidden text-lg md:text-md h-20'>{because}</p>
                            <hr />
                            <div className='mx-auto m-4 w-full'>
                                <a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className=" text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 px-10">อ่านต่อ</a>
                            </div>

                        </div>

                    </div>
                ))}
            </div>
            <CusModal content={contentModal} handleCancel={handleCancel} />

        </div>
    )
}


const CusModal = ({ handleCancel, content }) => {
    if (!content) return null
    const { videoUrl, title } = content
    return (
        <>
            <Modal title={title} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
                <div className="h-screen w-full p-0 m-0 "><ReactPlayer url={videoUrl} width="100%" height="100%" /></div>
            </Modal>
        </>
    );
};


export default Ncds