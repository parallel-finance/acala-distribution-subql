
/// local
// export const DISTRIBUTION: string = "5Grvfr55azJBaTMGjRGuZMnwcdRrBwbgRAwh2LQYZGP2p38L"
// export const CLAIMS: string[] = [
//     "5F6rUExJ7p9924vdaCShW9kYwnXFzZxWXTXbTH5NQhkryrxa", 
//     "5DPMn2hJW8FWVcUGy1QYCc1UjpB6fhiy3jfC7TdL927xLDaB"
// ]

export const DISTRIBUTION: string = "hJFXj2yn2ancA16haF1zTzcVysGGw3Bo4ZaqbnMGLSTR9U5aP"
export const CLAIMS: string[] = [
    "hJFFqkBAzBkf76eb4HyfTbHRERqYv6kW7RzUgVNyt7JBdK4oD"
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