import { MeshProvider } from "@meshsdk/react";
import "@meshsdk/react/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import Navbar from "./components/NavBar";
import SvgMesh from "./components/SvgMesh";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Head>
        <title>Mesh staking template</title>
        <meta
          name="description"
          content="A Mesh staking template, created by Mesh"
        />
        <link rel="icon" href="https://meshjs.dev/favicon/favicon-32x32.png" />
        <link
          href="https://meshjs.dev/css/template.css"
          rel="stylesheet"
          key="mesh-demo"
        />
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="bg-white pt-16">
        <Component {...pageProps} />
      </main>
      <footer className="bg-gray-50">
        <div className="lg:-10 mx-auto max-w-screen-xl p-4 py-6 md:p-8">
          <div className="grid grid-cols-1">
            <div className="mb-2 flex items-center text-2xl font-semibold text-gray-900 sm:mb-0">
              <SvgMesh className="mr-3 h-6 sm:h-9" fill={"#000000"} />
              <span className="self-center whitespace-nowrap text-xl font-semibold">
                Mesh
              </span>
            </div>
            <p className="my-4 font-light text-gray-500">
              Mesh is an open-source library to advance Web3 development on
              Cardano.
            </p>
          </div>
        </div>
      </footer>
    </MeshProvider>
  );
}

export default MyApp;
