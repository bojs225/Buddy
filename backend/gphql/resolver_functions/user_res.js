import models from "../data_models/index.js";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server-express";

function getRandomSeed() {
  return Math.random().toString(36).substring(2, 15);
}

const userRes = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      const { username, name, password, gender } = input;
      if (!username || !name || !password || !gender)
        throw new Error("All fields are required");

      const existingUser = await models.User.findOne({ where: { username } });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const randomSeed = getRandomSeed();
      const profilePicture = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${randomSeed}`;

      const newUser = await models.User.create({
        username,
        name,
        password: hashedPassword,
        gender,
        profilePicture,
      });

      await new Promise((resolve, reject) => {
        context.login(newUser, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return newUser;
    },

    login: async (_, { input }, context) => {
      const { username, password } = input;
      if (!username || !password) throw new Error("All fields are required");

      const user = await models.User.findOne({ where: { username } });
      if (!user) throw new Error("Invalid username or password");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid username or password");

      await new Promise((resolve, reject) => {
        context.login(user, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return user;
    },

    logout: async (_, __, context) => {
      return new Promise((resolve, reject) => {
        context.req.logout((err) => {
          if (err) return reject(err);

          context.req.session.destroy((err) => {
            if (err) return reject(err);

            context.res.clearCookie("connect.sid");
            resolve({ message: "Logged out successfully" });
          });
        });
      });
    },
  },

  Query: {
    authUser: async (_, __, context) => {
      console.log("Fetching authenticated user:", context.getUser());
      return context.getUser();
    },
    me: async (_, __, context) => {
      if (!context.req.user) {
        throw new AuthenticationError("You are not authenticated");
      }
      return context.req.user;
    },
    user: async (_, { userId }) => {
      return await models.User.findByPk(userId);
    },
  },

  User: {
    transactions: async (parent) => {
      return await models.Transaction.findAll({ where: { userId: parent.id } });
    },
  },
};

export default userRes;
