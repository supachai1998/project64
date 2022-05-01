
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';

import router from 'next/router';
import dynamic from 'next/dynamic'
const OwlCarousel = dynamic(() => import('react-owl-carousel'), {
  ssr: false,
});
const easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 1.2, ease: easing }
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: easing
    }
  }
};
const state = {
  responsive: {
    0: {
      items: 1,
    },
    450: {
      items: 1,
    },
    750: {
      items: 2,
    },
    1000: {
      items: 3,
    },
    1250: {
      items: 4,
    },
  },
}
const customIcons = {
  1: <FrownOutlined className="text-red-600 stroke-current " />,
  2: <FrownOutlined className="text-red-400" />,
  3: <MehOutlined className="text-yellow-500" />,
  4: <SmileOutlined className="text-green-400" />,
  5: <SmileOutlined className="text-green-600" />,
};

export default function Owl_Carousel({ title, link,noheader=false, info_top, info_down, children, margin }) {
  if (!window){ return null}
  return (
    <div
      className='md:w-full pl-3 pr-4 sm:px-0 md:mx-2 '
    >
     {!noheader&& title && info_top && <div className="flex justify-center flex-col w-full px-3 py-3 transition-all duration-500 ease-in-out rounded-2xl">
        {title && <p className={"card-header-top"}>{title}</p>}
        {info_top && <span className=' w-full text-right mb-4 border-b border-b-green hover:text-gray-500 text-black' >
          {info_top}
        </span>}
      </div>}
      <div className={margin !== 0 ? "sm:m-10 mt-0 m-2" : "mt-0"}>
        <OwlCarousel
          loop={false}
          items={3}
          responsiveRefreshRate={0}
          autoplay={true}
          autoplayTimeout={12000}
          autoplayHoverPause={true}
          nav={true}
          responsiveClass={true}
          responsive={state.responsive}
          navText={[
            '<i class="icon-arrow-prev w-8 h-8 hover:bg-gray-800 ease  md:w-10 md:h-10"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-left"  fill="currentColor" aria-hidden="true"><path d="M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></i>',
            '<i class="icon-arrow-next w-8 h-8 hover:bg-gray-800 ease  md:w-10 md:h-10"><svg viewBox="64 64 896 896" focusable="false" data-icon="arrow-right" fill="currentColor" aria-hidden="true"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z"></path></svg></i>'
          ]}
          dots={false}
          margin={20} >
          {children}
        </OwlCarousel>
        {link && <div className='flex justify-end text-lg sm:mt-0  mt-10'>
          <a  className='text-right text-gray-500 hover:text-black sm:mt-0 -mt-10' onClick={() => router.push(`/${link}`)}>{info_down}</a>
        </div>}
      </div>
    </div>

  )


}

