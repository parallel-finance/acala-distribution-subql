import { SubstrateEvent } from "@subql/types";
import {
  DistributionTx,
  ClaimTx,
  TotalClaim,
  TotalDistribution,
} from "../types";

export const DISTRIBUTION: string =
  "0x1F695652967615cdE319FDF59dD65B22c380EDC1";

type Tx = {
  id: string; // tx hash
  from: string;
  to: string;
  amount: string;
  blockHeight: number;
  timestamp: Date;
};

function isDistribution(from: string): boolean {
  return DISTRIBUTION === from;
}

function isClaim(to: string): boolean {
  return DISTRIBUTION === to;
}

async function handleTotalClaimed(
  to: string,
  amount: string,
  block: number
): Promise<void> {
  logger.info(
    `handle total claim from[${to}] amount[${amount}] at block[${block}]`
  );
  try {
    let record = await TotalClaim.get(to);
    if (record === undefined) {
      record = TotalClaim.create({
        id: to,
        amount: "0",
        blockHeight: block,
      });
    }
    record.amount = (BigInt(record.amount) + BigInt(amount)).toString();
    await record.save();
  } catch (e: any) {
    logger.error(`handle account[${to}] total claim error: %o`, e);
    throw e;
  }
}

async function handleTotalDistributed(
  from: string,
  amount: string,
  block: number
): Promise<void> {
  logger.info(
    `handle total distribution to[${from}] amount[${amount}] at block[${block}]`
  );
  try {
    let record = await TotalDistribution.get(from);
    if (record === undefined) {
      record = TotalDistribution.create({
        id: from,
        amount: "0",
        blockHeight: block,
      });
    }
    record.amount = (BigInt(record.amount) + BigInt(amount)).toString();
    await record.save();
  } catch (e: any) {
    logger.error(`handle account[${from}] total distribution error: %o`, e);
    throw e;
  }
}

async function handleDistribution(tx: Tx): Promise<void> {
  // logger.info(`handle new distribution from[${tx.from}] to[${tx.to}] amount[${tx.amount}]`)
  try {
    let record = await DistributionTx.get(tx.id);
    if (record !== undefined) {
      logger.warn(`distribution hash [${tx.id}] has been recorded`);
      return;
    }
    record = DistributionTx.create(tx);
    await Promise.all([
      record.save(),
      handleTotalDistributed(tx.from, tx.amount, tx.blockHeight),
    ]);
  } catch (e: any) {
    logger.error("handle acala distribution error: %o", e);
    throw e;
  }
}

async function handleClaim(tx: Tx): Promise<void> {
  logger.info(
    `handle new claim from[${tx.from}] to[${tx.to}] amount[${tx.amount}] at ${tx.id}`
  );
  try {
    let record = await ClaimTx.get(tx.id);
    if (record !== undefined) {
      logger.warn(`claim hash [${tx.id}] has been recorded`);
      return;
    }
    record = ClaimTx.create(tx);
    await Promise.all([
      record.save(),
      handleTotalClaimed(tx.to, tx.amount, tx.blockHeight),
    ]);
  } catch (e: any) {
    logger.error("handle acala claim error: %o", e);
    throw e;
  }
}

export async function handleTransferEvent(
  event: SubstrateEvent
): Promise<void> {
  try {
    const {
      event: {
        data: [signer, dest, value],
      },
    } = event;
    const from = signer.toString();
    const to = dest.toString();
    const isDistri = isDistribution(from);
    const isCla = isClaim(to);

    // filter signer we don't care
    if (!isDistri && !isCla) {
      // logger.warn(`ignore event: from[${from}] to[${to.toString()}]`)
      return;
    }

    const idx = event.idx;
    const blockHeight = event.block.block.header.number.toNumber();
    const hash = event.extrinsic.extrinsic.hash.toString();

    const tx: Tx = {
      id: `${hash}-${idx}`,
      from,
      to,
      amount: value.toString(),
      blockHeight,
      timestamp: event.block.timestamp,
    };
    if (isDistri) {
      await handleDistribution(tx);
    } else if (isCla) {
      await handleClaim(tx);
    }
  } catch (e: any) {
    logger.error(`handle transfer event error: %o`, e);
  }
}
