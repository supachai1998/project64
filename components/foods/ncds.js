import { Button, Card, Input, message, Modal, notification, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState, useRef, useEffect, createRef } from 'react';
import ReactPlayer from 'react-player';

import { VideoCameraOutlined, CloseOutlined } from '@ant-design/icons';


const { Option, OptGroup } = Select
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));
import { noti } from './../noti';

const NCDS = ({ ncds }) => {
    console.log(ncds)
    const [data, setData] = useState(ncds || null)
    const [loading, setLoading] = useState(false)
    const [contentModal, setContentModal] = useState(null);

    const [sortData, setSortData] = useState('suggess_des')
    // useEffect(() => {
    //     const sortArray = (key) => {
    //         const [val, option] = key.split('_')
    //         const types = {
    //             name: 'name_th',
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


    const showModal = (title, video) => {
        setContentModal({
            title: title,
            video: video
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
                const filter = data.filter(({ name_th, cause }) => name_th.toLowerCase().indexOf(val) > -1)
                if (filter.length < 1) noti("error", "ไม่พบข้อมูล")
                else setData(filter)
                setLoading(false)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setData(name_th)
        }
    }


    const onChange = () => {

        const val = refSearchInput.current.state.value
        if (!!val && val.length <= 1) setData(name_th) //ถ้า val ไม่มีหรือ <= 1 ให้ reset data กลับ

    }
    if (!data) return null
    return (
        <div className="w-full h-auto sm:px-5">
            <div className="flex justify-center text-center ">
                <span className="w-full text-2xl">โรคติดต่อไม่เรื้อรัง</span>
            </div>
            <div className="grid h-auto gap-4 px-6 mt-3 md:grid-cols-3 sm:mx-5">
                {data.map(({
                    id,
                    name_th,
                    name_en,
                    imply,
                    video,
                    detail,
                    reduce,
                    signs,
                    sugess,
                    image,
                    ref, }, index) => (
                    <>
                        {sugess &&
                            <div key={index} className="card-suggession">
                                <>
                                    {/* {console.log(suggess)} */}
                                    {image &&<div className="card-suggession-image"><CusImage className="rounded-md w-full h-full" src={image[0].name} alt={ref} width="100%" height="100%" preview={false} /></div>}
                                    <div className="card-suggestion-header-content">
                                        <div className="flex flex-col  ">
                                            <span className="card-header"> {name_en} </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-2xl text-gray-800 font-Charm "> {name_th} </span>
                                        </div>
                                        <div className='text-green-500 text-2xl '>
                                            แนะนำ
                                        </div>
                                        <div className='h-20 overflow-hidden'> {detail}</div>
                                        {video && <hr className='mb-2 border-t' />}
                                        <div className="flex justify-center mb-4">{video && <a className="max-w-sm md:mx-auto w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(name_th, video)}  ><VideoCameraOutlined /> ดูวิดีโอ </a>}</div>
                                    </div>
                                </>
                            </div>
                        }
                    </>
                ))}
                {data.map(({
                    id,
                    name_th,
                    name_en,
                    detail,
                    video,
                    cause,
                    reduce,
                    signs,
                    sugess,
                    image,
                    ref, }, index) => (
                    <>
                        {!sugess &&
                            <div key={index} className="card-suggession">
                                <>
                                    {/* {console.log(suggess)} */}
                                    {image && <div className="card-suggession-image"> <CusImage className="rounded-md" src={image[0].name} alt={ref} width="100%" height="100%" preview={false} /></div>}
                                    <div className="card-suggestion-header-content">
                                        <div className="flex flex-col  ">
                                            <span className="card-header"> {name_en} </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-2xl text-gray-800 font-Charm "> {name_th} </span>
                                        </div>
                                        <div className='text-red-500 text-2xl '>
                                            ไม่แนะนำ
                                        </div>
                                        <div className='h-20 overflow-hidden'> {detail}</div>
                                        {video && <hr className='mb-2 border-t' />}
                                        <div className="flex justify-center mb-4 h-11/12">{video && <a className="max-w-sm md:mx-auto w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(name_th, video)}  ><VideoCameraOutlined /> ดูวิดีโอ </a>}</div>
                                    </div>
                                </>
                            </div>
                        }
                    </>
                ))}
                <CusModal content={contentModal} handleCancel={handleCancel} />
            </div>

        </div>
    )
}


const CusModal = ({ handleCancel, content }) => {
    if (!content) { return null }
    const { video, title } = content
    return (
        <>
            <Modal title={<div className='flex w-full justify-between '>{title} <CloseOutlined className="button-cus hover:bg-red-200" onClick={() => handleCancel()} /></div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
                <div className="h-screen w-full p-0 m-0 "><ReactPlayer url={video} width="100%" height="100%" /></div>
            </Modal>
        </>
    );
};


export default NCDS