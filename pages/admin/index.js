import { useEffect, useState, useContext } from 'react'
import { Form, Input, Button, message, Select } from 'antd';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { _AppContext } from '/pages/_app'
const _Ncds = dynamic(() => import('./ncds'))
const _Food = dynamic(() => import('./food'))
const _Form = dynamic(() => import('./form'))
const _Blogs = dynamic(() => import('./blogs'))
const CusImage = dynamic(() => import('/components/cusImage'))
const _Report_blogs_food = dynamic(() => import('./report_blogs_food/index'))
const _Report_blogs_ncds = dynamic(() => import('./report_blogs_ncds/index'))

export default function Index() {
    const { status } = useSession()

    const { router } = useRouter()
    const { setTitle } = useContext(_AppContext)
    const [titleAdmin, setTitleAdmin] = useState()

    const onSelectPage = (_titleAdmin) => {
        setTitle("ผู้ดูแลระบบ : "+_titleAdmin)
        setTitleAdmin(_titleAdmin)
        localStorage?.setItem('page', _titleAdmin)
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const _page = localStorage?.getItem('page')
            if(!!_page){
                setTitleAdmin(_page)
                setTitle("ผู้ดูแลระบบ : "+_page)
            }else{
                setTitleAdmin("โรคไม่ติดต่อเรื้อรัง")
                setTitle("ผู้ดูแลระบบ : "+"โรคไม่ติดต่อเรื้อรัง")
            }
        }
    }, [])


    const onFinish = ({ user }) => {
        const { email, password } = user
        signIn("credentials", {
            email, password, callbackUrl: `.`, redirect: false
        }
        ).then(function (result) {
            if (result.error !== null) {
                (result.status === 401) ? message.error("อีเมลหรือพาสเวิร์ดผิด") : message.error(result.error);
            }
            else {
                message.success("เข้าสู่ระบบสำเร็จ");
            }
        });

    };
    const validateMessages = {
        required: '${label} ต้องไม่ว่าง!',
        types: {
            email: '${label} ไม่ใช่อีเมล!',
            number: '${label} ไม่ใช่ตัวเลข!',
        },
        number: {
            range: '${label} ต้องอยู่ระหว่าง ${min} และ ${max}',
        },
    };

    // if (isMobile ) {
    //     return (
    //         <div className="w-full h-full min-h-screen">
    //             <div className="w-full h-auto mx-auto duration-300 transform lg:w-1/2 bg-red-50">
    //                 <p className="p-6 text-xl font-bold text-center text-red-800">ไม่รองรับการใช้งานในมือถือ</p>
    //             </div>
    //         </div>
    //     )
    // } 
    if (status === "loading") {
        return (
            <div className="min-h-screen">
                กำลังดึงข้อมูล
            </div>
        )
    }
    else if (status === "authenticated") {
        return (
            <div className="w-full h-full min-h-screen flex flex-col">
                <HeaderAdmin titleAdmin={titleAdmin} onSelectPage={onSelectPage} />

                {titleAdmin === "โรคไม่ติดต่อเรื้อรัง" ? <_Ncds />
                    : titleAdmin === "บทความ" ? <_Blogs />
                        : titleAdmin === "อาหาร" ? <_Food />
                            : titleAdmin === "แบบประเมินโรค" ? <_Form />
                                : titleAdmin === "รายงานแบบประเมินโรค" ? <_Report_blogs_food />
                                    : titleAdmin === "รายงานบทความ" && <_Report_blogs_ncds />
                }
            </div>
        )
    }
    // admin authentication
    const layout = {
        labelCol: { span: 7 },
        // wrapperCol: { span: 20 },
    };
    return (
        <div className="w-full h-full min-h-screen " >
            <div className="lg:w-1/4 mx-auto  h-auto p-6 m-6 rounded-lg ease-anima  bg-gray-50 ">
                <Form name="login" autoComplete="off" validateMessages={validateMessages} onFinish={onFinish}
                    {...layout}>
                    <Form.Item name={['user', 'email']} label="อีเมล" rules={[{ required: true }]}>
                        <Input placeholder="exam@email.com" prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name={['user', 'password']} label="รหัสผ่าน" rules={[{ required: true }]} >
                        <Input.Password placeholder="password" prefix={<LockOutlined />} />
                    </Form.Item>
                    <div className="flex justify-end w-full">
                        <Button type="primary" htmlType="submit"  >
                            เข้าสู่ระบบ
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

const { Option } = Select
const HeaderAdmin = ({ titleAdmin, onSelectPage }) => {
    return (
        <div className=" flex flex-col w-full  gap-4 m-2">
            {/* <span className="text-xl duration-500 transform md:text-2xl">{titleAdmin}</span> */}
            <div className="flex flex-auto flex-wrap w-full gap-4 items-center">
                <button className={`button text-blue-500 hover:bg-blue-200 hover:text-blue-800 ${titleAdmin === "โรคไม่ติดต่อเรื้อรัง" && "border border-blue-600 text-blue-900 hover:bg-blue-400"}`} onClick={() => onSelectPage("โรคไม่ติดต่อเรื้อรัง")}>โรคไม่ติดต่อเรื้อรัง</button >
                <button className={`button text-blue-500 hover:bg-blue-200 hover:text-blue-800 ${titleAdmin === "บทความ" && "border border-blue-600 text-blue-900 hover:bg-blue-400"}`} onClick={() => onSelectPage("บทความ")}>บทความ</button >
                <button className={`button text-blue-500 hover:bg-blue-200 hover:text-blue-800 ${titleAdmin === "อาหาร" && "border border-blue-600 text-blue-900 hover:bg-blue-400"}`} onClick={() => onSelectPage("อาหาร")}>อาหาร</button >
                <button className={`button text-blue-500 hover:bg-blue-200 hover:text-blue-800 ${titleAdmin === "แบบประเมินโรค" && "border border-blue-600 text-blue-900 hover:bg-blue-400"}`} onClick={() => onSelectPage("แบบประเมินโรค")}>แบบประเมินโรค</button >
            </div>
            <hr />
        </div>
    )
}

