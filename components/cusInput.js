

import React,{ useState, useEffect ,useRef} from 'react';
import { Input, message, Button, Tooltip, Modal,Select } from 'antd'
import { SearchOutlined , CameraOutlined, } from '@ant-design/icons';
import Webcam from "react-webcam";
import Image from 'next/image'
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import { CircularProgress, LinearProgress } from "@mui/material";
import Resizer from "react-image-file-resizer";
import {noti} from '/components/noti'

const {Search} = Input
export default function CusInput({ data, setData ,originData}) {
  const refSearchInput = useRef()
  const [statusWebCam, setStatusWebCam] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState(null)
  const handleSearch = () =>{
    const val = refSearchInput.current?.state?.value || input
    if(!!val && val.length > 2) {
        setLoading(true)
        const timer  =setTimeout(()=>{
            const filter =  originData.filter(({title_th})=>title_th.toLowerCase().indexOf(val) > -1  )
            if(filter.length  < 1 ) noti("error","ไม่พบข้อมูล")
            else setData(filter)
            setLoading(false)
        },1000)
        refSearchInput.current.state.value = null
        return () => clearTimeout(timer)
    }else{
        setData([])
    }
  }
  useEffect(()=>{
    handleSearch()
  },[input,setInput])
  
  const onChange = () =>{
      const val = refSearchInput.current.state.value
      if(!!val && val.length <= 1) setData([]) //remove input to set data
  }
  return (
    <div className="grid w-full rounded-xl">
      {statusWebCam ? <WebcamCapture setInput={setInput} setStatusWebCam={setStatusWebCam} />
        : <div className="grid grid-cols-1 gap-3 mx-10 row-span-full">
          <div className="grid ">
            <label className='text-2xl'>ค้นหา</label>
          </div>
          <div className="grid xl:grid-cols-3 sm:grid-cols-2  w-full h-full gap-3 sm:justify-center sm:flex-row">
            <Tooltip title="ถ่ายภาพ">
              <Button className="z-50" shape="round" icon={<CameraOutlined />} onClick={() => setStatusWebCam(true)} >ถ่ายภาพอาหาร</Button>
            </Tooltip>
            <CustomUpload setInput={setInput} />
          <Search className="z-0 w-full input search loading with enterButton"  disabled={loading && true} onChange={onChange} onSearch={handleSearch}  maxLength={30} onPressEnter={handleSearch} loading={loading} enterButton inputMode="search" 
          placeholder={"ชื่ออาหาร , ชื่อโรค , ชื่อบทความ"} ref={refSearchInput}/>
          </div>
        </div>
      }
    </div >

  )
}

/***  input include only int 0 , 1 , 2
 * 0 is input string (ชื่ออาหาร)
 * 1 is input file (รูปภาพ)
 * 3 is input camera (กล้อง)
*/



const WebcamCapture = ({ setStatusWebCam, setInput }) => {
  const [imageSrc, setImageSrc] = useState([]);
  const webcamRef = useRef(null);
  const [visible, setVisible] = useState(false)
  const [facingMode, setFacingMode] = useState("environment");
  const [leftHand, setLeftHand] = useState(false);
  const [machinePredict, setMachinePredict] = useState(null)
  const [loading, setLoading] = useState(false)

  const videoConstraints = {
    width: 1200,
    height: 900,
    facingMode: facingMode
  };
  const capture = React.useCallback(
    () => {
      const capt = webcamRef.current.getScreenshot()
      setImageSrc(prev => [capt, ...prev]);
    },
    [webcamRef]
  );

  const handleCloseCamera = () => {
    setStatusWebCam(false)
  }
  const handleCaptureCamera = () => {
    capture()
    // if(imageSrc){handleCloseCamera()} else {capture()}
  }
  const handleCameraswitchIcon = () => {
    setFacingMode(facingMode === "environment" ? "facing" : "environment")
  }
  const handleError = async (e) => {
    noti("error",e.message)
    handleCloseCamera()
  }


  return (
    <div className="fixed top-0 left-0 z-10 flex w-full h-screen min-h-screen px-2 bg-gray-700">
      <div className="relative h-auto mx-auto">
        <Webcam
          width={600}
          height="100%"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={70}
          videoConstraints={videoConstraints}
          onUserMediaError={handleError}
        />
        <div className={leftHand ? "left-0" : "right-3  top-2" + " absolute flex flex-col h-full gap-10 "}>
          <Button
            shape="round"
            type="primary"
            danger
            onClick={handleCloseCamera}>
            ปิด
          </Button>
        </div>
        <div className={"absolute flex w-full gap-10 -mt-10 justify-center overflow-hidden"}>
          <Button
            icon={<CameraswitchIcon />}
            shape="round"
            onClick={handleCameraswitchIcon}>
            สลับกล้อง
          </Button>
          <Button
            icon={loading ? <CircularProgress style={{ width: "20px", height: "20px", marginRight: "3%" }} /> : <CameraEnhanceIcon />}
            shape="round"
            onClick={handleCaptureCamera}
            disable={loading}>
            ถ่ายภาพ
          </Button>
        </div>
      </div>

      {imageSrc.length > 0 && <div className="absolute top-0 left-0 z-30 bg-gray-600 bg-opacity-50">
        <ImageShow imageSrc={imageSrc} setLoading={setLoading} machinePredict={machinePredict} setMachinePredict={setMachinePredict} setImageSrc={setImageSrc} handleCloseCamera={handleCloseCamera} setInput={setInput} /> </div>}
    </div>

  );
};

const ImageShow = ({ imageSrc, setImageSrc, handleCloseCamera, setInput, machinePredict, setMachinePredict, setLoading }) => {
  useEffect(() => {
    (async () => {
      setLoading(true)
      const formdata = new FormData();
      const _temp = dataURLtoFile(imageSrc[0])
      const image = await resizeFile(_temp);
      const file = dataURLtoFile(image)
      formdata.append("file", file, 'file.jpeg');

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      };
      await fetch('/api/predict', requestOptions)
        .then(response => response.json())
        .then(({ type, name, confident, error }) => {
          setLoading(false)
          if (error) {
            setLoading(false);
            noti("error",error.error)
            setMachinePredict(null)
            setImageSrc([])
          }
          else {
            switch (type) {
              case 'ไม่ใช่อาหาร':
                noti("error","ไม่ใช่อาหาร")
                setImageSrc([])
                break;
              case 'ไม่ใช่ภาพ':
                noti("error","ไม่ใช่ภาพ")
                setImageSrc([])
                break;
              default:
                setMachinePredict({ name: name, confident: confident })
                break;
            }

          }
        })
        .catch(error => {
          setLoading(false);
          noti("error",error.message)
          setMachinePredict(null)
          setImageSrc([])
        });
    })()
  }, [])

  const removeImage = (id) => {
    message.warning("ลบภาพเรียบร้อย")
    setImageSrc(prev => prev.filter((val, i) => i !== id))
    setMachinePredict(null)
  }
  const selectImage = () => {
    setInput(machinePredict.name)
    setMachinePredict(null)
    setImageSrc([])
    handleCloseCamera()
  }
  if (!machinePredict) return null
  else return (
    <div className="flex items-center justify-center w-screen h-screen ">
      {imageSrc.map((image, i) => <div className="relative p-1 bg-gray-200 rounded-xl" key={i}>
        <Image width={400} height={400} alt={i} src={image} />
        <div className="absolute top-0 right-0 flex justify-between w-full mb-3">
          <span className={machinePredict?.confident > 50 ? "text-green-300" + " p-2 text-sm font-bold bg-blue-900 rounded-md text-gray-50" : "text-red-400" + " p-2 text-sm font-bold bg-blue-900 rounded-md text-gray-50"}>{machinePredict?.name} {machinePredict?.confident}%</span>
        </div>
        <div className="absolute bottom-0 flex justify-end w-full py-3 mb-3 right-3">
          <div className="flex flex-wrap gap-3">
            <Tooltip title="ลบ">
              <svg onClick={() => removeImage(i)} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-700 bg-gray-100 rounded-full hover:text-red-400 button" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Tooltip>
            <Tooltip title="เลือกภาพ">
              <svg onClick={selectImage} xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-700 bg-gray-100 rounded-full hover:text-green-400 button" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Tooltip>
          </div>
        </div>
      </div>)}
    </div >
  )
}

const CustomUpload = ({ setInput }) => {
  const [loading, setLoading] = useState(false)
  const [machinePredict, setMachinePredict] = useState(null)
  const onChange = (e) => {
    (async () => {
      setLoading(true)
      // setLoading(true)
      const data = new FormData()
      const image = await resizeFile(e.target.files[0]);

      const file = dataURLtoFile(image)
      data.append("file", file, 'file.jpeg')
      const requestOptions = {
        method: 'POST',
        body: data
      };
      const url = await readURL(e.target.files[0]);
      await fetch('/api/predict', requestOptions)
        .then(response => response.json())
        .then(({ type, name, confident, error }) => {
          setLoading(false)
          if (error) { noti("error",error) }
          else {
            switch (type) {
              case 'ไม่ใช่อาหาร':
                noti("error","ไม่ใช่อาหาร")
                break;
              case 'ไม่ใช่ภาพ':
                noti("error","ไม่ใช่ภาพ")
                break;
              default:
                setMachinePredict({ name: name, confident: confident, url: url })
                break;
            }

          }
        })
        .catch(error => { setLoading(false); noti("error",error.message) });

    })()
  }
  const handleOk = () => {
    setInput(machinePredict.name)
    setMachinePredict(null)
  }
  const handleCancel = () => {
    setMachinePredict(null)
  };
  return (
    <>
      <Tooltip title="เลือกภาพถ่ายอาหารที่ต้องการ">
        <label className="flex items-center justify-center gap-3 px-3 py-1 tracking-wide text-gray-800 uppercase bg-white border border-gray-800 shadow-lg cursor-pointer rounded-2xl hover:border-blue-600 hover:text-blue-600">
          <svg className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          {loading
            ? <LinearProgress className="w-20" />
            : <><span className="text-sm leading-normal">เลือกภาพอาหาร</span>
              <input type="file" className="hidden" accept="image/*" onChange={onChange} /></>}
        </label>
      </Tooltip>
      <Modal
        title={machinePredict && <h1 className={
          machinePredict.confident > 50 ? "text-green-700" : "text-red-600" + " text-lg font-bold"}>
          {machinePredict.name} {machinePredict.confident}%</h1>}
        visible={machinePredict ? true : false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" danger onClick={handleCancel}>
            ยกเลิก
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            ตกลง
          </Button>
        ]}
      >
        {machinePredict &&
          <div className="flex flex-col justify-center">
            <Image src={machinePredict.url} alt={machinePredict} width={300} height={200} />
          </div>}
      </Modal>
    </>
  )
}


const readURL = file => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = ({ target }) => res(target.result);
    reader.onerror = e => rej(e);
    reader.readAsDataURL(file);
  });
};

const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });