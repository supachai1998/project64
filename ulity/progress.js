import { useState, useEffect } from 'react'
export const LinearProgressBar = ({ className, progressPercentage = 0, delay=1000 }) => {
    const [progress, setProgress] = useState(progressPercentage)
    useEffect(() => {
        const interval = setInterval(async () => {
            if (progress < 100) {
                setProgress(progress + 1)
            } else {
                clearInterval(interval)
            }
        }, delay)
        return clearInterval(interval)
    }, [])
    return (
        <div className={'h-1 bg-gray-300'+className}>
            <div
                style={{ width: `${progress}%` }}
                className={`h-full ${progress < 70 ? 'bg-red-200' : 'bg-green-600'}`}>
            </div>
        </div>
    );
};
