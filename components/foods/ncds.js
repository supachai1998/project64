import { Modal, Select  } from 'antd';
import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router';
import { useState } from 'react';
import { VideoCameraOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const ReactPlayer = dynamic(() => import('react-player'), {
    ssr: false,
});

const Owl_Carousel = dynamic(() => import('/components/Owl_Carousel'), {
    ssr: false,
});

const { Option } = Select

const CusImage = dynamic(() => import('./../cusImage.js'));

const NCDS = ({ ncds }) => {
    const [data, setData] = useState(ncds || null)

    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState(3)
    const [contentModal, setContentModal] = useState(null);
    const showModal = (title, video) => {
        setContentModal({
            title: title,
            video: video
        });
    };
    const handleClose = () => {
        setContentModal(null)

    }
    const handleChange = ((value) => {
        setSuggestion(value)
    })


    if (!data) return null
    const total = data.length
    const count_sugess = ncds.filter(item => item.suggess).length
    console.log(ncds)
    return (
        <div className="w-full h-auto sm:px-5">
            <hr className="my-3" />
            <div className="flex justify-center  items-center">
                <p className='w-full' />
                <Select defaultValue={3} onChange={handleChange} >
                    <Option value={3}>ทั้งหมด ({total})</Option>
                    <Option value={2}>แนะนำ ({count_sugess})</Option>
                    <Option value={1}>ไม่แนะนำ ({total - count_sugess})</Option>
                </Select>
            </div>
            {suggestion === 3 ? <>
                <Suggess_true data={data} showModal={showModal} /><hr className='my-3 border-green-600' /> <Suggess_false data={data} showModal={showModal} /> </> :
                suggestion === 2 ? <Suggess_true data={data} showModal={showModal} /> :
                    suggestion === 1 && <Suggess_false data={data} showModal={showModal} />}
            {contentModal && <CusModal contentModal={contentModal} handleClose={handleClose} />}
        </div>
    )
}


const CusModal = ({ handleClose, contentModal }) => {
    const { video, title } = contentModal
    return (
        <Modal title={<div className='flex w-full justify-between '>{title}</div>} visible={!!contentModal} width="100%" height="100%" centered onCancel={handleClose} footer={null} closable={true}>
            <div className="h-screen w-full p-0 m-0 ">
                <ReactPlayer url={video} width="100%" height="100%" />
            </div>
        </Modal>
    );
};
const Suggess_true = ({ data, showModal }) => {
    const router = useRouter()
    const count_suggess = data.map(item => item.suggess).filter(item => item).length
    if (count_suggess === 0) return null
    return <div>
        <p className='w-full text-2xl text-center  text-green-600'>โรคที่แนะนำให้รับประทานได้</p>
        <Owl_Carousel margin={0}>
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
                    ncds,
                    ref, }, index) => (
                    <>

                        {suggess &&
                            <div key={index} className="card-suggession">
                                <>
                                    <CusImage className="rounded-md w-full h-full" src={ncds?.image?.at(0).name} alt={ref} width="100%" height={250} preview={false} />
                                    <div className="card-suggestion-header-content">
                                        <div className="flex flex-col  ">
                                            <span className="card-header"> {ncds?.name_th} </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-sm font-thin text-gray-800 "> {ncds?.name_en} </span>
                                        </div>
                                        <div className='text-green-500 text-2xl '>
                                            แนะนำ
                                        </div>
                                        <span className='text-3-line h-24 hover:full '> {detail}</span>
                                        <hr className='' />
                                        <div className="flex flex-wrap justify-center items-center gap-8 mb-3">
                                            {video && <a className="flex justify-center items-center gap-3 px-6  text-white text-center rounded-full bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(name_th, video)}  ><VideoCameraOutlined /> <span >วิดีโอ</span></a>}
                                            <div className="flex justify-center items-center ">
                                                <a onClick={() => { router.push(`/ncds/${ncds?.id}`) }} className="  text-white text-center rounded-3xl bg-black p-3 px-6 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 ">อ่านต่อ</a>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        }
                    </>
                ))}

            </>
        </Owl_Carousel>
    </div>
}
const Suggess_false = ({ data, showModal }) => {
    const router = useRouter()
    const count_notsuggess = data.map(item => item.suggess).filter(item => !item).length
    if (count_notsuggess === 0) return null
    return <div>
        <p className='w-full text-2xl text-center  text-red-600'>โรคที่ไม่แนะนำให้รับประทาน</p>
        <Owl_Carousel margin={0}>
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
                    ncds,
                    ref, }, index) => (
                    <>
                        {!suggess &&
                            <div key={index} className="card-suggession">
                                <>

                                    <CusImage className="rounded-md" src={ncds?.image?.at(0).name} alt={ref} width="100%" height={250} preview={false} />
                                    <div className="card-suggestion-header-content">
                                        <div className="flex flex-col  ">
                                            <span className="card-header"> {ncds?.name_th} </span>
                                            <div className='border-green-800 border-b-2 border-solid w-1/2 mx-auto' />
                                            <span className="text-sm font-thin text-gray-800 "> {ncds?.name_en} </span>
                                        </div>
                                        <div className='text-red-500 text-2xl '>
                                            ไม่แนะนำ
                                        </div>
                                        <span className='text-3-line h-24 hover:full '> {detail}</span>
                                        <hr className='' />
                                        <div className="flex flex-wrap justify-center items-center gap-10 mb-3">
                                            {video && <a className="flex justify-center items-center gap-3  text-white text-center rounded-full bg-black p-3 px-6 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50" onClick={() => showModal(name_th, video)}  ><VideoCameraOutlined /> <span >วิดีโอ</span></a>}
                                            <div className="flex justify-center items-center ">
                                                <a onClick={() => { router.push(`/ncds/${ncds?.id}`) }} className="  text-white text-center rounded-3xl bg-black p-3 px-6 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 ">อ่านต่อ</a>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        }
                    </>
                ))}
            </>
        </Owl_Carousel>
    </div>
}



export default NCDS
