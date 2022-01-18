export default function Content({ bodyContent }) {
    return (
        <div className="flex flex-col w-full px-4 h-96 sm:h-1/4 sm:gap-y-2 gap-y-12">
            {bodyContent.map(({ title, content ,imgUrl}, index) => (
                <div key={index} className="mt-3 h-1/4">
                    <p className={index % 2 === 0 
                        ?  "pl-1 text-4xl font-thin border-l-2 border-green-600 lg:text-4xl font-Charm" 
                        : "pr-1 text-4xl font-thin text-right border-r-2 border-blue-600 lg:text-4xl font-Charm"}>{title || ""}</p>
                    <span className={index % 2 === 0 ?"pr-2 -mt-3 overflow-auto zm:h-20":"-mt-2 text-left sm:text-right" }>{content || ""}</span>
                    {imgUrl && <>imgUrl</>}
                </div>
            ))}

        </div>
    )
}