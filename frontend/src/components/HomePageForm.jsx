import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TRANSACTION } from "../graphql/mutations/transaction_mutation";
import toast from "react-hot-toast";
import { addDays } from "date-fns";

const TransactionForm = () => {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const dateString = formData.get("date");
    const date = addDays(new Date(dateString), 1);

    const transactionData = {
      description: formData.get("description"),
      paymentType: formData.get("paymentType").toLowerCase(),
      category: formData.get("category").toLowerCase(),
      amount: parseFloat(formData.get("amount")),
      location: formData.get("location"),
      transactionDate: date.toISOString(),
    };

    try {
      await createTransaction({ variables: { input: transactionData } });

      form.reset();
      toast.success("Transaction created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form className="w-full max-w-lg p-6" onSubmit={handleSubmit}>
      <h2 className=" text-3xl font-bold mb-6 text-white text-center text-outline">
        Add Transaction
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="description"
            className="text-white text-lg font-semibold block mb-2 text-outline "
          >
            Description
          </label>
          <input
            className="auth-input w-full "
            name="description"
            type="text"
            required
            placeholder="Description"
          />
        </div>
        <div>
          <label
            htmlFor="paymentType"
            className="text-white text-lg font-semibold block mb-2 text-outline"
          >
            Payment Type
          </label>
          <input
            className="auth-input w-full"
            name="paymentType"
            type="text"
            placeholder="Payment Type"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="text-white text-lg font-semibold block mb-2 text-outline"
          >
            Category
          </label>
          <input
            className="auth-input w-full"
            name="category"
            type="text"
            placeholder="Category"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="text-white text-lg font-semibold block mb-2 text-outline"
          >
            Amount
          </label>
          <input
            className="auth-input w-full"
            name="amount"
            type="number"
            placeholder="Amount"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="text-white text-lg font-semibold block mb-2 text-outline"
          >
            Location
          </label>
          <input
            className="auth-input w-full"
            name="location"
            type="text"
            placeholder="Location"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="text-white text-lg font-semibold block mb-2 text-outline"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            className="auth-input w-full"
            placeholder="Date"
          />
        </div>
      </div>
      <button
        className="auth-input w-full mt-6 text-outline"
        type="submit"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
};
export default TransactionForm;
