import { Button, Tooltip, Card, Input, message } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState,useRef } from 'react';

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
            <div className="flex justify-between ">
                <span className="w-full text-4xl font-bold font-Charm ">{title_th}</span>
                <Search className="w-1/4 input search loading with enterButton" disabled={loading} onChange={onChange} onSearch={handleSearch}  maxLength={30} onPressEnter={handleSearch} loading={loading} enterButton inputMode="search"  
                placeholder={placeholder} ref={refSearchInput}/>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3" ref={displaySearch}>
                {_data && _data.map(({ title, detail, imgUrl }, index) => (
                    <Card
                        className="w-auto "
                        key={index+title}
                        hoverable
                        height={300}
                        extra={<a onClick={() => router.push(`/foods/${categories}?name=${title}`)}>อ่านต่อ</a>}
                        cover={<CusImage className="duration-150 transform hover:scale-110"
                            src={imgUrl} alt={"0"} width="100%" height={200} preview={false} />}
                    >
                        <Tooltip title={`${title} อ่านต่อ`} >
                            <Meta className="duration-150 transform hover:scale-110" title={title} description={detail + " กิโลแคลอรี่"} onClick={() => router.push(`/foods/${categories}?name=${title}`)} />
                        </Tooltip>
                    </Card>
                ))}

            </div>
        </>
    )
}