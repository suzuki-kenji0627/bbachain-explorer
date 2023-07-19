import React, { useContext } from "react";
import {
  TransactionInstruction,
  SignatureResult,
  ParsedInstruction,
} from "@bbachain/web3.js";
import { SignatureContext } from "views/tx";

// Components
import { Address } from "components/common/Address";
import { RawDetail } from "./RawDetail";
import { RawParsedDetail } from "./RawParsedDetail";

// Hooks
import {
  useFetchTransactionDetailRaw,
  useTransactionDetailRaw,
} from "hooks/useTransactionDetailRaw";

type InstructionProps = {
  title: string;
  children?: React.ReactNode;
  result: SignatureResult;
  index: number;
  ix: TransactionInstruction | ParsedInstruction;
  defaultRaw?: boolean;
  innerCards?: JSX.Element[];
  childIndex?: number;
};

export function InstructionCard({
  title,
  children,
  result,
  index,
  ix,
  defaultRaw,
  innerCards,
  childIndex,
}: InstructionProps) {
  const [resultClass] = ixResult(result, index);
  const [showRaw, setShowRaw] = React.useState(defaultRaw || false);
  const signature = useContext(SignatureContext);
  const rawDetail = useTransactionDetailRaw(signature);

  let raw: TransactionInstruction | undefined = undefined;
  if (rawDetail && childIndex === undefined) {
    raw = rawDetail?.data?.raw?.transaction.instructions[index];
  }

  const fetchRaw = useFetchTransactionDetailRaw();
  const fetchRawTrigger = () => fetchRaw(signature);

  const rawClickHandler = () => {
    if (!defaultRaw && !showRaw && !raw) {
      fetchRawTrigger();
    }

    return setShowRaw((r) => !r);
  };

  return (
    <div className="card bg-[#011909] shadow-xl mb-4">
      <div className="card-body">
        <h3 className="card-title">
          <span className={`badge bg-${resultClass}-soft me-2`}>
            #{index + 1}
            {childIndex !== undefined ? `.${childIndex + 1}` : ""}
          </span>
          {title}
        </h3>

        <button
          disabled={defaultRaw}
          className={`btn btn-sm d-flex ${
            showRaw ? "btn-black active" : "btn-white"
          }`}
          onClick={rawClickHandler}
        >
          <span className="fe fe-code me-1"></span>
          Raw
        </button>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              {showRaw ? (
                <>
                  <tr>
                    <td>Program</td>
                    <td className="text-lg-end">
                      <Address pubkey={ix.programId} link />
                    </td>
                  </tr>
                  {"parsed" in ix ? (
                    <RawParsedDetail ix={ix}>
                      {raw ? <RawDetail ix={raw} /> : null}
                    </RawParsedDetail>
                  ) : (
                    <RawDetail ix={ix} />
                  )}
                </>
              ) : (
                children
              )}
              {innerCards && innerCards.length > 0 && (
                <>
                  <tr className="table-sep">
                    <td colSpan={3}>Inner Instructions</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <div className="inner-cards">{innerCards}</div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ixResult(result: SignatureResult, index: number) {
  if (result.err) {
    const err = result.err as any;
    const ixError = err["InstructionError"];
    if (ixError && Array.isArray(ixError)) {
      const [errorIndex, error] = ixError;
      if (Number.isInteger(errorIndex) && errorIndex === index) {
        return ["warning", `Error: ${JSON.stringify(error)}`];
      }
    }
    return ["dark"];
  }
  return ["success"];
}
