import { VideoCameraOutlined } from '@ant-design/icons';
export default function ContentHeader  ({ headerData })  {
    return (
        <div className="flex flex-col w-full px-4 h-96 sm:h-1/4 sm:gap-y-2 gap-y-12  text-center">
            <div className="h-1/4">
                {/* <p className="pl-1 text-4xl font-thin  border-indigo-700 font-Charm border-l-2">{headerData[2].title}</p> */}
                <p className="-mt-2  text-gray-500 text-4xl" ><span className="mr-10">{headerData[2].content}</span><span>ต่อ 100 กรัม</span></p>
            </div>
            <hr className="w-1/12 mx-auto border-red-600"/>
            <div className="h-1/4 mx-auto">
                <p className="pl-1 text-4xl font-thin  lg:text-4xl font-Charm">{headerData[0].title}</p>
                <p className="pr-2 -mt-2 overflow-auto zm:h-20 text-left max-w-2xl" >{headerData[0].content}</p>
           
            </div>
            <hr className="w-1/12 mx-auto border-red-600"/>
            <div className="h-1/4 mx-auto">
                <p className="pr-1 text-4xl font-thin  lg:text-4xl font-Charm">{headerData[1].title}</p>
                <p className="pr-2 -mt-2 overflow-auto zm:h-20 text-left max-w-2xl" >{headerData[1].content}</p>
            </div>
            <div className='flex justify-end'>
                <button href="#" className="w-32 border  rounded-3xl bg-white p-3 hover:text-black shadow-lg shadow-cyan-500/50"> <i><VideoCameraOutlined className='text-lg' /></i> <span> ดูวีดีโอ</span></button>
            </div>
        </div>
    )
}