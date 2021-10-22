import { Divider } from "antd";

export default function ContentHeader  ({ headerData })  {
    return (
        <div className="flex flex-wrap p-6 mx-auto rounded-md lg:w-1/2 bg-gray-50">
            {headerData.map(({title,content},index)=>(
                <div key={index} className="h-1/4">
                    <p className={index % 2 === 0 ? `pl-1 text-2xl font-thin border-l-2 border-green-600 lg:text-2xl font-Charm`
                        : "pr-1 text-2xl font-thin text-right border-r-2 border-blue-600 lg:text-2xl font-Charm"}>{title}</p>
                    <p className={index % 2 === 0 ?"pr-2 -mt-2 overflow-auto zm:h-full zm:text-sm font-Poppins text-base"
                        : "pr-2 -mt-2 overflow-auto zm:h-full zm:text-sm font-Poppins text-base"} >{Array.isArray(content) 
                            ? content.map((data,index)=><li className={"font-Poppins text-base zm:text-sm mt-1"} key={index}>{index+1}. {data}</li>)
                            : content}</p>
                    <Divider />
                </div>
            ))}
        </div>
    )
}