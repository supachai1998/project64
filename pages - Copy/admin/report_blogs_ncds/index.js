import React from 'react'
import {  useSession } from 'next-auth/react'
import { LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';

export default function Index() {
    const { status } = useSession()
    const router  = useRouter()
    if (status === "authenticated") {
        return (
            <>
                {status}
            </>
        )
    }
    else if (status === "unauthenticated")  {
       return <div className="flex items-center justify-center h-screen text-3xl">คุณไม่ใช่ผู้ดูแลระบบ</div>
    }
    return <LinearProgress/>
}
