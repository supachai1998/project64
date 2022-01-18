import { Button, Card, Input, message, Modal, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState, useRef, useEffect, createRef } from 'react';
import ReactPlayer from 'react-player';



const { Option, OptGroup } = Select
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));
import { noti } from './../noti';
import { ThumbDownAlt,ThumbUpAlt } from '@mui/icons-material';

const Ncds = ({ ncds }) => {
    const [data, setData] = useState(ncds || null)
    const [loading, setLoading] = useState(false)
    const [contentModal, setContentModal] = useState(null);

    const [sortData, setSortData] = useState('suggess_des')
    // useEffect(() => {
    //     const sortArray = (key) => {
    //         const [val, option] = key.split('_')
    //         const types = {
    //             name: 'ncds',
    //             date: 'date',
    //             suggess: "suggess",
    //         };
    //         const sortProperty = types[val];
    //         val === "suggess" ?  option === "des"
    //                 ? setData(prev => prev.sort((a, b) => Number(a[sortProperty]) > Number(b[sortProperty])))
    //                 : setData(prev => prev.sort((a, b) => Number(a[sortProperty]) < Number(b[sortProperty])))
    //             :  option === "des"
    //                 ? setData(prev => prev.sort((a, b) => a[sortProperty] > b[sortProperty]))
    //                 : setData(prev => prev.sort((a, b) => a[sortProperty] < b[sortProperty]))
    //     }
    //     sortArray(sortData)
    // }, [sortData])


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
                if (filter.length < 1) noti("error","ไม่พบข้อมูล")
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
        <div className="w-full h-full">
            <div className="flex justify-between ">
                <span className="w-full text-4xl font-Charm">โรคติดต่อไม่เรื้อรัง</span>
                <div className="flex w-full gap-3 md:w-1/2">
                    <Select className="w-full md:w-1/3" defaultValue={sortData} placeholder="จัดเรียงตาม" onChange={v=>setSortData(v)}>
                        {[
                            { label: "เรียงตามวัน", data: [{ k: "date_des", v: "วันล่าสุด" }, { k: "date_asc", v: "วันสุดท้าย" }] },
                            { label: "เรียงตามชื่อโรค", data: [{ k: "name_des", v: "ชื่อ ฮ-ก" }, { k: "name_asc", v: "ชื่อ ก-ฮ" }] },
                            { label: "คำแนะนำ", data: [{ k: "suggess_des", v: "แนะนำ" }, { k: "suggess_asc", v: "ไม่แนะนำ" }] },
                        ].map(({ label, data }, index) => (
                            <OptGroup key={index + label} label={label} >
                                {data.map(({ k, v }, index) => (<Option key={index + k} value={k} >{v}</Option>))}
                            </OptGroup >))}
                    </Select>
                    <Search className="w-1/4 input search loading with enterButton" disabled={loading} onChange={onChange} onSearch={handleSearch} maxLength={30} onPressEnter={handleSearch} loading={loading} enterButton inputMode="search" placeholder={`ชื่อโรค`} ref={refSearchInput} />
                </div>
            </div>
            <div className="grid h-full gap-4 p-6 mt-3 md:grid-cols-2">
                {data.map(({ ncds,
                    because,
                    suggess,
                    imgUrl,
                    videoUrl,
                    ref, }, index) => (
                    <>
                        <div key={index} className="flex flex-col w-full h-full gap-2 p-6 md:flex-row rounded-xl bg-gray-50">
                            {suggess ?
                                <>
                                    {imgUrl &&<div className="w-full h-full md:w-2/3"> <CusImage src={imgUrl} alt={ref} className="w-full h-full rounded-xl" width="100%" height="100%" preview={false} /></div>}
                                    <div className="flex flex-col w-full h-full gap-3">
                                        <div className="flex gap-4 ">
                                            <div className="text-4xl text-gray-800 font-Charm "> {ncds} </div>
                                            <div className="text-sm stroke-current ">{suggess ? <ThumbUpAlt className="text-green-600" /> : <ThumbDownAlt className="text-red-600" />}</div>
                                        </div>
                                        <div> {because} </div>
                                        {videoUrl && <Button className="max-w-sm md:mx-auto" onClick={() => showModal(ncds, videoUrl)} > แสดงวีดีโอ </Button>}
                                    </div>
                                </>
                                :
                                <div className="flex flex-col-reverse gap-3 md:flex-row ">
                                    <div className="flex flex-col w-full h-full gap-3">
                                        <div className="flex justify-end gap-4">
                                            <div className="text-sm stroke-current ">{suggess ? <ThumbUpAlt className="text-green-600" /> : <ThumbDownAlt className="text-red-600" />}</div>
                                            <div className="text-4xl text-gray-800 font-Charm "> {ncds} </div>
                                        </div>
                                        <div className="text-right"> {because} </div>
                                        {videoUrl && <Button className="max-w-sm md:mx-auto" onClick={() => showModal(ncds, videoUrl)}> แสดงวีดีโอ </Button>}
                                    </div>
                                    {imgUrl &&<div className="w-full h-full md:w-2/3"> <CusImage src={imgUrl} alt={ref} className="w-full h-full rounded-xl" width="100%" height="100%" preview={false} /></div>}
                                </div>}
                        </div>

                    </>
                ))}
                <CusModal content={contentModal} handleCancel={handleCancel} />
            </div>

        </div>
    )
}


const CusModal = ({ handleCancel, content }) => {
    if (!content) return null
    const { videoUrl, title } = content
    return (
        <>
            <Modal title={title} visible={true} centered onCancel={handleCancel} width="100%" footer={null} >
                <div className="w-full sm:h-screen h-52"><ReactPlayer url={videoUrl} width="100%" height="100%" /></div>
            </Modal>
        </>
    );
};


export default Ncds