// "use client";

// import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import "./globals.css";
import Header from "@/components/Header/Header";
import { Raleway } from "next/font/google";
import SideBarLeft from "@/components/SideBar/SideBarLeft";
// import store from "@/lib/store/store";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.className}  antialiased mdl-js`}>
      <body className=" ">
        {/* <Provider store={store}> */}
        <div className="h-[100vh] p-2  overflow-hidden">
          <div className="h-full  border-[1px] border-gray-100 rounded-xl ">
            <div className="flex flex-1 h-full ">
              <SideBarLeft />
              <div className="flex min-h-0 flex-1 flex-col">
                <Header />

                <div className="flex-1 min-h-0 overflow-y-auto m-2 rounded-2xl bg-[#FAFAFA] p-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </Provider> */}
      </body>
    </html>
  );
}
