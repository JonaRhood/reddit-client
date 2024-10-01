
import type { ReactNode } from "react";
import Head from "next/head";
import { StoreProvider } from "./StoreProvider";
import Sidenav from "./components/sidenav/sidenav";
import "/public/styles/globals.css";
import { IBM_Plex_Sans } from 'next/font/google';
import { SWRegister } from "./components/SWRegister/SWRegister";
import MobileChecker from "./components/mobileChecker/MobileChecker";

import { AuthHandler } from "./components/authHandler/AuthHandler";
import { Suspense } from "react";


// const ibmPlexSans = IBM_Plex_Sans({
//   subsets: ['latin'],
//   weight: ['400', '500', '700'],
//   display: 'swap',
// });

interface Props {
  readonly children: ReactNode;
}

export default function RootLayout({
  modal,
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <html lang="en">
        <Head>
          <link rel="stylesheet" href="/app/styles/global.css" />
          <link rel="stylesheet" href="/app/styles/artReddits.module.css" />
          <link rel="stylesheet" href="/app/styles/artReddits.module.css" />
          <link rel="stylesheet" href="/app/styles/Gallery.module.css" />
          <link rel="stylesheet" href="/app/styles/sidenav.module.css" />
          <link rel="stylesheet" href="/app/styles/layout.module.css" />
        </Head>
        <body className={`

            bg-light-background text-light-text
        `}>
          {/* <Suspense fallback={null}>
            <SWRegister />
          </Suspense> */}
          <Suspense fallback={null}>
            <AuthHandler />
          </Suspense>
          <Suspense fallback={null}>
            <MobileChecker />
          </Suspense>
          <section className="flex">
            <div className="fixed bg-light-surface h-screen z-50">
              <Suspense fallback={null}>
                <Sidenav />
              </Suspense>
            </div>
            <div id="root">
              <Suspense fallback={null}>
                <main>
                  {children}
                  {modal}
                </main>
              </Suspense>
            </div>
          </section>
        </body>
      </html>
    </StoreProvider>
  );
}

export const metadata = {
  title: 'reddArt',
  description: 'Your site description here',
  icons: {
    icon: '/favicon.svg',
  },
};
