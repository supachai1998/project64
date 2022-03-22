import { useRouter } from 'next/router'
import { Button, Tooltip, Carousel, Card, Divider } from 'antd';
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getCookie, setCookies } from 'cookies-next';
import { serverip } from '/config/serverip'


import BestFood from '../../../components/BestFood';
import BestBlog from '../../../components/BestBlog';

const CustImage = dynamic(() => import("/components/cusImage"))


export default function Index() {
  const router = useRouter()
  const { blog, categories } = router.query
  const [casImg, setCasImg] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setloading] = useState(false)
  const fetechData = async () => {
    setloading(true)
    const data = await fetch(`/api/getBlogs?id=${blog}`).then(res => res.ok && res.json())
    console.log(data)
    if (data) {
      setData(data)
    }
    setloading(false)
  }
  useEffect(() => {
    if (blog && categories) {
      fetechData()
    }
  }, [blog, categories])
  useEffect(() => {
    if (data) {
      const timmer = setInterval(() => {
        setCasImg(casImg => casImg < data.image.length - 1 ? casImg += 1 : casImg = 0)
      }, 10000)
      return () => clearInterval(timmer)
    }
  }, [data, casImg])
  if (!blog) return null
  if (loading) return <>กำลังดึงข้อมูล</>
  if (!data) return null
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="text-center w-full">
        {/* Custom image */}
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className="sm:w-11/12 sm:h-96 h-60"><CustImage className="rounded-lg " src={data?.image[casImg]?.name} alt={data.name} width="100%" height="100%" /></div>
          <div className="flex gap-2">
            {data?.image.map(({ name }, i) => <Tooltip key={i + name} title={`รูป ${i + 1}`}><button onClick={() => setCasImg(i)} className={`w-2 h-2 rounded-full  hover:bg-gray-900 ease-anima ${casImg === i ? "bg-gray-900 animate-pulse" : "bg-gray-400"}`} /></Tooltip>)}
          </div>
        </div>
        {/* Custom image */}
        <p className='sm:w-2/3 w-10/12 text-left ml-auto mr-auto mt-3'>{data.imply}</p>
        <div className='border-green-800 border-b-2 border-solid sm:w-8/12 w-10/12 mx-auto' />
        <div className="flex flex-col gap-2 w-full sm:w-11/12   mt-5 sm:mx-auto">
          {[...data.subBlog,...data.subBlog].map(({ id, name, image, detail }, ind) => <div key={name + ind} className="flex flex-col sm:flex-row shadow-sm bg-white sm:py-3 sm:px-3 rounded-xl  w-full h-full gap-3 ">
            {image && ind % 2 === 0 && <div className="sm:w-3/5  my-auto h-full  ease "><CustImage className="rounded-md h-full" src={image} alt={name} width="100%" height="100%" /></div>}
            <div className={`flex flex-col w-full h-full  ${ind % 2 === 0 ? " text-left" : "text-right"}`}>
              <div className="text-2xl sm:text-5xl sm:px-0 px-2 ease">{name}</div>
              <hr className="my-3"/>
              <div className="text-lg sm:px-0 px-2 ease whitespace-pre-line ">{detail}</div>
            </div>
            {image && ind % 2 === 1 && <div className="sm:w-3/5  my-auto h-full  ease "><CustImage className="rounded-md h-full" src={image} alt={name} width="100%" height="100%" /></div>}
            <hr className="my-3"/>
          </div>)}
        </div>
      </div>

      <div>
        <BestFood />
        <BestBlog />
      </div>
    </div>
  )
}




export async function getServerSideProps({ req, res, query }) {
  try {
    const { blog } = query
    // const token = headers.cookie.split("=")[1].split(";")[0]
    if (/^-?\d+$/.test(blog)) {
      const cookie_ref = getCookie(`blog${blog}`, { req, res })
      if (!cookie_ref) {
        setCookies(`blog${blog}`, true, { req, res, maxAge: 60 * 60 * 24 * 30 })
        console.log("update views", blog)
        fetch(`${serverip}/api/getBlogs?views=${blog}`, { method: "PATCH", })
          .then(resq => resq.ok)
      }

    }
  } catch (e) { }
  return {
    props: {},
  }
}