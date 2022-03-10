import { Button, Card, Input, message, Modal, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState, useRef, useEffect, createRef } from 'react';
import ReactPlayer from 'react-player';

import { VideoCameraOutlined } from '@ant-design/icons';
import OwlCarousel from "react-owl-carousel";

const state= {
    responsive:{
        0: {
            items: 1,
        },
        450: {
            items: 1,
        },
        600: {
            items: 1,
        },
        1000: {
            items: 3,
        },
    },
  }
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
        <div className="mx-2 lg:mx-10">
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
                <p className=" mt-4 text-4xl mb-0 font-bold  transition transform font-Charm w-full text-center ">โรคติดต่อไม่เรื้อรัง</p>
                <span className=' w-full text-right mb-4 border-b border-b-green' >
 
          </span>        
            </div>
            <OwlCarousel
loop={false}
items={3}
responsiveRefreshRate={0}
autoplay={true}
autoplayTimeout={7000}
autoplayHoverPause={true}
nav={true}
responsiveClass= {true}
responsive={state.responsive}
navText={[
  '<i class="icon-arrow-prev"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
  '<i class="icon-arrow-next"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
]



}
dots={false}
margin={1} >
                {data.map(({ ncds,
                    because,
                    suggess,
                    imgUrl,
                    videoUrl,
                    ref, }, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className='shadow-lg m-5 rounded-lg'>
                                    {imgUrl &&<div className="w-full h-1/3 md:w-full "><CusImage src={imgUrl} alt={ref} className="w-full h-full  " width="100%" height="100%" preview={false} /></div>}
                                    <div className="flex flex-col w-full h-full gap-3 px-5 pb-5 text-center mt-5">
                                        <div className="flex flex-col  ">
                                            <span className="text-4xl text-gray-800 font-Charm "> Hiabetes </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-4xl text-gray-800 font-Charm "> {ncds} </span>
                                        </div>
                                        <div>
                                          
                                        </div>
                                        <p className='break-words overflow-hidden text-lg md:text-md h-20'>{because} </p>
                                        <hr />
                                        <div className='mx-auto m-4 w-full'>
                                            <a onClick={() => router.push(`/${type}/${categories}?name=${title_th}`)} className=" text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 px-10">อ่านต่อ</a>
                                        </div>

                                    </div>

                    </div>
                ))}
            </OwlCarousel>
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