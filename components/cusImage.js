import React from 'react';
import { Image as Img, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import { CircularProgress } from '@mui/material';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const antIcon = <LoadingOutlined className='text-lg' spin />;
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

    React.useEffect(() => {
        if (!onSrc || src !== onSrc.split("/")[onSrc.split("/").length - 1]) checkIfImageExists(`/static/${src}`, (exists) => {
            if (exists) {
                setOnSrc(`/static/${src}`)
                return
            } else {
                checkIfImageExists(src, (exists) => {
                    if (exists) {
                        setOnSrc(src)
                        return
                    } else {
                        checkIfImageExists(`${publicRuntimeConfig.staticFolder}/static/${src}`, (exists) => {
                            if (exists) {
                                setOnSrc(`${publicRuntimeConfig.staticFolder}/static/${src}`)
                                return
                            } else {
                                checkIfImageExists(`${publicRuntimeConfig.staticFolder}/${src}`, (exists) => {
                                    if (exists) {
                                        setOnSrc(`${publicRuntimeConfig.staticFolder}/${src}`)
                                        return
                                    } else {
                                        setOnSrc("/notFound.jpg")
                                        return
                                    }
                                });
                            }
                        });
                    }
                });

            }
        });
    }, [onSrc, src])

    return (

        <Img
            // className={className+ " hover:scale-110 transform duration-300"}
            className={className}
            alt={name}
            width={width || "100%"}
            height={height || "100%"}
            loading="lazy"
            src={onSrc}
            preview={preview}
            fallback={<Load />}
            placeholder={<Load />}
        />
    );
}
const Load = () => <div className={"w-full h-full bg-gray-50 flex justify-center items-center"}><Spin indicator={antIcon} /></div>