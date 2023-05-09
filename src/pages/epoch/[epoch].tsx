import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

// Views
import { EpochDetailView } from "views/epoch";

const EpochDetail: NextPage = (props) => {
  const router = useRouter();
  const epoch = router.query.epoch;

  if (!epoch) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Epoch {`${epoch}`} | Block Explorer</title>
        <meta name="description" content={`Block ${`${epoch}`} | Block Explorer`} />
      </Head>
      <EpochDetailView epoch={`${epoch}`} />
    </div>
  );
};

export default EpochDetail;
