import { Card, Input, Modal, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState} from 'react';
import ReactPlayer from 'react-player';

import { VideoCameraOutlined, CloseOutlined } from '@ant-design/icons';
const Owl_Carousel = dynamic(() => import('/components/Owl_Carousel'), {
    ssr: false,
});

const { Option } = Select

const CusImage = dynamic(() => import('./../cusImage.js'));

const NCDS = ({ ncds }) => {
    const [data, setData] = useState(ncds || null)

    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState(3)

    const handleChange = ((value) => {
        setSuggestion(value)
    })

    if (!data) return null
    const total = data.length
    const count_sugess = ncds.filter(item => item.suggess).length
    return (
        <div className="w-full h-auto sm:px-5">
            <hr className="my-3" />
            <div className="flex justify-center  items-center">
                <p className={`w-full text-2xl card-header-top  ${suggestion === 2 ? " text-green-600 " : suggestion === 1 && " text-red-600 "}`}>โรคติดต่อไม่เรื้อรัง</p>
                <Select defaultValue={3} onChange={handleChange} >
                    <Option value={3}>ทั้งหมด ({total})</Option>
                    <Option value={2}>แนะนำ ({count_sugess})</Option>
                    <Option value={1}>ไม่แนะนำ ({total - count_sugess})</Option>
                </Select>
            </div>
            {suggestion === 3 ? <><Suggess_true data={data} /> <Suggess_false data={data} /> </> :
                suggestion === 2 ? <Suggess_true data={data} /> :
                    suggestion === 1 && <Suggess_false data={data} />}
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
const Suggess_true = ({ data }) => {
    const [contentModal, setContentModal] = useState(null);
    const showModal = (title, video) => {
        setContentModal({
            title: title,
            video: video
        });
    };

    const handleCancel = () => {
        setContentModal(null);
    };
    return <Owl_Carousel margin={0}>
        <>
            {data.map(({
                id,
                name_th,
                name_en,
                imply,
                video,
                detail,
                reduce,
                signs,
                suggess,
                image,
                Ncds,
                ref, }, index) => (
                <>

                    {suggess &&
                        <div key={index} className="card-suggession">
                            <>
                                {image && <div className=""><CusImage className="rounded-md w-full h-full" src={image.name} alt={ref} width="100%" height="100%" preview={false} /></div>}
                                <div className="card-suggestion-header-content">
                                    <div className="flex flex-col  ">
                                        <span className="card-header"> {Ncds.name_th} </span>
                                        <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                        <span className="text-sm font-thin text-gray-800 "> {Ncds.name_en} </span>
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
            <CusModal content={contentModal} handleCancel={handleCancel} />
        </>
    </Owl_Carousel>
}
const Suggess_false = ({ data }) => {
    const [contentModal, setContentModal] = useState(null);
    const showModal = (title, video) => {
        setContentModal({
            title: title,
            video: video
        });
    };

    const handleCancel = () => {
        setContentModal(null);
    };
    return <Owl_Carousel margin={0}>
        <>
            {data.map(({
                id,
                name_th,
                name_en,
                detail,
                video,
                cause,
                reduce,
                signs,
                suggess,
                image,
                Ncds,
                ref, }, index) => (
                <>
                    {!suggess &&
                        <div key={index} className="card-suggession">
                            <>

                                {image && <div className=""> <CusImage className="rounded-md" src={image.name} alt={ref} width="100%" height="100%" preview={false} /></div>}
                                <div className="card-suggestion-header-content">
                                    <div className="flex flex-col  ">
                                        <span className="card-header"> {Ncds.name_th} </span>
                                        <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                        <span className="text-sm font-thin text-gray-800 "> {Ncds.name_en} </span>
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
        </>
    </Owl_Carousel>
}



export default NCDS

const easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
    initial: {
        y: 60,
        opacity: 0,
        transition: { duration: 1.2, ease: easing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: easing
        }
    }
};
const state = {
    responsive: {
        0: {
            items: 1,
        },
        450: {
            items: 1,
        },
        750: {
            items: 2,
        },
        1000: {
            items: 3,
        },
        1250: {
            items: 4,
        },
    },
}