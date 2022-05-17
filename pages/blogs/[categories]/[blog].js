import { useRouter } from 'next/router'
import { Tooltip, Modal, Rate, notification } from 'antd';
import { useState, useEffect, useContext } from 'react'
import dynamic from 'next/dynamic'
import { getCookie, setCookies } from 'cookies-next';
import { serverip } from '/config/serverip'
import { _AppContext } from '/pages/_app'
import { VideoCameraOutlined } from '@ant-design/icons';


const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
});

const BestFood = dynamic(() => import('../../../components/BestFood'))
const BestBlog = dynamic(() => import('../../../components/BestBlog'))
const CustImage = dynamic(() => import("/components/cusImage"))
const { confirm } = Modal;


/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
export default function Index(props) {
  const router = useRouter()
  const { blog, categories } = router.query
  const [casImg, setCasImg] = useState(0)
  const [data, setData] = useState(null)
  const [loading, setloading] = useState(false)
  const { setTitle, setDefaultSelectedKeys } = useContext(_AppContext)
  const [userVote, setUserVote] = useState()
  const [content, setContent] = useState()
  const fetechData = async () => {
    setloading(true)
    const data = await fetch(`/api/getBlogs?id=${blog}`).then(res => res.ok && res.json())
    if (data) {
      setData(data)
      setTitle(data?.name)
    }
    setloading(false)
  }
  const fetechDataRate = async () => {
    const data = await fetch(`/api/getBlogs?id=${blog}`).then(res => res.ok && res.json())
    if (data) {
      setData(data)
    }
  }
  useEffect(() => {
    setUserVote(getCookie(`getBlogs${blog}`))
    setDefaultSelectedKeys(`blogs_${categories}`)
    if (blog && categories) {
      fetechData()
    }
    return () => {
      setUserVote()
    }
  }, [blog, categories])
  useEffect(() => {
    if (data) {
      const timmer = setInterval(() => {
        setCasImg(casImg => casImg < data?.image.length - 1 ? casImg += 1 : casImg = 0)
      }, 10000)
      return () => clearInterval(timmer)
    }
  }, [data, casImg])
  if (!blog) return null
  if (loading) return <div className='min-h-screen'>กำลังดึงข้อมูล</div>
  if (!data) return <div className='min-h-screen'>ไม่พบข้อมูล</div>
  const rateChange = async val => {
    if (val > 0) {
      await confirm({
        title: <>ให้คะแนน {val} </>,
        content: <p>ชื่อบทความ : {data?.name} <br />คะแนน : {val}</p>,
        okText: "ตกลง",
        cancelText: "ยกเลิก",
        async onOk() {
          const result = await fetch(`/api/getBlogs?id=${blog}&vote=vote_${val}`, { method: "PATCH", }).then(async res => res.ok && res.json())
          // console.log(result)
          if (result) {
            // console.log("fetechData")
            setCookies(`getBlogs${blog}`, true, { maxAge: 60 * 60 * 24 * 30 })
            await fetechDataRate()
            setUserVote(true)
            notification.success({ message: 'ให้คะแนนบทความสำเร็จ', })
          } else {
            notification.error({ message: 'ไม่สามารถให้คะแนนบทความ', })
          }
          Modal.destroyAll();
        },
        onCancel() { },
      });
    }
  }
  const handleCancel = () => {
    setContent()
}
  if (data?.approve === 2) return <div className="flex flex-col min-h-screen text-center text-4xl text-red-600">ไม่สามารถเข้าถึงบทความ</div>
  return (<>
    {data?.approve === 0 && <div className="flex flex-col  justify-end items-center bg-white rounded-lg py-10 my-10 gap-3">
      <span className="text-red-500 text-3xl mx-auto  px-10 w-full whitespace-pre-line ">บทความยังไม่ได้รับการอนุมัติ จะไม่ถูกแสดงผลบนเว็บไซต์จนกว่าจะได้รับการอนุมัติ</span>
      <button className="bg-yellow-200 w-24 hover:bg-yellow-300 text-sm  text-gray-800" onClick={() => router.push({ pathname: `/blogs/write`, query: { id: data?.id } })}>แก้ไข</button>
      <button className="bg-red-200 w-24 hover:bg-red-300 text-sm  text-gray-800" onClick={() => { showConfirmDel(data, router); }}>ลบ</button>
    </div>}
    <div className="flex flex-col min-h-screen ">
      <div className="text-center w-full ">
        {/* Custom image */}
        <div className='flex flex-col justify-center items-center gap-6'>
          {/* {console.log(data?.approve)} */}

          <div className="sm:w-7/12 w-full sm:h-96 h-60 relative">
            {!!data?.image && <CustImage className="rounded-lg " src={data?.image[casImg]?.name} alt={data?.name} width="100%" height="100%" />}
            <div className='right-0 bottom-1 absolute rounded-md py-1 px-2 bg-gray-900 text-white items-center flex gap-2'>
              <span className='mt-1'>{data?.avg_vote}</span><Rate disabled={data?.approve === 0 || userVote} defaultValue={userVote && data?.avg_vote} onChange={rateChange} tooltips={[`${data?.vote_1} โหวต`, `${data?.vote_2} โหวต`, `${data?.vote_3} โหวต`, `${data?.vote_4} โหวต`, `${data?.vote_5} โหวต`,]} />
            </div>
          </div>
          <div className="flex gap-2">
            {data?.image.map(({ name }, i) => <Tooltip key={i + name} title={`รูป ${i + 1}`}><button onClick={() => setCasImg(i)} className={`w-2 h-2 rounded-full  hover:bg-gray-900 ease-anima ${casImg === i ? "bg-gray-900 animate-pulse" : "bg-gray-400"}`} /></Tooltip>)}
          </div>

        </div>
        {/* Custom image */}
        <p className='sm:w-2/3 w-10/12 text-left ml-auto mr-auto mt-3 pb-3'>{data?.imply}</p>
        {/* <div className="float-right button flex flex-col  group text-black bg-gray-100 hover:text-white hover:bg-gray-900">
          <span>ให้คะแนน</span>
          <div className='hidden group-hover:block ease '><Rate tooltips={["1 ดาว", "2 ดาว", "3 ดาว", "4 ดาว", "5 ดาว",]} onChange={rateChange} /></div>
        </div> */}
        <div className='border-green-800 border-b-2 border-solid sm:w-8/12 w-10/12 mx-auto ' />
        <div className="flex flex-col gap-2 w-full sm:w-6/12  mb-5  mt-10 sm:mx-auto bg-white">
          {[...data?.subBlog].map(({ id, name, image, detail }, ind) => <div key={name + ind} className="flex flex-col sm:flex-row   sm:py-3 sm:px-3 rounded-xl  w-full h-full gap-3 ">
            <div className={`flex flex-col w-full h-full  text-left `}>
              {image?.name && <div className="flex justify-center mx-auto  w-full sm:w-11/12"><CustImage className="rounded-md mx-auto h-full" src={image.url} alt={name} width="100%" height="100%" /></div>}
              <div className="text-2xl sm:text-3xl sm:px-0 px-2 ease my-5">{name}</div>
              <hr className="my-3" />
              <div className="text-lg sm:px-0 font-thin px-2 ease whitespace-pre-wrap my-5">{detail}</div>
            </div>
            {/* {image && ind % 2 === 1 && <div className="sm:w-3/5  my-auto h-full  ease "><CustImage className="rounded-md h-full" src={image} alt={name} width="100%" height="100%" /></div>} */}
            <hr className="my-3" />
          </div>)}
          <hr className="my-3" />
          <div className="flex flex-col m-3 justify-start flex-warp w-full overflow-hidden p-1">
            <h3 className="text-left">อ้างอิง</h3>
            {data?.ref && data?.ref.length > 0 && data?.ref.map(({ url }, index) =>
              <><a href={url.split(",").at(-1)} target="_blank" key={index} className='text-left hover:underline text-black whitespace-pre-wrap ' rel="noreferrer">{url}</a><br /> </>
            )}
          </div>
          {data?.video && <div className="flex justify-end w-full "> 
                                     <button href="#" className="w-32 mb-3 mr-3 text-lg border rounded-3xl bg-white sm:p-3 p-1  ease-anima hover:text-blue-400 shadow-lg shadow-cyan-500/50" onClick={() => { setContent({ name_th: data?.name, video: data?.video }) }}> <i><VideoCameraOutlined className='text-lg' /></i> <span> ดูวิดีโอ</span></button> </div>}

        </div>

        <p className='text-right'>ยอดเข้าชม {data?.views} ครั้ง</p>
      </div>

      <div>
        <BestFood title="อาหารแนะนำ" />
        <BestBlog title="บทความแนะนำ" />
      </div>
      {content && <CusModal handleCancel={handleCancel} content={content} />}
    </div>
  </>
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
        // console.log("update views", blog)
        fetch(`${serverip}/api/getBlogs?views=${blog}`, { method: "PATCH", })
          .then(resq => resq.ok)
      }

    }
  } catch (e) { }
  return {
    props: {},
  }
}

const showConfirmDel = async (val, router) => {
  console.log("delete", val)
  confirm({
    title: `คุณต้องการจะลบบทความ`,
    content: <div>
      <p>{val.name}</p>
      <p>ประเภท : {val.type}</p>
    </div>,
    okText: "ตกลง",
    okType: "danger",
    cancelText: "ยกเลิก",
    async onOk() {
      const res = await fetch("/api/getBlogs", {
        headers: { 'Content-Type': 'application/json', },
        method: "DELETE",
        body: JSON.stringify({ id: val.id })
      })
      if (res.status === 200) {
        notification.success({
          message: 'ลบข้อมูลสำเร็จ',
        })
        router.push({ pathname: `/blogs` })
      } else {
        notification.error({
          message: 'ไม่สามารถลบข้อมูลได้',
          description: 'ไม่สามารถติดต่อ server ',
        })
      }
    },
    onCancel() { },
  });
}

const CusModal = ({ handleCancel, content }) => {
  if (!content) return null
  const { name_th, video } = content
  return (
      <Modal title={<div className='flex w-full justify-between text-2xl '>{name_th} </div>} visible={true} width="100%" height="100%" centered onCancel={handleCancel} footer={null} closable={true}>
          <div className="h-96 sm:h-screen w-full p-0 m-0 "><ReactPlayer url={video} width="100%" height="100%" /></div>
      </Modal>
  );
};
