
export default function ContentHeader  ({ headerData,url_yt })  {
    return (
        <div className="flex flex-wrap p-6 rounded-md mx-10 bg-gray-50">

            <div className="mb-5 -ml-2  text-xs lg:text-sm font-bold  flex-col flex w-full text-center lg:flex-row  "> 
                <a href="#" className="text-gray-500 hover:text-gray-500 border-gray-300 border-2 mx-1 p-2 rounded-sm mb-2">ลดความเสี่ยงต่อการเกิดโรค</a>
                <a href="#" className="text-gray-500 hover:text-gray-500 border-gray-300 border-2 mx-1 p-2 rounded-sm mb-2">คำแนะนำในการปฎิบัติตัว</a>
                <a href="#" className="text-gray-500 hover:text-gray-500 border-gray-300 border-2 mx-1 p-2 rounded-sm mb-2">สัญญาณการเกิดโรค</a>
                <a href="#" className="text-black hover:text-black border-black border-2 mx-1 p-2 rounded-sm mb-2">สาเหตุ</a>
            </div>
            {headerData.map(({title,content},index)=>(
                <div key={index} className="">
                    <p className="pl-1 text-4xl font-thin border-l-2 border-green-600 lg:text-4xl font-Charm">{title}</p>
                    <p className={index % 2 === 0 ?"pr-2 -mt-2 overflow-auto zm:text-sm font-Poppins text-base mx-5"
                        : "pr-2 -mt-2 overflow-auto zm:h-full zm:text-sm font-Poppins text-base"} >{Array.isArray(content) 
                            ? content.map((data,index)=><p className={"font-Poppins text-base zm:text-sm mt-1 mx-5"} key={index}>{index+1}. {data}</p>)
                            : content}</p>
                            
                </div>
            ))}
            {typeof url_yt!== 'undefined'?<iframe width="560" height="315" src={url_yt} className="my-5 mx-auto"></iframe>:""}
        </div>
    )
}