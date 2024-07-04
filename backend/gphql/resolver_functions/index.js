import { mergeResolvers } from "@graphql-tools/merge";
import userRes from "./user_res.js";
import transactionRes from "./transaction_res.js";

const Resolvers = mergeResolvers([userRes, transactionRes]);

export default Resolvers;
