import '/styles/globals.css'
// import 'antd/dist/antd.css';
import "nprogress/nprogress.css";

import 'owl.carousel/dist/assets/owl.carousel.css';
import "owl.carousel/dist/assets/owl.theme.default.css";

import thTh from 'antd/lib/locale/th_TH';
import React, { useState, useEffect, createContext, useContext } from 'react'
import { SessionProvider, useSession, signOut } from "next-auth/react"
import { useRouter, } from 'next/router'
import Head from 'next/head'
import { Layout, Menu, Tooltip, Button, ConfigProvider, notification, Drawer } from 'antd';
import {
  MenuOutlined,
  AppleOutlined,
  FormOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  HomeOutlined as HomeIcon,
  LogoutOutlined as LogoutOutlined,
  LikeOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic'
import { useWindowScrollPositions } from '/ulity/useWindowScrollPositions'
const { Header, Sider, Content } = Layout;
React.useLayoutEffect = React.useEffect
const { SubMenu } = Menu;

const animationZoomHover = "transition duration-500 ease-in-out transform  hover:scale-120"

export const _AppContext = createContext()

export const project_name = 'ใส่ใจโรคไม่ติดต่อเรื้อรัง (NCDs Care)'
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // const [queryClient] = React.useState(() => new QueryClient())
  const router = useRouter()
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState()
  const [title, setTitle] = useState(project_name)
  const [ncds, setNCDS] = useState()
  const [form, setForm] = useState()
  
  const [blogs, setBlogs] = useState([
    { name_th: "โรคไม่ติดต่อเรื้อรัง", name_en: "NCDS" }, { name_en: "FOOD", name_th: "อาหาร" }, { name_en: "ALL", name_th: "อาหารและโรค" }
  ])

  const reload = async () => {
    const n = await fetch(`/api/getNCDS?select=name_th,name_en,id`)
      .then(async res => res.ok && res.json())
      .then(data => data)
      .catch(err => notification.error({ message: err.message }))
    const q_f = await fetch(`/api/getForm?haveData=${true}`)
      .then(async res => res.ok && res.json())
      .then(data => data)
      .catch(err => notification.error({ message: err.message }))
    const f = n.filter(({ id }) => q_f.find(v => v === id))
    setNCDS(n)
    setForm(f)
  }



  return (
    // <QueryClientProvider client={queryClient}>

    //   <Hydrate state={pageProps.dehydratedState}>
    <SessionProvider session={session}>
      <Layout className="h-full min-h-screen">
        <TopProgressBar />
        <Head>
          <title >{title}</title>
          <meta name="viewport" content={`initial-scale=1, width=device-width`} />
        </Head>

        <NavBar blogs={blogs} form={form} router={router} ncds={ncds} reload={reload}
          setTitle={setTitle} defaultSelectedKeys={defaultSelectedKeys}
           />

        <Layout className="site-layout">
          <Header className="flex justify-start space-x-6 item-center site-layout-background" style={{ margin: 0, padding: 0 }} >
            {/* {console.log(session)} */}

            <p className="my-auto ml-10 md:text-3xl text-lg ease-anima text-white">{title}</p>
          </Header>
          <Content
            className="sm:p-2 site-layout-background"
          >
            <ConfigProvider locale={thTh}>
              <div className={`mx-1 sm:mx-3 inside_body`}>
                <_AppContext.Provider value={{ setDefaultSelectedKeys, setTitle, title, ncds, form }}>
                  <Component {...pageProps} />
                </_AppContext.Provider>
              </div>
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

const NavBar = ({ blogs, form, ncds, reload, defaultSelectedKeys, router,setTitle  }) => {
  const [collapsed, setCollapsed] = useState(!!isMobile ? true : false)
  const [foodType, setFoodType] = useState(null)
  const { status } = useSession()
  const { scrollX, scrollY } = useWindowScrollPositions()

  const toggle = async (val) => {
    typeof val === "boolean" ? setCollapsed(val) : setCollapsed(!collapsed)
  }
  useEffect(() => {
    if (status === "authenticated") {
      setCollapsed(null)
    } else if (status === "unauthenticated") {
      setCollapsed(true)
    }
  }, [status])
  useEffect(() => {
    (async () => {
      if (status === "unauthenticated") {
        reload()
        const data = await fetch(`/api/getTypeFood?order=des`).then(res => res.ok && res.json())
        Array.isArray(data) && setFoodType(data)
      }
    })()
  }, [status])
  const handleMenuClick = (val) => {
    // console.log(val,defaultSelectedKeys)
    // Array(3) [ "report_blogs_food", "report", "admin" ]
    if (val.keyPath.length > 1) {
      router.push(`/${val.keyPath[1]}/${val.keyPath[0].split("_")[1]}`)
    }
  }
  const handleSubMenuClick = (name) => {
    setTitle(name)
    setCollapsed(true)
  }
  const handleMenu = (en, th, query) => {
    // console.log(en)
    if (!en) setTitle(project_name); else setTitle(th);
    router.push({ pathname: `/${en}`, query: query });
    setCollapsed(true)
  }

  let timeOut = null
  return <>
    {/* status === "authenticated" */}
    {status === "authenticated" && <div className="absolute    h-full top-3 right-0 ">
      <button
        className='button bg-white'
        onClick={() => { setCollapsed(true); signOut({ redirect: false }) }}><LogoutOutlined style={{ fontSize: "18px" }} /> ออกจากระบบ
      </button>
    </div>}
    {status === "unauthenticated" && <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        marginTop: `${scrollY <= 64 ? 64 - scrollY : 0}px`,
        top: 0,
        left: 0,
        zIndex: 2,
        scrollMargin: "0"
      }}
      onMouseLeave={() => toggle(true)}
      trigger={null} collapsible breakpoint="lg" width={`20vw`} collapsedWidth={`3rem`} defaultCollapsed={collapsed} collapsed={collapsed}
    >
      <Menu theme="dark" mode="inline" triggerSubMenuAction={isMobile ? "click" : "hover"}
        defaultSelectedKeys={defaultSelectedKeys} selectedKeys={defaultSelectedKeys} onClick={handleMenuClick}
        // onMouseEnter={() =>{
        //   timeOut = setTimeout(()=> toggle(false),3000)
        // }}
        // onMouseLeave={() =>{
        //   clearTimeout(timeOut)
        // }} 
        >
        {status === "unauthenticated" ? <>
          <li className={` text-white cursor-pointer ant-menu-item`}
            onClick={() => toggle(!collapsed)} onMouseEnter={() => toggle(false)} >
            {collapsed === null ? <></>
              : collapsed === true ? <MenuOutlined className={animationZoomHover} style={{ fontSize: "20px" }} />
                : <MenuFoldOutlined className={animationZoomHover} style={{ fontSize: "20px" }} />}
          </li>
          <Menu.Item key="/" icon={<HomeIcon style={{ fontSize: "20px" }} />}
            onClick={() => { handleMenu('', project_name), { home: "/" } }}>หน้าหลัก</Menu.Item>
          <Menu.Item key="/recommends" icon={<LikeOutlined style={{ fontSize: "20px" }} />}
            onClick={() => { handleMenu('', "แนะนำอาหารและบทความ", { home: "recommends" }) }}>แนะนำอาหารและบทความ</Menu.Item>
          <SubMenu key="ncds" icon={<MedicineBoxOutlined style={{ fontSize: "20px" }} />} title="โรคไม่ติดต่อเรื้อรัง">
            {!!ncds && ncds.map(({ id, name_en, name_th }, index) =>
              <Menu.Item key={`ncds_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="form" icon={<ProfileOutlined style={{ fontSize: "20px" }} />} title="แบบประเมินความเสี่ยงโรค">
            {!!form && form.map(({ id, name_en, name_th }, index) =>
              <Menu.Item key={`form_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="foods" icon={<AppleOutlined style={{ fontSize: "20px" }} />} title="ประเภทอาหาร" >
            {!!foodType && foodType?.map(({ id, name_en, name_th, count }, index) =>
              <Menu.Item key={`foods_${id}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}({count})</Menu.Item>
            )}
          </SubMenu>
          <SubMenu key="blogs" icon={<FormOutlined style={{ fontSize: "20px" }} />} title="บทความ">
            {!!blogs && blogs.map(({ id, name_en, name_th }, index) =>
              <Menu.Item key={`blogs_${name_en.toLowerCase()}`} onClick={() => handleSubMenuClick(name_th)}>{name_th}</Menu.Item>
            )}
            <Menu.Item key={`blogs_write`} onClick={() => handleSubMenuClick("blogs_write")}>เขียนบทความ</Menu.Item>
          </SubMenu>
        </>
          : <>
            {/* {typeAdmin.map(({ name, key }) =>
              <Menu.Item key={key} onClick={() => handleMenu(`admin/${key}`, name)}>{name}</Menu.Item>
            )}
            <SubMenu key="report" icon={<PieChartOutlined style={{fontSize:"20px"}}/>} title="รายงาน">
              {typeReport.map(({ name, key }) =>
                <Menu.Item key={key} onClick={() => handleSubMenuClick(name)}>{name}</Menu.Item>
              )}
            </SubMenu>
            <Menu.Item key="logout" icon={<LogoutOutlined style={{fontSize:"20px"}}style={{ width: "18px", height: "18px" }} />}
              onClick={() => signOut()}>ออกจากระบบ</Menu.Item> */}
          </>
        }
      </Menu>
    </Sider>
    }</>
}

const TopProgressBar = dynamic(
  () => {
    return import("/components/TopProgressBar");
  },
  { ssr: false },
);
