import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import nProgress from "nprogress";
import { useRouter, Router } from "next/router";
import { useEffect } from "react";
import "../styles/globals.css";
import "../styles/phone-input.css";
import { AuthProvider } from "../src/contex/AuthContex";

nProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => {
  nProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  nProgress.done();
});
Router.events.on("routeChangeError", () => {
  nProgress.done();
});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return (
    <>
      <AuthProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="preload"
            href="/fonts/Idol/Idol-Poster.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Head>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default appWithTranslation(MyApp);
