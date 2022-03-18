import '../styles/globals.css'
import 'antd/dist/antd.css';
import "nprogress/nprogress.css";

import 'owl.carousel/dist/assets/owl.carousel.css';
import "owl.carousel/dist/assets/owl.theme.default.css";

import thTh from 'antd/lib/locale/th_TH';
import React, { useState, useEffect } from 'react'
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useRouter, } from 'next/router'
import Head from 'next/head'
import { Layout, Menu, Tooltip, Button, ConfigProvider, notification } from 'antd';
import {
  MenuOutlined,
  AppleOutlined,
  FormOutlined,
  MedicineBoxOutlined,
  PieChartOutlined,
  HomeOutlined as HomeIcon,
  LogoutOutlined as LogoutOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic'
const { Header, Sider, Content } = Layout;
React.useLayoutEffect = React.useEffect
const { SubMenu } = Menu;

const animationZoomHover = "transition duration-500 ease-in-out transform  hover:scale-120"



function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // const [queryClient] = React.useState(() => new QueryClient())
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(isMobile)
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState()
  const [title, setTitle] = useState()
  const [ncds, setNCDS] = useState()
  const [blogs, setBlogs] = useState([
    { name_th: "โรคไม่ติดต่อเรื้อรัง", name_en: "NCDS" }, { name_en: "FOOD", name_th: "อาหาร" }, { name_en: "ALL", name_th: "ทั้งหมด" }
  ])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _title = localStorage?.getItem('title') || ""
      setTitle(_title)
    }

  }, [title])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keys = localStorage?.getItem('keys') || "/"
       setDefaultSelectedKeys(keys)
    }

  }, [defaultSelectedKeys])

  const toggle = () => { setCollapsed(!collapsed) }

  useEffect(() => {// call api machine learning 
    // set up heroku
    !ncds && fetch(`/api/getNCDS`)
      .then(async res => res.ok && res.json())
      .then(data => setNCDS(data))
      .catch(err => notification.error({ message: err.message }))
    !ncds && fetch(`/api/predict`, { method: "GET", headers: { 'Content-Type': 'application/json', } })
  }, [])

  const handleMenuClick = (val) => {
    // console.log(keyPath)
    // Array(3) [ "report_blogs_food", "report", "admin" ]
    localStorage.setItem('keys', val.key);
    setDefaultSelectedKeys(val.key);
    if(val.keyPath.length > 1){
      router.push(`/${val.keyPath[1]}/${val.keyPath[0].split("_")[1]}`)
    }
  }
  const handleSubMenuClick = (name) => {
    localStorage.setItem('title', name);
    setTitle(name)
  }
  const handleMenu = (en, th) => {
    localStorage.setItem('title', th);
    localStorage.setItem('keys', en);
    setTitle(th);
    setDefaultSelectedKeys(en);
    router.push(`/${en}`);
    setCollapsed(true)
  }

  return (
    // <QueryClientProvider client={queryClient}>

    //   <Hydrate state={pageProps.dehydratedState}>
    <SessionProvider session={session}>
      <Layout className="h-full min-h-screen">
        <TopProgressBar />
        <Head>
          <title >{title}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <NavBar blogs={blogs} ncds={ncds} handleMenuClick={handleMenuClick} handleMenu={handleMenu} handleSubMenuClick={handleSubMenuClick} collapsed={collapsed} setCollapsed={setCollapsed} defaultSelectedKeys={defaultSelectedKeys} />

        <Layout className="site-layout">
          <Header className="flex justify-start space-x-6 item-center site-layout-background" style={{ margin: 0, padding: 0 }} >
            <Tooltip title="เมนู">
              <div className='px-3 my-auto text-lg text-white trigger hover:border-gray-50 hover:scale-110' onClick={toggle}>
                {collapsed === null ? <></>
                  : collapsed === true ? <MenuOutlined className={animationZoomHover} />
                    : <MenuOutlined className={animationZoomHover} />}
              </div>
            </Tooltip>
            <p className="my-auto ml-2 md:text-3xl text-xl ease-anima text-white">{title}</p>
          </Header>
          <Content
            className="sm:p-2 site-layout-background"
          >
            <ConfigProvider locale={thTh}>
              <Component onClick={() => setCollapsed(true)} {...pageProps} />
            </ConfigProvider>
          </Content>
          {/* <Navigator /> */}
        </Layout>

      </Layout>
    </SessionProvider>
    //   </Hydrate>

    // </QueryClientProvider>
  )
}
export default MyApp

const NavBar = ({ blogs, ncds, handleMenu, handleSubMenuClick, collapsed, setCollapsed, defaultSelectedKeys, handleMenuClick }) => {
  const [foodType, setFoodType] = useState(null)
  const { status } = useSession()
  useEffect(() => {
    if (status === "authenticated") {
      setCollapsed(null)
    } else if (status === "unauthenticated") {
      setCollapsed(true)
    }
  }, [status])
  useEffect(() => {
    (async () => {
      const data = await fetch("/api/getTypeFood").then(res => res.ok && res.json())
      Array.isArray(data) && setFoodType(data)
    })()
  }, [status])
  return <>
    {status === "authenticated" && <div className="absolute right-0 h-full top-3 ">
      <Button
        icon={<LogoutOutlined style={{ width: "18px", height: "18px" }} />}
        onClick={() => { setCollapsed(true); signOut({ redirect: false }) }}>ออกจากระบบ</Button>
    </div>}
    {status === "unauthenticated" && <Sider trigger={null} collapsible breakpoint="lg" width={`${isMobile ? 15 : 20}em`} collapsedWidth={`${isMobile ? 30 : 45}`} defaultCollapsed={collapsed} collapsed={collapsed}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys} selectedKeys={defaultSelectedKeys} onClick={handleMenuClick} >
        {status === "unauthenticated" ? <>
          <Menu.Item key="/" icon={<HomeIcon style={{ width: "18px", height: "18px" }} />}
            onClick={() => { handleMenu('', 'ใส่ใจโรคไม่ติดต่อเรื้อรัง (NCDs Care)') }}>หน้าหลัก</Menu.Item>
          <SubMenu key="ncds" icon={<MedicineBoxOutlined />} title="โรคไม่ติดต่อเรื้อรัง">
            {!!ncds && ncds.map(({ id,name_en, name_th },index) =>
              <Menu.Item key={`ncds_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="form" icon={<MedicineBoxOutlined />} title="แบบประเมินโรค">
            {!!ncds && ncds.map(({ id,name_en, name_th },index) =>
              <Menu.Item key={`form_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="foods" icon={<AppleOutlined />} title="ประเภทอาหาร" >
            {!!foodType && foodType?.map(({ id,name_en, name_th },index) =>
              <Menu.Item key={`foods_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="blogs" icon={<FormOutlined />} title="บทความ">
            {!!blogs && blogs.map(({ id,name_en, name_th },index) =>
              <Menu.Item key={`blogs_${name_en.toLowerCase()}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
        </>
          : <>
            {/* {typeAdmin.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleMenu(`admin/${key}`, name)}>{name}</Menu.Item>
            )}
            <SubMenu key="report" icon={<PieChartOutlined />} title="รายงาน">
              {typeReport.map(({ name, key }) =>
                <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
              )}
            </SubMenu>
            <Menu.Item key="logout" icon={<LogoutOutlined style={{ width: "18px", height: "18px" }} />}
              onClick={() => signOut()}>ออกจากระบบ</Menu.Item> */}
          </>
        }
      </Menu>
    </Sider>}</>
}

const TopProgressBar = dynamic(
  () => {
    return import("/components/TopProgressBar");
  },
  { ssr: false },
);


// const Navigator = dynamic(
//   () => {
//     return import("/components/navigator");
//   },
//   { ssr: false },
// );


// const typeFood = [
//   { key: "fried", name: "ทอด" },
//   { key: "soup", name: "ต้ม" },
//   { key: "steam", name: "นึ่ง" },
//   { key: "sweets", name: "ขนมหวาน" },
//   { key: "grilled", name: "ย่าง" },
//   { key: "fry", name: "ผัด" },
//   { key: "mix", name: "ยำ" }
// ]
const typeNcds = [
  { key: "diabetes", name: "โรคเบาหวาน" },
  { key: "pressure", name: "โรคความดันโลหิตสูง" },
  { key: "emphysema", name: "โรคหัวใจ" },
  { key: "staggers", name: "โรคสมอง" },
  { key: "cancer", name: "โรคมะเร็ง" },
  { key: "central_obesity", name: "โรคอ้วนลงพุง" },
]
const typeForm = [
  { key: "form_diabetes", name: "โรคเบาหวาน" },
  { key: "form_pressure", name: "โรคความดันโลหิตสูง" },
  { key: "form_emphysema", name: "โรคถุงลมโป่งพอง" },
  { key: "form_staggers", name: "โรคหลอดเลือดสมอง" },
  { key: "form_cancer", name: "โรคมะเร็ง" },
  { key: "form_central_obesity", name: "โรคอ้วนลงพุง" },
]

const typeAdmin = [
  { key: "db_ncds", name: "ข้อมูลโรคไม่ติดต่อเรื้อรัง" },
  { key: "db_food", name: "ข้อมูลอาหาร" },
  { key: "db_blog", name: "ข้อมูลบทความ" },
  { key: "db_form", name: "ข้อมูลแบบประเมิน" },
]

const typeReport = [
  { key: "report_blogs_food", name: "บทความอาหาร" },
  { key: "report_blogs_ncds", name: "บทความ NCDs" }
]

const typeIndex = [
  { key: "/", name: "หน้าหลัก" }
]
const typeBlogs = [
  { key: "blogs_food", name: "อาหาร" },
  { key: "blogs_ncds", name: "โรคไม่ติดต่อเรื้อรัง" }
]


