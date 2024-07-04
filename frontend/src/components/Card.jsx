import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { BsCardText } from "react-icons/bs";
import { MdOutlinePayments } from "react-icons/md";
import { FaSackDollar } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { HiPencilAlt } from "react-icons/hi";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { DELETE_TRANSACTION } from "../graphql/mutations/transaction_mutation";

const categoryColorMap = {
  saving: "bg-[rgba(75,192,192,0.3)] border-[rgba(75,192,192,1.0)]",
  expense: "bg-[rgba(255,99,132,0.3)] border-[rgba(255,99,132,1.0)]",
  investment: "bg-[rgba(153,102,255,0.3)] border-[rgba(153,102,255,1.0)]",
  income: "bg-[rgba(54,162,235,0.3)] border-[rgba(54,162,235,1.0)]",
};

const Card = ({ transaction, authUser }) => {
  let {
    category,
    amount,
    location,
    transactionDate,
    paymentType,
    description,
  } = transaction;
  const cardClass = categoryColorMap[category];
  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
  });

  description = description[0]?.toUpperCase() + description.slice(1);
  category = category[0]?.toUpperCase() + category.slice(1);
  paymentType = paymentType[0]?.toUpperCase() + paymentType.slice(1);

  const formattedDate = format(new Date(transactionDate), "dd MMM yyyy");

  const handleDelete = async () => {
    try {
      await deleteTransaction({ variables: { transactionId: transaction.id } });
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className={`rounded-md p-4 ${cardClass} glass-card`}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-bold text-white text-outline">
            {category}
          </h2>
          <div className="flex items-center gap-2">
            {!loading && (
              <FaTrash
                className="cursor-pointer text-white "
                onClick={handleDelete}
              />
            )}
            {loading && (
              <div className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            )}
            <Link to={`/transaction/${transaction.id}`}>
              <HiPencilAlt className="cursor-pointer text-white" size={20} />
            </Link>
          </div>
        </div>
        <p className="text-white flex items-center gap-1 text-outline">
          <BsCardText />
          Description: {description}
        </p>
        <p className="text-white flex items-center gap-1 text-outline">
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className="text-white flex items-center gap-1 text-outline">
          <FaSackDollar />
          Amount: ${amount}
        </p>
        <p className="text-white flex items-center gap-1 text-outline">
          <FaLocationDot />
          Location: {location || "N/A"}
        </p>
        <div className="flex justify-between items-center text-outline">
          <p className="text-xs text-white font-bold">{formattedDate}</p>
          <img
            src={authUser?.profilePicture}
            className="h-8 w-8 border rounded-full"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
