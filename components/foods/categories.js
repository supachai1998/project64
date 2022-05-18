/* eslint-disable react/jsx-key */
import { Card, Input, notification } from 'antd';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { _AppContext } from '/pages/_app'
const { Meta } = Card
const { Search } = Input;
const CusImage = dynamic(() => import('./../cusImage.js'));
const CusInput = dynamic(() => import('/components/cusInput.js'));

export default function _Categories({ categories, store, setStore, placeholder, _data, setData }) {

    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const router = useRouter()
    const { setTitle, setDefaultSelectedKeys, foodType } = useContext(_AppContext)
    const refreshData = async () => {
        if(!foodType) return
        setLoading(true)
        const { id, name_th, name_en } = foodType.find(item => item.id === parseInt(categories))
        const query_data = await fetch(`/api/getFood?categories=${id}`).then(async res => {
            if (res.ok) {
                const _ = await res.json()
                try {
                    // const __ = _.map(data => { return { id: data.id, title: data.name_th, detail: data.calories, imgUrl: data.image[0].name || null } })
                    return _
                } catch (err) { console.error(err); notification.error({ message: `ไม่สามารถแมพข้อมูลอาหาร${categories}` }) }
            } else notification.error({ message: `ไม่สามารถดึงข้อมูลอาหาร${categories}` })
        })
        setData(query_data)
        setStore(query_data)
        setLoading(false)
        setDefaultSelectedKeys(`foods_${categories}`)
        setTitle(`ประเภทอาหาร ${name_th}`)

    }
    useEffect(() => {
        if (!_data && categories) {
            refreshData()
        }
    }, [_data, categories])

    if (loading) return <>กำลังดึงข้อมูล</>
    if (!!!_data) return <>ไม่พบข้อมูล</>
    return (
        <>

            <div className="grid lg:mx-10">
                {/* <span className="card-header-top">{title_th}</span> */}
                <div className='my-3'>
                    <CusInput only="food" _api={`/api/getFood?categories=${categories}`} data={_data} input={input} setInput={setInput} setData={setData} store={store} setStore={setStore} loading={loadingSearch} setLoading={setLoadingSearch} />
                </div>
                <div className='border-b-2 border-solid border-green-800 w-full my-3' />
            </div>
            {/* const __ = _.map(_data => { return { id: _data.id, title: _data.name_th, detail: _data.calories, imgUrl: _data.image[0].name || null } })
                        setData(__) */}
            <div className="gap-5  lg:grid-cols-4 sm:grid sm:grid-cols-2" >
                {_data && _data.map(({ id, title, detail, imgUrl, name_th, name_en, calories, image }, index) => (
                    <div key={index} className='card  p-0  sm:mx-2 lg:mx-5 mt-3'>
                        <CusImage className="duration-150 transform " src={image[0].name} alt={"0"} width="100%" height={250} preview={false} />
                        <div className='mx-5  flex flex-col gap-3'>
                            <div className=" flex-col text-center mb-0">
                                <p className="card-header pt-3"> {name_th}</p>
                                <hr className='my-3 mx-20 border-b border-blue-900' />
                                <p className=" text-sm sm:text-nd pb-0 truncate text-gray-500 capitalize "> {name_en}</p>
                            </div>
                            <div className='text-center leading-none text-2xl '>
                                <p className='mb-0 font-bold'>{calories}</p>
                                <p className='text-sm sm:text-xl text-gray-500'>กิโลแคลอรี่</p>
                            </div>
                            <hr className='mt-3' />
                            <div className='flex justify-center justify-items-center '>
                                <a onClick={() => router.push(`/foods/${categories}/${id}`)} className='w-32 mx-auto text-white text-center rounded-3xl bg-black p-3 hover:text-white hover:bg-gray-800 shadow-lg shadow-cyan-500/50 mb-3'>อ่านต่อ</a>
                            </div>

                        </div>
                    </div>

                ))}

            </div>
        </>
    )
}