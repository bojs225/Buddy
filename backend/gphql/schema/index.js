import { mergeTypeDefs } from "@graphql-tools/merge";
import userSchema from "./user_schema.js";
import transactionSchema from "./transaction_schema.js";

const Schema = mergeTypeDefs([userSchema, transactionSchema]);

export default Schema;
