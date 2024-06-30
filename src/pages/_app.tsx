import { ChakraProvider } from "@chakra-ui/react";
import "../../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/core/layout";
import { RecoilRoot } from "recoil";
import { chakraTheme } from "../lib/chakra.config";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <RecoilRoot>
        <Layout>
          <Component {...pageProps} />
          <Toaster richColors />
        </Layout>
      </RecoilRoot>
    </ChakraProvider>
  );
}
