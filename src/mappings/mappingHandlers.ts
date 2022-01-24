
import { SubstrateEvent } from "@subql/types";
import { DistributionTx, ClaimTx, TotalClaim } from "../types";
import { DISTRIBUTION, CLAIMS } from "./accounts";

type Tx = {
    id: string, // tx hash
    from: string,
    to: string,
    amount: string,
    blockHeight: number,
    timestamp: Date
}

function isDistribution(from: string): boolean {
    return DISTRIBUTION === from
}

function isClaim(to: string): boolean {
    return DISTRIBUTION === to
    // return CLAIMS.includes(from)
}

async function handleTotalClaimed(to: string, amount: string, block: number): Promise<void> {
    try {
        let record = await TotalClaim.get(to)
        if (record === undefined) {
            record = TotalClaim.create({
                id: to,
                amount: "0"
            })
        }
        logger.warn("claim record: %o", record)
        record.amount = (BigInt(record.amount) + BigInt(amount)).toString()
        record.blockHeight = block
        await record.save()
    } catch (e: any) {
        logger.error(`handle account[${to}] total claim error: %o`, e)
        throw e
    }
}

async function handleDistribution(tx: Tx): Promise<void> {
    try {
        let record = await DistributionTx.get(tx.id)
        if (record !== undefined) {
            logger.warn(`distribution hash [${tx.id}] has been recorded`)
            return
        }
        record = DistributionTx.create(tx)
        record.save()
    } catch (e: any) {
        logger.error("handle acala distribution error: %o", e)
        throw e
    }
}

async function handleClaim(tx: Tx): Promise<void> {
    try {
        let record = await ClaimTx.get(tx.id)
        if (record !== undefined) {
            logger.warn(`claim hash [${tx.id}] has been recorded`)
            return
        }
        record = ClaimTx.create(tx)
        await Promise.all([
            record.save(),
            handleTotalClaimed(tx.to, tx.amount, tx.blockHeight)
        ])
    } catch (e: any) {
        logger.error("handle acala claim error: %o", e)
        throw e
    }
}

export async function handleTransferEvent(event: SubstrateEvent): Promise<void> {
    const { event: { data: [signer, dest, value] } } = event;
    const from = signer.toString()
    const to = dest.toString()
    const isDistri = isDistribution(from)
    const isCla = isClaim(to)

    // filter signer we don't care
    if (!isDistri && !isCla) { 
        // logger.warn(`ignore event: from[${from}] to[${to.toString()}]`)
        return 
    }
    const tx: Tx = {
        id: event.extrinsic.extrinsic.hash.toString(),
        from,
        to,
        amount: value.toString(),
        blockHeight: event.block.block.header.number.toNumber(),
        timestamp: event.block.timestamp
    }
    if (isDistri) {
        await handleDistribution(tx)
    } else if (isCla) {
        await handleClaim(tx)
    }
}

