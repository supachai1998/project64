import React from 'react';
import { Image } from 'antd';
import { CircularProgress } from '@mui/material';

export default function CusImage({ width, height, src,name , className,preview }) {
    return (
        
        <Image
            // className={className+ " hover:scale-110 transform duration-300"}
            className={className}
            alt={name}
            width={width}
            height={height}
            src={src || "/static/images/no-image.png"}
            preview={preview}
            fallback="https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png"
            placeholder={
                <div className={"w-full h-full bg-gray-50 flex justify-center"}><CircularProgress className="m-auto"/></div>
              }
        />
    );
}   