/* eslint-disable react/jsx-key */
import { Button, Tooltip, Card, Input, message } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState,useRef } from 'react';
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import "owl.carousel/dist/assets/owl.theme.default.css";
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
const CusImage = dynamic(()=>import('./../cusImage.js'));

const {Meta} = Card
const { Search } = Input;

export default function Topic  ({ raw, categories,placeholder }) {
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

            <div className="p-10 pt-0 " ref={displaySearch}>
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
margin={20} >
                {_data && _data.map(({ title, detail, imgUrl }, index) => (
                    <div className='card  p-0 pb-1 mx-5 mt-4'>

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
                        <a onClick={() => router.push(`/foods/${categories}?name=${title}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>

                        </div>
                            
                        </div>
                    </div>
                    // <Card
                    //     className="w-auto "
                    //     key={index+title}
                    //     hoverable
                    //     height={300}
                    //     extra={<a onClick={() => router.push(`/foods/${categories}?name=${title}`)}>อ่านต่อ</a>}
                    //     cover={<CusImage className="duration-150 transform hover:scale-110"
                    //         src={imgUrl} alt={"0"} width="100%" height={200} preview={false} />}
                    // >
                    //     <Tooltip title={`${title} อ่านต่อ`} >
                    //         <Meta className="duration-150 transform hover:scale-110" title={title} description={detail + " กิโลแคลอรี่"} onClick={() => router.push(`/foods/${categories}?name=${title}`)} />
                    //     </Tooltip>
                    // </Card>
                ))}

            </OwlCarousel>
            </div>
        </>
    )
}