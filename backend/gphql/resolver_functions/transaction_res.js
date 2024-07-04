import models from "../data_models/index.js";
import {
  possibleCategories,
  possiblePaymentTypes,
} from "../data_models/config.js";

const formatTransactionDate = (transaction) => {
  return {
    ...transaction.toJSON(),
    transactionDate: transaction.transactionDate,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
  };
};

const transactionRes = {
  Query: {
    transactions: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser().id;
      const transactions = await models.Transaction.findAll({
        where: { userId },
      });
      return transactions.map(formatTransactionDate);
    },
    transaction: async (_, { transactionId }) => {
      const transaction = await models.Transaction.findByPk(transactionId);
      if (!transaction) return null;
      return formatTransactionDate(transaction);
    },
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser().id;
      const transactions = await models.Transaction.findAll({
        where: { userId },
      });
      const categoryMap = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) acc[transaction.category] = 0;
        acc[transaction.category] += parseFloat(transaction.amount);
        return acc;
      }, {});
      return Object.entries(categoryMap).map(([category, totalAmount]) => ({
        category,
        totalAmount,
      }));
    },
    categories: async () => {
      return possibleCategories;
    },
    paymentTypes: async () => {
      return possiblePaymentTypes;
    },
    transactionsByPaymentType: async (_, { paymentType }, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser().id;
      const transactions = await models.Transaction.findAll({
        where: { userId, paymentType },
      });
      return transactions.map(formatTransactionDate);
    },
    transactionsByCategory: async (_, { category }, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser().id;
      const transactions = await models.Transaction.findAll({
        where: { userId, category },
      });
      return transactions.map(formatTransactionDate);
    },
    transactionsByPaymentTypeAndCategory: async (
      _,
      { paymentType, category },
      context
    ) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const userId = context.getUser().id;
      const transactions = await models.Transaction.findAll({
        where: { userId, paymentType, category },
      });
      return transactions.map(formatTransactionDate);
    },
  },
  Mutation: {
    createTransaction: async (_, { input }, context) => {
      const userId = context.getUser().id;
      console.log("Input received for creating transaction:", input);

      if (!input.transactionDate) {
        throw new Error("TransactionDate field is missing in the input.");
      }

      const transactionDate = new Date(input.transactionDate);
      if (isNaN(transactionDate)) {
        throw new Error("Invalid date format. Please provide a valid date.");
      }

      console.log("Processed transactionDate:", transactionDate);

      const transaction = await models.Transaction.create({
        userId,
        description: input.description,
        paymentType: input.paymentType,
        category: input.category,
        amount: input.amount,
        location: input.location,
        transactionDate: transactionDate,
      });

      return formatTransactionDate(transaction);
    },
    updateTransaction: async (_, { input }) => {
      const { transactionId, transactionDate, ...updateFields } = input;
      if (transactionDate) {
        updateFields.transactionDate = new Date(transactionDate);
        if (isNaN(updateFields.transactionDate)) {
          throw new Error("Invalid date format. Please provide a valid date.");
        }
      }
      await models.Transaction.update(updateFields, {
        where: { id: transactionId },
      });
      const updatedTransaction = await models.Transaction.findByPk(
        transactionId
      );
      return formatTransactionDate(updatedTransaction);
    },
    deleteTransaction: async (_, { transactionId }) => {
      const transaction = await models.Transaction.findByPk(transactionId);
      await models.Transaction.destroy({ where: { id: transactionId } });
      return formatTransactionDate(transaction);
    },
  },
  Transaction: {
    user: async (parent) => {
      return await models.User.findByPk(parent.userId);
    },
  },
};

export default transactionRes;
