import { custodyLane, summary } from "../src/services/specimenChainOfCustodyConsoleService.js";

console.log("specimen-chain-of-custody-console demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`${custodyLane().length} custody lanes`);
