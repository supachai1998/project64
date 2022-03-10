/* eslint-disable react/jsx-key */
import { Card, Input,notification } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));

export default function _Categories({ fetchData, categories, placeholder }) {

    const [_data, setData] = useState()
    const [title_th, setTitle_th] = useState()
    const [title_en, setTitle_en] = useState()
    const [loading, setLoading] = useState(false)
    const [search_bool, setSearch_bool] = useState(false)
    const refSearchInput = useRef()
    const displaySearch = useRef()
    const router = useRouter()
    const refreshData= async () =>{
        const { title_th, title_en, data } = await fetchData(categories)
        console.log(title_th, title_en, data)
        setData(data)
        setTitle_th(title_th)
        setTitle_en(title_en)
        setSearch_bool(true)
    }
    useEffect(() => {
        if (!_data) {
            refreshData()
        }
    }, [_data, categories, fetchData])
    const handleSearch = () => {
        const val = refSearchInput.current.state.value
        if (!!val && val.length > 2) {
            setLoading(true)
            const timer = setTimeout(async() => {
                const filter = _data.filter(({ title, detail }) => title.toLowerCase().indexOf(val) > -1 || detail.toString().indexOf(val) > -1)
                const _save = _data.filter(({ title, detail }) => !(title.toLowerCase().indexOf(val) > -1 || detail.toString().indexOf(val) > -1 ))
                if (filter.length < 1) {
                    // message.error("ไม่พบข้อมูล") จากที่ดึงมารอบแรก จะวิ่งไปหาใหม่
                     await fetch(`/api/getFood?name=${val}`).then(async res => {
                        if (res.ok) {
                            const _ = await res.json()
                            try {
                                console.log(_)
                                const __ = _.map(_data => { return { id: _data.id, title: _data.name_th, detail: _data.calories, imgUrl: _data.image[0].name || null } })
                                setData([...__, ..._save])
                            } catch (err) { console.error(err);notification.error({ message: `ไม่สามารถแมพข้อมูลอาหาร${val}` }) }
                        } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร${val}` })
                    })
                }
                else{
                    setData([...filter, ..._save])
                }
                setLoading(false)
                displaySearch.current.scrollIntoView()
            }, 1000)
            return () => clearTimeout(timer)
        } 
    }
    const onChange = () => {
        const val = refSearchInput.current.state.value
        if (!!val && val.length <= 1){
            const timer = setTimeout(async() => {
            (async () => {
                refreshData()
            }, 200)})
            return () => clearTimeout(timer)
        }
    }
    if (!!!_data) return <>data not found</>
    return (
        <>

            <div className="grid lg:mx-10">
                <span className="card-header-top">{title_th}</span>
                <div className="search-div-top-1">
                    <div className='search-div-top-2'>
                        <Search className="search-search" disabled={""} onChange={onChange} onSearch={handleSearch} maxLength={30} onPressEnter={handleSearch} loading={loading} enterButton inputMode="search" placeholder={title_th} ref={refSearchInput} />
                        <span className='search-span'>พบ {_data.length} รายการ</span>
                    </div>
                </div>
                <div className='border-b-2 border-solid border-green-800 w-full ' />
            </div>

            <div className="gap-1  lg:grid-cols-4 sm:grid sm:grid-cols-2" ref={displaySearch}>
                {_data && _data.map(({ id, title, detail, imgUrl }, index) => (
                    <div key={index} className='card  p-0  sm:mx-2 lg:mx-5 mt-3 pb-3'>
                        <CusImage className="duration-150 transform " src={imgUrl} alt={"0"} width="100%" height={200} preview={false} />
                        <div className='mx-5 mb-2 lg:mb-10'>
                            <div className=" flex-col text-center mb-0">
                                <p className="card-header"> {title}</p>
                                <p className="font-Charm text-xs pb-0 truncate text-gray-500"> {title_en}</p>
                            </div>
                            <div className='text-center leading-none text-2xl '>

                                <p className='mb-0 font-bold'>{detail}</p>
                                <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                            </div>
                            <hr className='mb-3' />
                            <div className='flex justify-center justify-items-center '>
                                <a onClick={() => router.push(`/foods/${categories}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50'>อ่านต่อ</a>
                            </div>

                        </div>
                    </div>

                ))}
            </div>
        </>
    )
}