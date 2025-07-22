'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function SessionQuestions() {
    const router = useRouter();
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         router.push('/');
    //     }
    // }, []);
    return (
        <>
            <div>oi</div>
        </>
    );
}