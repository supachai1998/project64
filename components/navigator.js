import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useEffect, useState } from 'react'
import { Tooltip } from 'antd';
import { useRouter } from 'next/router';

export default function Navigator() {
    const router = useRouter()
    // const [y, setY] = useState(window.scrollY);
    // const handleNavigation = e =>{
    //     console.log(y)
    // }
    // useEffect(() => {
    //     window.addEventListener("scroll", (e) => handleNavigation(e));
        
    //     return () => { 
    //         window.removeEventListener("scroll", (e) => handleNavigation(e));
    //     };
    // }, [y]);
    const handleBackPage = () => {
        router.back()
    }
    const handleGoToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
    const handleGoToBelow = () => {
        window.scrollTo({
            top: (document.documentElement.scrollTop || document.body.scrollTop) + 300,
            behavior: 'smooth'
        });
    }
    return (
        <div></div>
        // <div className="fixed right-0 z-10 flex flex-col gap-4 px-2 py-3 mr-2 duration-500 transform rounded-lg hover:bg-blue-300 hover:scale-125 opacity-90 top-1/2 ">
        //     <Tooltip title="เลื่อนขึ้น" placement="left" ><ArrowUpwardIcon className="hover:text-blue-700" onClick={handleGoToTop} style={{ width: "1.1rem", height: "1.1rem" }} /></Tooltip>
        //     {/* <Tooltip title="ย้อนกลับ" placement="left"><ArrowBackIcon className="hover:text-blue-700" onClick={handleBackPage} style={{ width: "1.1rem", height: "1.1rem" }} /></Tooltip> */}
        //     {/* <Tooltip title="เลื่อนลง" placement="left"><ArrowUpwardIcon className="transform rotate-180 hover:text-blue-700 " onClick={handleGoToBelow} style={{ width: "1.1rem", height: "1.1rem" }} /></Tooltip> */}
        // </div>
    )
}
