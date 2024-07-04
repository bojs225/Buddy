import React, { useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from "../graphql/queries/user_query";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction_query";
import Card from "./Card";
import toast from "react-hot-toast";

const Cards = ({ isLoggingOut }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const {
    data: authUserData,
    loading: authUserLoading,
    error: authUserError,
  } = useQuery(GET_AUTHENTICATED_USER, {
    skip: isLoggingOut,
    onError: (error) => {
      console.error("Error fetching authenticated user data:", error);
      toast.error("Failed to load user data.");
    },
  });

  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS, {
    skip: isLoggingOut,
    onError: (error) => {
      console.error("Error fetching transactions data:", error);
      toast.error("Failed to load transactions.");
    },
  });

  const { data: userAndTransactions, error: userAndTransactionsError } =
    useQuery(GET_USER_AND_TRANSACTIONS, {
      variables: { userId: authUserData?.authUser.id },
      skip: !authUserData || isLoggingOut,
      onError: (error) => {
        console.error(
          "Error while fetching user and transactions data:",
          error
        );
        toast.error("Failed to load user and transactions data.");
      },
    });

  if (authUserLoading || transactionsLoading) {
    return <div>Loading...</div>;
  }

  if (authUserError || transactionsError || userAndTransactionsError) {
    return <p>Error loading data! Try refreshing the page.</p>;
  }

  if (!transactionsData || !authUserData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full px-10 min-h-[40vh]">
      <button
        onClick={toggleCollapse}
        className="auth-input w-full mb-6 text-outline"
      >
        Transaction Record
        <span
          className={`ml-2 inline-block transition-transform duration-300 ${
            isCollapsed ? "rotate-0" : "rotate-180"
          }`}
        >
          ▼
        </span>
      </button>
      <div
        className={`history-container ${
          isCollapsed ? "collapsed" : "expanded"
        }`}
      >
        <div className="history-content" ref={contentRef}>
          <div className="transaction-grid">
            {transactionsData?.transactions?.map((transaction) => (
              <Card
                key={transaction.id}
                transaction={transaction}
                authUser={authUserData?.authUser}
              />
            ))}
          </div>
          {transactionsData?.transactions?.length === 0 && (
            <p className="text-2xl font-bold text-center w-full text-white text-outline">
              Record empty, log some transactions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;
