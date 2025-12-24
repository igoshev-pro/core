"use client";

import Image from "next/image";

export default function NotFound() {
    return (
        // <div className="w-screen h-screen flex justify-center items-center">
        <div
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                src="/img/system/404.png"
                alt="404"
                width={600}
                height={400}
                priority
            />
        </div>
    );
}