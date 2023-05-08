import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { LoadingCard } from "components/common/LoadingCard";
import { TxDetailView } from "views/tx";

const TxDetail: NextPage = (props) => {
  const router = useRouter();
  const tx = router.query.tx;

  if (!tx) {
    return <LoadingCard message="Loading transaction detail" />;
  }

  const txStr = `${tx}`;

  return (
    <div>
      <Head>
        <title>Tx {txStr} | Block Explorer</title>
        <meta name="description" content={`Address ${txStr} | Block Explorer`} />
      </Head>
      <TxDetailView tx={txStr} />
    </div>
  );
};

export default TxDetail;
