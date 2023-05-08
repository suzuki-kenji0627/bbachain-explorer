import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

// Views
import { AddressDetailView } from "views";

// Components
import { LoadingCard } from "components/common/LoadingCard";

const AddressDetail: NextPage = (props) => {
  const router = useRouter();
  const address = router.query.address;

  if (!address) {
    return <LoadingCard message="Loading address detail" />;
  }

  const addressStr = `${address}`;

  return (
    <div>
      <Head>
        <title>Address {addressStr} | Block Explorer</title>
        <meta name="description" content={`Address ${addressStr} | Block Explorer`} />
      </Head>
      <AddressDetailView address={addressStr} />
    </div>
  );
};

export default AddressDetail;
