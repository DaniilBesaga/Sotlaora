'use client'

import Footer from "./components/layout/Footer"
import Header from "./components/layout/Header"
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {

    const path = usePathname();

    return(
    <>
        {path.includes('auth') ? null : <Header />}
            <main style={{paddingTop: path.includes('auth') ? '0' : '20px'}}>
                {children}
            </main>
        <Footer/>
    </>
    )
}