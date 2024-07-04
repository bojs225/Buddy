import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, addDays } from "date-fns";
import {
  GET_TRANSACTION,
  GET_TRANSACTION_STATISTICS,
} from "../graphql/queries/transaction_query";
import { UPDATE_TRANSACTION } from "../graphql/mutations/transaction_mutation";
import toast from "react-hot-toast";

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery(GET_TRANSACTION, {
    variables: { id },
  });

  const [updateTransaction, { loading: loadingUpdate }] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: [GET_TRANSACTION_STATISTICS],
      onCompleted: () => {
        toast.success("Transaction updated successfully");
      },
      onError: (error) => {
        console.error("Error updating transaction:", error);
        toast.error(`Failed to update transaction: ${error.message}`);
      },
    }
  );

  const [formData, setFormData] = useState({
    description: "",
    paymentType: "",
    category: "",
    amount: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        description: data.transaction.description,
        paymentType: data.transaction.paymentType,
        category: data.transaction.category,
        amount: data.transaction.amount,
        location: data.transaction.location,
        date: format(parseISO(data.transaction.transactionDate), "yyyy-MM-dd"),
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      transactionId: id,
      description: formData.description,
      paymentType: formData.paymentType.toLowerCase(),
      category: formData.category.toLowerCase(),
      amount: parseFloat(formData.amount),
      location: formData.location,
      transactionDate: addDays(new Date(formData.date), 1).toISOString(),
    };

    try {
      console.log("Sending update with data:", updatedData);
      const result = await updateTransaction({
        variables: { input: updatedData },
      });
      console.log("Update result:", result);
      toast.success("Transaction updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error(`Failed to update transaction: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <div className="auth-card w-full max-w-lg p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-6 text-white text-center text-shadow-lg">
          Update Transaction
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="description"
              className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
            >
              Description
            </label>
            <input
              className="auth-input w-full"
              id="description"
              name="description"
              type="text"
              placeholder="Groceries"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="paymentType"
                className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
              >
                Payment Type
              </label>
              <input
                className="auth-input w-full"
                id="paymentType"
                name="paymentType"
                type="text"
                placeholder="Cash, Credit Card, etc."
                value={formData.paymentType}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
              >
                Category
              </label>
              <input
                className="auth-input w-full"
                id="category"
                name="category"
                type="text"
                placeholder="Income, Expense, etc."
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="amount"
                className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
              >
                Amount
              </label>
              <input
                className="auth-input w-full"
                id="amount"
                name="amount"
                type="number"
                placeholder="150"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
              >
                Location
              </label>
              <input
                className="auth-input w-full"
                id="location"
                name="location"
                type="text"
                placeholder="New York"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="date"
              className="text-white text-xl font-semibold block mb-2 text-shadow-sm"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="auth-input w-full"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <button
            className="auth-button w-full"
            type="submit"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? "Updating..." : "Update Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTransaction;
