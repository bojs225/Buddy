const transactionSchema = `#graphql
  scalar Date

  type Transaction {
    id: ID!
    userId: ID!
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    location: String
    transactionDate: Date!
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }

  type Query {
    transactions: [Transaction!]
    transaction(transactionId: ID!): Transaction
    categoryStatistics: [CategoryStatistics!]
    categories: [String!]
    paymentTypes: [String!]
    transactionsByPaymentType(paymentType: String!): [Transaction!]
    transactionsByCategory(category: String!): [Transaction!]
    transactionsByPaymentTypeAndCategory(paymentType: String!, category: String!): [Transaction!]
  }

  type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!
  }

  type CategoryStatistics {
    category: String!
    totalAmount: Float!
  }

  input CreateTransactionInput {
    description: String!
    paymentType: String!
    category: String!
    amount: Float!
    transactionDate: Date!
    location: String
  }

  input UpdateTransactionInput {
    transactionId: ID!
    description: String
    paymentType: String
    category: String
    amount: Float
    location: String
    transactionDate: Date
  }
`;

export default transactionSchema;
