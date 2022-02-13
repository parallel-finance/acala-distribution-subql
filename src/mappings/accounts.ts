
/// local
// export const DISTRIBUTION: string = "5Grvfr55azJBaTMGjRGuZMnwcdRrBwbgRAwh2LQYZGP2p38L"
// export const CLAIMS: string[] = [
//     "5F6rUExJ7p9924vdaCShW9kYwnXFzZxWXTXbTH5NQhkryrxa", 
//     "5DPMn2hJW8FWVcUGy1QYCc1UjpB6fhiy3jfC7TdL927xLDaB"
// ]

// export const DISTRIBUTION: string = "5GF5ncvNrGY6DQTxTiHH54A7Zyx6172X2BguN9jtc3hujPgR"
export const DISTRIBUTION: string = "253yWsbUYxYqDXX7Ug8WzDeWtTNgFEsrz5xhgHAFnggJj4Pm"

export const CLAIMS: string[] = [
    "1Gu7GSgLSPrhc1Wci9wAGP6nvzQfaUCYqbfXxjYjMG9bob6",
    "13wNbioJt44NKrcQ5ZUrshJqP7TKzQbzZt5nhkeL4joa3PAX",
    "12of6J5x9TyCo1qFn96ZFBqKTZd3Su6Ugy6qZbfRfyv3ktSU",
    "5FZBmoDMD81QKztNWxywr24TC7VQJTLWcyVTTAJMXc9cutQ9"
]

// export function getDistribution(): string {
//     const act = process.env.DISTRIBUTION
//     if (act === undefined) {
//         logger.error("distributino account invalid")
//         throw "distributino account invalid"
//     }
//     logger.debug(`distribution account: ${act}`)
//     return act
// }


// export function getClaimers(): string[] {
//     const env = process.env.CLAIMS
//     let claims = []
//     try {
//         claims = JSON.parse(env)
//     } catch(e: any) {
//         logger.error("claims account parse error")
//         throw "claims account parse error"
//     }
//     logger.debug(`claim accounts: %o`, claims)
//     return claims
// }