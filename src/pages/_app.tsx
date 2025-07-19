import { AppProps } from "next/app";
import Head from "next/head";
import { FC } from "react";
import * as Sentry from "@sentry/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { ContextProvider } from "../contexts/ContextProvider";
import { AppBar } from "../components/AppBar";
import { ContentContainer } from "../components/ContentContainer";
import { Footer } from "../components/Footer";
import darkTheme from "../themes/darkTheme";
require("../styles/globals.css");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://1461315772b645a58897178afb40f6eb@o4504830569938944.ingest.sentry.io/4504830571642880",
  });
}

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>BBAChain Explorer | Block Explorer</title>
      </Head>

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ContextProvider>
          <div className="flex flex-col h-screen">
            <AppBar />
            <ContentContainer>
              <Component {...pageProps} />
              <Footer />
            </ContentContainer>
          </div>
        </ContextProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
