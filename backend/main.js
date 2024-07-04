import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from "graphql-passport";
import Resolvers from "./gphql/resolver_functions/index.js";
import Schema from "./gphql/schema/index.js";
import models from "./gphql/data_models/index.js";
import passport from "passport";
import { configurePassport } from "./authentication/auth.js";
import { pool } from "./database/test_Database.js";
import { GraphQLScalarType, Kind } from "graphql";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

const PgSession = connectPgSimple(session);

const store = new PgSession({
  pool: pool,
  tableName: "sessions",
  errorLog: (err) => console.error("Session Store Error:", err),
});

store.on("error", (err) => console.log(err));
console.log("SESSION_SECRET:", process.env.SESSION_SECRET);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
    throw Error("GraphQL Date Scalar serializer expected a `Date` object");
  },
  parseValue(value) {
    if (typeof value === "string") {
      return new Date(value);
    }
    throw new Error("GraphQL Date Scalar parser expected a `string`");
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const server = new ApolloServer({
  typeDefs: Schema,
  resolvers: {
    Date: dateScalar,
    ...Resolvers,
  },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      console.log("Session ID:", req.sessionID);
      console.log("Session:", req.session);
      console.log("User in session:", req.user);
      const context = await buildContext({ req, res, models });

      return {
        ...context,
        getUser: () => req.user,
      };
    },
  })
);

httpServer.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(` Server: http://localhost:${process.env.PORT || 4000}/graphql`)
);
