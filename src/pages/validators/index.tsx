import type { NextPage } from "next";
import Head from "next/head";
import { ValidatorsView } from "views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BBASCAN | Block Explorer</title>
        <meta name="description" content="BBASCAN | Block Explorer" />
      </Head>
      <ValidatorsView />
    </div>
  );
};

export default Home;
