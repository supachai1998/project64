import { Divider } from "antd";

export default function ContentHeader  ({ headerData })  {
    return (
        <div className="flex flex-wrap p-6 rounded-md mx-10 bg-gray-50">

            <div className="mb-5 -ml-2  text-xs lg:text-sm font-bold  lg:flex-row flex "> 
                <a href="#" className="text-black hover:text-black border-gray-200 border-2 mx-1 p-2 rounded-sm mb-2">ลดความเสี่ยงต่อการเกิดโรค</a>
                <a href="#" className="text-black hover:text-black border-gray-200 border-2 mx-1 p-2 rounded-sm mb-2">คำแนะนำในการปฎิบัติตัว</a>
                <a href="#" className="text-black hover:text-black border-gray-200 border-2 mx-1 p-2 rounded-sm mb-2">สัญญาณการเกิดโรค</a>
                <a href="#" className="text-black hover:text-black border-gray-200 border-2 mx-1 p-2 rounded-sm mb-2">สาเหตุ</a>
            </div>
            {headerData.map(({title,content},index)=>(
                <div key={index} className="">
                    <p className="pl-1 text-2xl font-thin border-l-2 border-green-600 lg:text-2xl font-Charm">{title}</p>
                    <p className={index % 2 === 0 ?"pr-2 -mt-2 overflow-auto zm:text-sm font-Poppins text-base mx-5"
                        : "pr-2 -mt-2 overflow-auto zm:h-full zm:text-sm font-Poppins text-base"} >{Array.isArray(content) 
                            ? content.map((data,index)=><p className={"font-Poppins text-base zm:text-sm mt-1 mx-5"} key={index}>{index+1}. {data}</p>)
                            : content}</p>
                    <Divider />
                </div>
            ))}
        </div>
    )
}