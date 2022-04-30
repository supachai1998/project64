/* eslint-disable react/jsx-key */
import { Card, Input, notification } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, useContext } from 'react';
import { _AppContext } from '/pages/_app'
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));
const CusInput = dynamic(() => import('/components/cusInput.js'));

export default function _Categories({ fetchData, categories, store, setStore, placeholder, _data, setData }) {

    const [loading, setLoading] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const refSearchInput = useRef()
    const displaySearch = useRef()
    const router = useRouter()
    const { setTitle, setDefaultSelectedKeys } = useContext(_AppContext)
    const refreshData = async () => {
        setLoading(true)
        const raw = await fetchData(categories)
        if (!raw) { setLoading(false); return null }
        const { title_th, title_en, data } = raw
        setData(data)
        setStore(data)
        setLoading(false)
        setDefaultSelectedKeys(`foods_${categories}`)
        setTitle(`ประเภทอาหาร ${title_th}`)
    }
    useEffect(() => {
        if (!_data && categories) {
            refreshData()
        }
    }, [_data, categories, fetchData])
    const handleSearch = async () => {
        const val = refSearchInput.current.state.value
        if (!!val && val.length > 2) {
            setLoading(true)
            await fetch(`/api/getFood?name=${val}&categories=${categories}`).then(async res => {
                if (res.ok) {
                    const _ = await res.json()
                    try {
                        console.log(_)
                        const __ = _.map(_data => { return { id: _data.id, title: _data.name_th, detail: _data.calories, imgUrl: _data.image[0].name || null } })
                        setData(__)
                    } catch (err) { console.error(err); notification.error({ message: `ไม่สามารถแมพข้อมูลอาหาร${val}` }) }
                } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร${val}` })
            })
        }
        else {
            setData(store)
        }
        setLoading(false)
        displaySearch.current.scrollIntoView()
    }

    const onChange = () => {
        const val = refSearchInput.current.state.value
        if (!!val && val.length <= 1) {
            const timer = setTimeout(async () => {
                (async () => {
                    refreshData()
                }, 500)
            })
            return () => clearTimeout(timer)
        }
    }
    if (loading) return <>กำลังดึงข้อมูล</>
    if (!!!_data) return <>ไม่พบข้อมูล</>
    return (
        <>

            <div className="grid lg:mx-10">
                {/* <span className="card-header-top">{title_th}</span> */}
                <div className='my-3'>
                    <CusInput only="food" _api={`/api/getFood?categories=${categories}`} data={_data} setData={setData} store={store} setStore={setStore} loading={loadingSearch} setLoading={setLoadingSearch} />
                </div>
                <div className='border-b-2 border-solid border-green-800 w-full my-3' />
            </div>
            {/* const __ = _.map(_data => { return { id: _data.id, title: _data.name_th, detail: _data.calories, imgUrl: _data.image[0].name || null } })
                        setData(__) */}
            <div className="gap-1  lg:grid-cols-4 sm:grid sm:grid-cols-2" ref={displaySearch}>
                {_data && _data.map(({ id, title, detail, imgUrl , name_th,name_en , calories , image }, index) => (
                    <div key={index} className='card  p-0  sm:mx-2 lg:mx-5 mt-3'>
                        <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={250} preview={false} />
                        <div className='mx-5 mb-2 lg:mb-10 flex flex-col gap-3'>
                            <div className=" flex-col text-center mb-0">
                                <p className="card-header pt-3"> {name_th}</p>
                                <hr className='my-3 mx-20 border-b border-blue-900' />
                                <p className=" text-xs sm:text-sm pb-0 truncate text-gray-500 capitalize "> {name_en}</p>
                            </div>
                            <div className='text-center leading-none text-2xl '>
                                <p className='mb-0 font-bold'>{calories}</p>
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