import { DataTypes } from "sequelize";

const UserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
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

  User.associate = (models) => {
    User.hasMany(models.Transaction, {
      foreignKey: "userId",
      as: "transactions",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return User;
};

export default UserModel;
