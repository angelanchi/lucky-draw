import { Inter } from "next/font/google"  
import "./globals.css"  

const inter = Inter({ subsets: ["latin"] })  

export default function RootLayout({ children }) {  
  return (  
    <html lang="en">  
      <body className="bg-white text-black">{children}</body>  
    </html>  
  )  
}