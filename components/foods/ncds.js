import { Button, Card, Input, message, Modal, notification, Select } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState, useRef, useEffect, createRef } from 'react';
import ReactPlayer from 'react-player';

import { VideoCameraOutlined , CloseOutlined } from '@ant-design/icons';


const { Option, OptGroup } = Select
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));
import { noti } from './../noti';

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
        <div className="w-full h-full px-10">
            <div className="flex justify-center text-center ">
                <span className="w-full text-2xl font-Charm">โรคติดต่อไม่เรื้อรัง</span>
            </div>
            <div className="grid h-full gap-4 p-6 mt-3 md:grid-cols-3 mx-10">
                {data.map(({ ncds,
                    because,
                    suggess,
                    imgUrl,
                    videoUrl,
                    ref, }, index) => (
                    <>
                        {suggess &&
                            <div key={index} className="flex flex-col w-full h-full gap-5  p-0  rounded-xl bg-gray-50 grid-cols-3 ">
                                <>
                                    {/* {console.log(suggess)} */}
                                    {imgUrl && <div className="w-full h-96 md:w-full "><CusImage src={imgUrl} alt={ref} className="w-full h-full  " width="100%" height="100%" preview={false} /></div>}
                                    <div className="flex flex-col w-full h-full gap-3 px-5 pb-5 text-center mt-5">
                                        <div className="flex flex-col  ">
                                            <span className="text-4xl text-gray-800 font-Charm "> Hiabetes </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-2xl text-gray-800 font-Charm "> {ncds} </span>
                                        </div>
                                        <div>
                                            <label className='text-green-500 text-4xl '>
                                                แนะนำ
                                            </label>
                                        </div>
                                        <div className=''> {because} </div>
                                        {videoUrl && <a className="max-w-sm md:mx-auto w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(ncds, videoUrl)}  ><VideoCameraOutlined /> แสดงวีดีโอ </a>}
                                    </div>
                                </>
                            </div>
                        }
                    </>
                ))}
                {data.map(({ ncds,
                    because,
                    suggess,
                    imgUrl,
                    videoUrl,
                    ref, }, index) => (
                    <>
                        {!suggess &&
                            <div key={index} className="flex flex-col w-full h-full gap-5  p-0  rounded-xl bg-gray-50 grid-cols-3 ">
                                <>
                                    {/* {console.log(suggess)} */}
                                    {imgUrl && <div className="w-full h-96 md:w-full "><CusImage src={imgUrl} alt={ref} className="w-full h-full  " width="100%" height="100%" preview={false} /></div>}
                                    <div className="flex flex-col w-full h-full gap-3 px-5 pb-5 text-center mt-5">
                                        <div className="flex flex-col  ">
                                            <span className="text-4xl text-gray-800 font-Charm "> Hiabetes </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-2xl text-gray-800 font-Charm "> {ncds} </span>
                                        </div>
                                        <div>
                                            <label className='text-red-500 text-4xl '>
                                                ไม่แนะนำ
                                            </label>
                                        </div>
                                        <div className=''> {because} </div>
                                        {videoUrl && <a className="max-w-sm md:mx-auto w-32  text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(ncds, videoUrl)}  ><VideoCameraOutlined /> แสดงวีดีโอ </a>}
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
    if (!content){return null}
    const { videoUrl, title } = content
    return (
        <>
            <Modal title={<div className='flex w-full justify-between '>{title} <CloseOutlined className="button-cus hover:bg-red-200" onClick={()=>handleCancel()}/></div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
                <div className="h-screen w-full p-0 m-0 "><ReactPlayer url={videoUrl} width="100%" height="100%" /></div>
            </Modal>
        </>
    );
};


export default Ncds