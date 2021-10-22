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
    return (
        <>
            <div className="flex justify-start ">
                <span className="w-full text-2xl font-bold font-Charm ">{title_th}</span>
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