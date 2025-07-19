import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BBAChain Explorer | Block Explorer</title>
        <meta
          name="description"
          content="BBAChain Explorer | Block Explorer"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
