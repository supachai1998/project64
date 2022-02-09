/* eslint-disable react/jsx-key */
import { Button, Tooltip, Card, Input, message } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState,useRef } from 'react';

const {Meta} = Card
const { Search } = Input;
const CusImage = dynamic(()=>import('./../cusImage.js'));

export default function _Categories  ({ raw, categories,placeholder }) {
    const { title_th, title_en, data } = raw
    const [_data , setData] = useState(data)
    const [loading , setLoading] = useState(false)
    const refSearchInput = useRef()
    const displaySearch =  useRef()
    const router = useRouter()
    const handleSearch = () =>{
        const val = refSearchInput.current.state.value
        if(!!val && val.length > 2) {
            setLoading(true)
            const timer  =setTimeout(()=>{
                const filter =  _data.filter(({title,detail})=>title.toLowerCase().indexOf(val) > -1 || detail.toString().indexOf(val) > -1 )
                if(filter.length  < 1 ) message.error("ไม่พบข้อมูล")
                else setData(filter)
                setLoading(false)
                displaySearch.current.scrollIntoView()
            },1000)
            return () => clearTimeout(timer)
        }else{
            setData(data)
        }
    }
    const onChange = () =>{
        const val = refSearchInput.current.state.value
        if(!!val && val.length <= 1) setData(data)
    }
    return (
        <>

            <div className="grid mx-10">
                <span className="w-full text-3xl font-bold font-Charm text-center">{title_th}</span>
                <div className='grid justify-items-center'>
                    <span className='border-b-2 border-solid border-green-800 w-full mx-10 justify-center text-right font-Poppins'>ทั้งหมด 10 รายการ</span>
                </div>
                
            </div>

            <div className="p-10 pt-0 flex flex-wrap  " ref={displaySearch}>
                {_data && _data.map(({ title, detail, imgUrl }, index) => (
                    <div className='card  p-0 pb-1 mx-10'>
                        <CusImage className="duration-150 transform " src={imgUrl} alt={"0"} width="100%" height={200} preview={false} />
                        <div className='mx-5 mb-10'>
                        <div className=" flex-col text-center mb-0">
                            <p className="font-Charm text-3xl title-article pb-0 truncate mb-2"> {title}</p>
                            <p className="font-Charm text-xs pb-0 truncate text-gray-500"> {title_en}</p>
                        </div>
                        <div className='text-center leading-none text-2xl '>

                            <p className='mb-0 font-bold'>{detail}</p>
                            <p className='text-xl text-gray-500'>กิโลแคลอรี่</p>
                        </div>
                        <hr className='mb-5'/>
                        <div className='flex justify-center justify-items-center '>
                        <a onClick={() => router.push(`/foods/${categories}/${title}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>

                        </div>
                            
                        </div>
                    </div>

                ))}
            </div>
        </>
    )
}