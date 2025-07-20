import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

// Views
import { TokenDetailView } from "views";

// Components
import { LoadingCard } from "components/common/LoadingCard";

const TokenDetail: NextPage = (props) => {
  const router = useRouter();
  const mint = router.query.mint;

  if (!mint) {
    return <LoadingCard message="Loading token detail" />;
  }

  const mintStr = `${mint}`;

  return (
    <div>
      <Head>
        <title>Token {mintStr} | Block Explorer</title>
        <meta
          name="description"
          content={`Token ${mintStr} | Block Explorer`}
        />
      </Head>
      <TokenDetailView mint={mintStr} />
    </div>
  );
};

export default TokenDetail;
