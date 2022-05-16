import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useState, useEffect, useContext } from 'react'
import { notification } from 'antd'
import { _AppContext } from '/pages/_app'

// import { notification } from 'antd'

const DisplayBlogReadMore = dynamic(() => import("/components/displayBlogReadMore"),
  { ssr: false })

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Index(props) {
    const [data, setData] = useState()
    const [store, setStore] = useState()
    const router = useRouter()
    const { categories } = router.query
    useEffect(()=>{
        return () => setData()
    },[categories])


  return (
    <div className="flex flex-col min-h-screen h-full">
      <div className=''>
        
        {
              categories === "ncds" ?
                <DisplayBlogReadMore className="h-fix73"  data={data} store={store} setStore={setStore}  setData={setData} getData={getData}  title={`บทความโรคไม่ติดต่อ`} link={false} />
                : categories === "food" ?
                  <DisplayBlogReadMore className="h-fix73" data={data} store={store} setStore={setStore} setData={setData} getData={getData} title={`บทความอาหาร`} link={false} />
                  :
                  <DisplayBlogReadMore className="h-fix73" data={data} store={store} setStore={setStore} setData={setData} getData={getData} title={`บทความอาหารและโรค`} link={false} />
        }
      </div>
    </div>
  )
}

const getData = async (categories) => {
  const _ = await fetch(`/api/getBlogs?type=${categories}`).then(async res => {
    if (res.ok) {
      let _ = await res.json()
      _ = _.map((_data) => {
        if (_data.approve === 1) return {
          ..._data,
          id: _data.id,
          title: _data.name,
          intro: _data.imply,
          type: _data.type.toLowerCase(),
          detail: _data.detail,
          ref: _data.ref,
          avg_vote: _data.avg_vote,
          total_vote: _data.total_vote,
          views: _data.views,
          imgUrl: _data.image[0].name || null
        }

      })
      return _
    } else {
      res.status === 404 ? notification.error({ message: "ไม่พบข้อมูล" }) : notification.error({ message: "ไม่สามารเชื่อมต่อฐานข้อมูล" })
      return []
    }
  })
  return _
}

export async function getServerSideProps(ctx) {
  return {
    props: {}, // will be passed to the page component as props
  }
}

