import { Modal } from "antd"
import { useRef, useState } from "react"
import { VideoCameraOutlined, CloseOutlined } from '@ant-design/icons';
import ReactPlayer from 'react-player';

export default function ContentHeader({ headerData, url_yt }) {
    const [ind, setInd] = useState(0)
    const [content, setContent] = useState()
    const dataRef = useRef([])
    const menu_click = (ind) => {
        setInd(ind)
        dataRef.current[ind].scrollIntoView()
    }
    const handleCancel = () => {
        setContent()
    }
    if (!headerData) return null
    return (
        <div className="flex flex-wrap sm:p-6 p-3 rounded-md sm:mx-10 bg-gray-50 h-full">

            <div className="mb-5 -ml-2  text-xs lg:text-sm font-bold  flex-col flex w-full text-center lg:flex-row  ">
                {headerData.map(({ title, content }, index) =>
                    <button key={index}
                        className={ind === index ?
                            "text-black hover:text-black rounded-md border-black border-2 mx-1 p-2  mb-2" :
                            "text-gray-500 hover:text-gray-500 rounded-md border-gray-300 border-2 mx-1 p-2  mb-2"}
                        onClick={() => menu_click(index)}
                    >{title}</button>
                )}
            </div>
            {headerData.map(({ title, content }, index) => (
                <div key={index} className="w-full grid grid-cols-1" ref={el => dataRef.current[index] = el}>
                    <div className={`pl-1 text-xl font-thin border-l-2 border-green-600 lg:text-4xl mb-2 ${index !== 0 && "mt-4"}`}>{title}</div>
                    {title !== "อ้างอิง" ? <div className={index % 2 === 0
                        ? "pl-1 sm:mx-5  sm:text-sm whitespace-pre-line text-md "
                        : "pl-1 sm:mx-5 sm:h-full sm:text-sm whitespace-pre-line text-md"} >
                        {content}
                    </div> :
                        content.map(({ url }, ind) => <div key={url} className="sm:pl-5 pl-1">
                            <a target="_blank" href={url.trim().split(",").at(-1)} className='text-md whitespace-pre-line' rel="noreferrer">{url}</a>
                        </div>)
                    }
                    <hr className="sm:my-5 sm:visible invisible" />
                </div>
            ))}
            <div className="flex justify-end items-start w-full sm:mt-0 mt-2">

                <button href="#" className="w-32 sm:text-lg border flex gap-2 justify-center items-center   rounded-3xl bg-white sm:p-3 p-1  ease-anima hover:text-blue-400 shadow-lg shadow-cyan-500/50" onClick={() => { setContent({ name_th: "วิดีโอ", video: url_yt }) }}>
                    <i><VideoCameraOutlined className='text-lg' /></i>
                    <span>ดูวิดีโอ</span>
                </button>
            </div>
            {content && <CusModal handleCancel={handleCancel} content={content} />}
        </div>
    )
}

const CusModal = ({ handleCancel, content }) => {
    if (!content) return null
    const { name_th, video } = content
    return (
        <Modal title={<div className='flex w-full justify-between text-2xl '>{name_th} <CloseOutlined className="button-cus hover:bg-red-200" onClick={() => handleCancel()} /></div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={false}>
            <div className="h-96 sm:h-screen w-full p-0 m-0 "><ReactPlayer url={video} width="100%" height="100%" /></div>
        </Modal>
    );
};
