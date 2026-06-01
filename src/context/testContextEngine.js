import { loadErpContext } from "./contextEngine.js";

const context = loadErpContext();

console.log(
  JSON.stringify(
    context,
    null,
    2
  ).slice(0,1000)
);
