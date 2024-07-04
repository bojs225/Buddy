import { DataTypes } from "sequelize";

const TransactionModel = (sequelize) => {
  const Transaction = sequelize.define("Transaction", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.ENUM("cash", "card"),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("saving", "expense", "income"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: "Unknown",
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Transaction;
};

export default TransactionModel;
