import '../styles/globals.css'
import 'antd/dist/antd.css';
import "nprogress/nprogress.css";
import React, { useState, useEffect } from 'react'
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useRouter, } from 'next/router'
import Head from 'next/head'
import { Layout, Menu, message, Tooltip,Button } from 'antd';
import {
  MenuOutlined,
  AppleOutlined,
  FormOutlined,
  MedicineBoxOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { AnimatePresence } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import dynamic from 'next/dynamic'
import { LogoutOutlined } from '@mui/icons-material';

const { Header, Sider, Content } = Layout;
React.useLayoutEffect = React.useEffect
const { SubMenu } = Menu;

const animationZoomHover = "transition duration-500 ease-in-out transform  hover:scale-120"
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState("home")
  const [title, setTitle] = useState('เว็บไซค์ [ ชื่อโปรเจค ]')
  const nameUrl = [
    { url: "/fried", key: "fried", name: "อาหารทอด" },
    { url: "/soup", key: "soup", name: "อาหารต้ม" },
    { url: "/steam", key: "steam", name: "อาหารนึ่ง" },
    { url: "/sweets", key: "sweets", name: "อาหารขนมหวาน" },
    { url: "/grilled", key: "grilled", name: "อาหารย่าง" },
    { url: "/fry", key: "fry", name: "อาหารผัด" },
    { url: "/mix", key: "mix", name: "อาหารยำ" },
    { url: "/diabetes", key: "diabetes", name: "โรคเบาหวาน" },
    { url: "/pressure", key: "pressure", name: "โรคความดันโลหิตสูง" },
    { url: "/emphysema", key: "emphysema", name: "โรคหัวใจ" },
    { url: "/staggers", key: "staggers", name: "โรคสมอง" },
    { url: "/cancer", key: "cancer", name: "โรคมะเร็ง" },
    { url: "/central_obesity", key: "central_obesity", name: "โรคอ้วนลงพุง" },
    { url: "/form_diabetes", key: "form_diabetes", name: "บทความโรคเบาหวาน" },
    { url: "/form_pressure", key: "form_pressure", name: "บทความโรคความดันโลหิตสูง" },
    { url: "/form_emphysema", key: "form_emphysema", name: "บทความโรคถุงลมโป่งพอง" },
    { url: "/form_staggers", key: "form_staggers", name: "บทความโรคหลอดเลือดสมอง" },
    { url: "/form_cancer", key: "form_cancer", name: "บทความโรคมะเร็ง" },
    { url: "/form_central_obesity", key: "form_central_obesity", name: "บทความโรคอ้วนลงพุง" },
    { url: "/db_ncds", key: "db_ncds", name: "จัดการข้อมูลโรคไม่ติดต่อเรื้อรัง" },
    { url: "/db_food", key: "db_food", name: "จัดการข้อมูลอาหาร" },
    { url: "/db_blog", key: "db_blog", name: "จัดการข้อมูลบทความ" },
    { url: "/db_form", key: "db_form", name: "จัดการข้อมูลแบบประเมิน" },
    { url: "/blogs_food", key: "blogs_food", name: "บทความ อาหาร" },
    { url: "/blogs_ncds", key: "blogs_ncds", name: "บทความ โรคไม่ติดต่อเรื้อรัง" },
    { url: "/report_blogs_food", key: "report_blogs_food", name: "รายงาน บทความอาหาร" },
    { url: "/report_blogs_ncds", key: "report_blogs_ncds", name: "รายงาน บทความ NCDs" },
    { url: "/", key: "/", name: "หน้าหลัก" },
    { url: "/admin", key: "admin", name: "ผู้ดูแลระบบ" },
  ]
  const toggle = () => { setCollapsed(!collapsed) }
  useEffect(() => {

    const { asPath, pathname } = router
    let { name, categories } = router.query
    const asPathSplit = asPath.split("/")
    try {
      if (categories && name) {
        // console.log(asPath, name, categories)
        setDefaultSelectedKeys(categories)
        setTitle(name)
      } else if (asPathSplit.length === 3) {
        console.log(asPathSplit, pathname, name, categories)
      } else {
        const { key, name } = nameUrl.find(({ url }) => url === asPath)
        // console.log(key, name, asPath)
        setDefaultSelectedKeys(key)
        setTitle(name.replace(/_/g, " "))
      }
    } catch (e) { }
    const handleRouteChange = async (url) => {
      try {
        const split = url.trim().split("/")
        let [categories, path] = split.at(-1).split("?")
        if (path) {
          const [name, para] = path.split("=") //## name = ABCDE
          setTitle(decodeURI(para).replace(/_/g, " "))
          setDefaultSelectedKeys(categories)
        } else {
          if (!categories) {
            setDefaultSelectedKeys("home")
            setTitle("หน้าหลัก")
          }
          else {
            const decode = await decodeURI(categories)
            const match = await nameUrl.find(({ key }) => key === decode)

            if (match && match.length > 0) {
              const { name } = match[0]
              setTitle(name.replace(/_/g, " "))
            }
            // console.log(match.key , categories)
            setDefaultSelectedKeys(match.key || categories)
          }
        }
        if (isMobile) setCollapsed(true)
      } catch (e) { }
    }

    if (isMobile) setCollapsed(true)

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const handleMenuClick = ({ keyPath }) => {
    console.log(keyPath)
    // Array(3) [ "report_blogs_food", "report", "admin" ]

    if (keyPath.length >= 2) router.push(`/${keyPath.at(1)}/${keyPath.at(0)}`)
  }
  const handleSubMenuClick = (name) => {
    setTitle(name)
  }
  const handleMenu = (en, th) => {
    setTitle(th); router.push(`/${en}`)

  }

  return (
    <SessionProvider session={session}>
      <Layout className="h-full min-h-screen">
        <TopProgressBar />
        <Head>
          <title >{title}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <NavBar handleMenuClick={handleMenuClick} handleMenu={handleMenu} handleSubMenuClick={handleSubMenuClick} collapsed={collapsed} setCollapsed={setCollapsed} defaultSelectedKeys={defaultSelectedKeys} />

        <Layout className="site-layout">
          <Header className="flex justify-start space-x-6 item-center site-layout-background" style={{ margin: 0, padding: 0 }} >
            {collapsed !== null && <Tooltip title="เมนู">
              <div className='px-3 my-auto text-lg text-white trigger hover:border-gray-50 hover:scale-110' onClick={toggle}>
                {collapsed
                  ? <MenuOutlined className={animationZoomHover} />
                  : <MenuOutlined className={animationZoomHover} />}
              </div>
            </Tooltip>}
            <p className="my-auto ml-2 text-2xl text-white">{title}</p>
          </Header>
          <Content
            className="p-2 site-layout-background"
          >
            <AnimatePresence exitBeforeEnter>
              <Component onClick={() => setCollapsed(true)} {...pageProps} />
            </AnimatePresence>
          </Content>
          <Navigator />
        </Layout>

      </Layout>
    </SessionProvider>
  )
}
export default MyApp

const NavBar = ({ handleMenu, handleSubMenuClick, collapsed, setCollapsed, defaultSelectedKeys, handleMenuClick }) => {
  const { status } = useSession()
  if (status !== "unauthenticated") {
    setCollapsed(null)
  }
  return <>
    {status === "authenticated" && <div className="absolute right-0 h-full top-3 ">
        <Button 
          icon={<LogoutOutlined style={{ width: "18px", height: "18px" }}/>}
          onClick={() => signOut({ redirect: true, callbackUrl: '/admin' })}>ออกจากระบบ</Button>
      </div>}
    {status === "unauthenticated" && <Sider trigger={null} collapsible breakpoint="lg" width="13em" collapsedWidth="45" defaultCollapsed={isMobile} collapsed={collapsed}>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys} selectedKeys={defaultSelectedKeys} onClick={handleMenuClick} >
        {status === "unauthenticated" ? <>
          <Menu.Item key="home" icon={<HomeIcon style={{ width: "18px", height: "18px" }} />}
            onClick={() => { handleMenu('', 'หน้าหลัก') }}>หน้าหลัก</Menu.Item>
          <SubMenu key="ncds" icon={<MedicineBoxOutlined />} title="โรคไม่ติดต่อเรื้อรัง">
            {typeNcds.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="form" icon={<MedicineBoxOutlined />} title="แบบประเมินโรค">
            {typeForm.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="foods" icon={<AppleOutlined />} title="ประเภทอาหาร" >
            {typeFood.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="blogs" icon={<FormOutlined />} title="บทความ">
            {typeBlogs.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
            )}
          </SubMenu>
        </>
          : <>
            {typeAdmin.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleMenu(`admin/${key}`, name)}>{name}</Menu.Item>
            )}
            <SubMenu key="report" icon={<PieChartOutlined />} title="รายงาน">
              {typeReport.map(({ name, key }) =>
                <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
              )}
            </SubMenu>
            <Menu.Item key="logout" icon={<LogoutOutlined style={{ width: "18px", height: "18px" }} />}
              onClick={() => signOut({ redirect: true, callbackUrl: '/admin' })}>ออกจากระบบ</Menu.Item>
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
const Navigator = dynamic(
  () => {
    return import("/components/navigator");
  },
  { ssr: false },
);

const typeFood = [
  { key: "fried", name: "ทอด" },
  { key: "soup", name: "ต้ม" },
  { key: "steam", name: "นึ่ง" },
  { key: "sweets", name: "ขนมหวาน" },
  { key: "grilled", name: "ย่าง" },
  { key: "fry", name: "ผัด" },
  { key: "mix", name: "ยำ" }
]
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
