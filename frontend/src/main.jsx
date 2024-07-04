import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import BgImg from "./components/BgImg.jsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

console.log("Creating Apollo Client");

const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:4000/graphql"
      : import.meta.env.VITE_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  credentials: "include",
  onError: ({ networkError, graphQLErrors, operation, response }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
            locations
          )}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  },
});

console.log("Rendering ReactDOM");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BgImg>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </BgImg>
    </BrowserRouter>
  </React.StrictMode>
);

console.log("Render completed");
