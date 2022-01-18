export default function ContentHeader  ({ headerData })  {
    return (
        <div className="flex flex-col w-full px-4 h-96 sm:h-1/4 sm:gap-y-2 gap-y-12">
            <div className="h-1/4">
                <p className="pl-1 text-4xl font-thin border-l-2 border-green-600 lg:text-4xl font-Charm">{headerData[0].title}</p>
                <p className="pr-2 -mt-2 overflow-auto zm:h-20" >{headerData[0].content}</p>
            </div>
            <div className="h-1/4">
                <p className="pr-1 text-4xl font-thin text-right border-r-2 border-blue-600 lg:text-4xl font-Charm">{headerData[1].title}</p>
                <p className="pr-2 -mt-2 overflow-auto zm:h-20" >{headerData[1].content}</p>
            </div>
            <div className="h-1/4">
                <p className="pl-1 text-4xl font-thin text-left border-indigo-700 font-Charm lg:text-4xl zm:border-l-2 ipad:pr-1 sm:text-right sm:border-r-2">{headerData[2].title}</p>
                <p className="-mt-2 text-left sm:text-right" ><span className="mr-10">{headerData[2].content}</span><span>ต่อ 100 กรัม</span></p>
            </div>
        </div>
    )
}