// pages/api/transactions.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MAINNET_URL } from 'hooks/useCluster';
import { Connection, ParsedTransactionWithMeta, BlockResponse, SignatureStatus } from '@bbachain/web3.js';

type Confirmations = {
    confirmations?: SignatureStatus
}

type ParsedTransactionWithMetaExtended = ParsedTransactionWithMeta & Confirmations

async function getLastTransactions(
    connection: Connection,
    endBlock: number,
    tx:number,
    limit: number
): Promise<{ transactions: ParsedTransactionWithMetaExtended[]; nextEndSlot: number | null;nextEndTx: number | null }> {
    const transactions: ParsedTransactionWithMetaExtended[] = [];
    let blockNumber = endBlock
    let txNumber = tx;
    while (true) {
        try {
            const block = await connection.getBlockSignatures(blockNumber);
            for (let i = 0;i<block.signatures.length;i++) {
                if (i < tx) {
                    txNumber = 0;
                    continue;
                }
                    const transaction = await connection.getParsedTransaction(block.signatures[i]);
                    const {value} = await connection.getSignatureStatus(block.signatures[i])
                transactions.push({...transaction,...{confirmations:value}})
               
                
                txNumber = txNumber + 1 < block.signatures.length ? txNumber + 1 : 0;
                if (transactions.length === limit) {
                    blockNumber = txNumber === 0 ? blockNumber - 1:blockNumber
                    break;
                }
            }
            if (transactions.length === limit) {
                    break;
            }
            blockNumber = blockNumber - 1;
        } catch (error) {
            console.error('Error fetching block data:', error);
        }
    }
        
    

    const nextEndSlot = blockNumber
    const nextEndTx = txNumber

    return { transactions, nextEndSlot,nextEndTx };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { endSlot,endTx } = req.query;
    const limit = 25;
    const connection = new Connection(MAINNET_URL,'confirmed');

    try {
        const slot = Number(endSlot)|| await connection.getBlockHeight();
        const tx = Number(endTx)|| 0
        const { transactions, nextEndSlot,nextEndTx } = await getLastTransactions(connection, slot,tx, limit);
        res.status(200).json({ transactions, nextEndSlot,nextEndTx });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
}
