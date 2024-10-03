import Head from "next/head"
import localFont from "next/font/local"
// import styles from "@/styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "@/components/Header"
import LotteryEntrance from "@/components/LotteryEntrance"

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
})
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
})

export default function Home() {
    return (
        <div>
            <Head>
                <title>Smart contract Lottery</title>
                <meta name="description" content="Our Smart Contract Lottery" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            Decentralized Lottery
            {/* 创建一个头部连接  按钮导航栏 小导航栏*/}
            {/* <ManualHeader /> */}
            <Header />
            <LotteryEntrance />
            Hello!
        </div>
    )
}
