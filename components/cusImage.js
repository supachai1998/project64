import React, { useEffect } from 'react';
import { Image as Img } from 'antd';
import { CircularProgress } from '@mui/material';

export default function CusImage({ width, height, src, name, className, preview }) {
    const [onSrc, setOnSrc] = React.useState()
    async function checkIfImageExists(url, callback) {
        const img = new Image();
        img.src = url;

        if (img.complete) {
            callback(true);
        } else {
            img.onload = () => {
                callback(true);
            };

            img.onerror = () => {
                callback(false);
            };
        }
    }
    useEffect(() => {
        checkIfImageExists(src, (exists) => {
            if (exists) {
                setOnSrc(src)

            } else {
                checkIfImageExists(`/uploads/${src}`, (exists) => {
                    if (exists) {
                        setOnSrc(`/uploads/${src}`)
                    } else {
                        setOnSrc("https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png")
                    }
                });
            }
        });
    }, [src])

    return (

        <Img
            // className={className+ " hover:scale-110 transform duration-300"}
            className={className}
            alt={name}
            width={width}
            height={height}
            src={onSrc || "https://cdn.iconscout.com/icon/free/png-256/data-not-found-1965034-1662569.png"}
            preview={preview}
            fallback={<div className={"w-full h-full bg-gray-50 flex justify-center"}><CircularProgress className="m-auto" /></div>}
            placeholder={
                <div className={"w-full h-full bg-gray-50 flex justify-center"}><CircularProgress className="m-auto" /></div>
            }
        />
    );
}   