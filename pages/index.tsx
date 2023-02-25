import Head from "next/head"
import { Inter } from "@next/font/google"
import App from "@/components/App"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Cable CloudWork</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={inter.className}>
        <App />
      </main>
    </>
  )
}
