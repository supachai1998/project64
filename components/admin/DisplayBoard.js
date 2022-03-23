export default function Board({ data }) {

    if(!data || !data.length) return null
    return <div className="sm:flex-row flex flex-col flex-wrap mt-4  gap-4 justify-center ">
        {data.map(({ header, detail }, ind) => (<>
            <div key={ind} className="text-center shadow-md rounded-md bg-pink-200 p-10 flex-col">
                <div className="text-4xl">{header}</div>
                <div>{detail}</div>
            </div>
        </>))}
    </div>

}
