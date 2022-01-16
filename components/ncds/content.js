import dynamic from 'next/dynamic'
const CustImage = dynamic(() => import("/components/cusImage.js"))
import OwlCarousel from "react-owl-carousel";

import {  Select } from 'antd';
const { Option, OptGroup } = Select
export default function Content({ bodyContent }) {
    return (
        <div className="flex flex-col w-full  sm:h-1/4 sm:gap-y-2 gap-y-12 px-20 my-15 bg-gray-100">
<OwlCarousel
loop={false}
items={1}
responsiveRefreshRate={0}
autoplay={true}
autoplayTimeout={7000}
autoplayHoverPause={true}
nav={true}
responsiveClass= {true}
navText={[
  '<i class="icon-arrow-prev"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
  '<i class="icon-arrow-next"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
]



}
dots={false}
margin={20} >
            {bodyContent.map(({ title, content ,imgUrl,yt_url}, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className="relative mx-auto h-1/2">
                        
                        <CustImage className="w-1.5 mx-auto bg-cover h-10" src={imgUrl} alt={"0"} width="1637px" height="500px" preview={false} />
                    </div>
                ))}

</OwlCarousel>
            {bodyContent.map(({ title, content ,imgUrl}, index) => (
                <div key={index} className="mt-3 h-1/4 ">
                    {index==1?<iframe className='mx-auto' width="560" height="315" src="https://www.youtube.com/embed/TLvDDRD7H4o" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>:""}
                     {/* {imgUrl&&index!=0 && <CustImage src={imgUrl} width="203px" height="289px"/>} */}
                    <div>
                    <p className={index % 2 === 0
                                            ? "pr-1 text-2xl font-thin text-right border-r-2 border-blue-600 lg:text-2xl font-Charm"
                                            : "pl-1 text-2xl font-thin border-l-2 border-green-600 lg:text-2xl font-Charm"}>{title || ""}</p>
                                        <p className={index % 2 === 0 ?   "-mt-2 text-right w-full":"pr-2 -mt-3 text-left w-full"}>{content || ""}
                                    
                                        </p>
                    </div>
                     
                    </div>
            ))}
            <div className='flex justify-end'>
                <Select className='w-1/6  my-4 text-center'>

                    <option value="1"><span className="text-yellow-400">★</span><span className="mx-2">1 คะแนน</span></option>
                    <option value="2"><span className="text-yellow-400">★</span><span className="mx-2">2 คะแนน</span></option>
                    <option value="3"><span className="text-yellow-400">★</span><span className="mx-2">3 คะแนน</span></option>
                    <option value="4"><span className="text-yellow-400">★</span><span className="mx-2">4 คะแนน</span></option>
                    <option value="5"><span className="text-yellow-400">★</span><span className="mx-2">5 คะแนน</span></option>
                    
                </Select>
            </div>
        </div>
    )
}