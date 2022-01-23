
import { SubstrateEvent } from "@subql/types";
import { TransferTx, TotalReceive } from "../types";

import { MAIN_ACCOUNT, SUB_ACCOUNTS } from "./accounts";

function isMainAccount(account: string): boolean {
    return MAIN_ACCOUNT === account
}

function isSubAccount(account: string): boolean {
    return SUB_ACCOUNTS.includes(account)
}

function isMainReceive(to: string): boolean {
    return isMainAccount(to)
}


async function handleReceive(to: string, amount: string, block: number): Promise<void> {
    try {
        let record = await TotalReceive.get(to)
        if (record === undefined) {
            record = TotalReceive.create({
                id: to,
                amount: "0"
            })
        }
        record.amount = (BigInt(record.amount) + BigInt(amount)).toString()
        record.blockHeight = block
        await record.save()
    } catch (e: any) {
        logger.error(`handle account[${to}] received sumarize error: %o`, e)
        throw e
    }
}

export async function handleTransferEvent(event: SubstrateEvent): Promise<void> {
    //Retrieve the record by its ID

    const { event: { data: [from, to, value] } } = event;
    const from_str = from.toString()
    const to_str = to.toString()
    const val_str = value.toString()

    if (!isMainAccount(from_str) && !isSubAccount(from_str)) {
        return
    }

    const extHash = event.extrinsic.extrinsic.hash.toString()

    try {
        let record = await TransferTx.get(extHash)
        if (record !== undefined) {
            logger.warn(`extrinsic hash [${extHash}] has been recorded`)
            return
        }
        const blockHeight = event.block.block.header.number.toNumber()
        record = TransferTx.create({
            id: extHash,
            from: from_str,
            to: to_str,
            amount: val_str,
            blockHeight,
            timestamp: event.block.timestamp
        })

        if (isMainReceive(to_str)) {
            await Promise.all([
                handleReceive(to_str, val_str, blockHeight),
                record.save()
            ])
        } else {
            await record.save()
        }

    } catch (e: any) {
        logger.error("handle transfer event error: %o", e)
    }
}

