import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "../graphql/queries/user_query";
import { GET_TRANSACTION_STATISTICS } from "../graphql/queries/transaction_query";
import { LOGOUT } from "../graphql/mutations/user_mutation";
import ChartDisplay from "../components/ChartDisplay";
import TransactionForm from "../components/HomePageForm";
import Cards from "../components/Cards";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";

const HomePage = () => {
  const client = useApolloClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownVisible) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownVisible]);

  const {
    loading: loadingAuth,
    data: authUserData,
    error: authUserError,
    refetch: refetchAuthUser,
  } = useQuery(GET_AUTHENTICATED_USER, {
    onError: (error) => {
      console.error("Error fetching authenticated user data:", error);
      toast.error("Failed to load user data.");
    },
  });

  const {
    loading: loadingStats,
    data: statsData,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_TRANSACTION_STATISTICS, {
    skip: loadingAuth || isLoggingOut,
    onError: (error) => {
      if (!isLoggingOut) {
        console.error("Error fetching transaction statistics data:", error);
        toast.error("Failed to load transaction statistics.");
      }
    },
  });

  const [logout] = useMutation(LOGOUT, {
    onError: (error) => {
      console.error("Error logging out:", error);
      toast.error(error.message);
    },
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { data: [], backgroundColor: [], borderColor: [], borderWidth: 1 },
    ],
  });

  useEffect(() => {
    if (statsData) {
      const categories = statsData.categoryStatistics.map(
        (stat) => stat.category
      );
      const totalAmounts = statsData.categoryStatistics.map(
        (stat) => stat.totalAmount
      );

      const backgroundColors = [
        "rgba(54, 162, 235, 0.6)",

        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ];
      const borderColors = backgroundColors.map((color) =>
        color.replace("0.6", "1.0")
      );

      setChartData({
        labels: categories,
        datasets: [
          {
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      });
    }
  }, [statsData]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      await client.resetStore();
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  if (authUserError) {
    console.error(
      "Error while fetching authenticated user data:",
      authUserError
    );
    return (
      <div>
        <p>Error loading user data! Try refreshing the page.</p>
        <button onClick={() => refetchAuthUser()}>Retry</button>
      </div>
    );
  }

  if (statsError && !isLoggingOut) {
    console.error(
      "Error while fetching transaction statistics data:",
      statsError
    );
    return (
      <div>
        <p>Error loading transaction statistics! Try refreshing the page.</p>
        <button onClick={() => refetchStats()}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 justify-center">
        <div className="absolute top-0 right-0 mt-4 mr-4 flex items-center space-x-4 auth-input rounded-full px-4 py-2 z-30">
          <div
            className="flex items-center space-x-4 relative z-40"
            onClick={toggleDropdown}
          >
            <div>
              <img
                src={authUserData?.authUser.profilePicture}
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                alt="Avatar"
              />
            </div>
            <span className="text-white font-semibold text-lg text-shadow-sm cursor-pointer">
              Hello, {authUserData?.authUser.name}
            </span>
          </div>
          {dropdownVisible && (
            <div
              className="dropdown-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-white hover:bg-white hover:bg-opacity-20 w-full text-left"
                >
                  <MdLogout className="inline-block w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap w-full justify-center items-center gap-6 mt-16">
          {statsData?.categoryStatistics.length > 0 && (
            <ChartDisplay data={chartData} />
          )}
          <TransactionForm />
        </div>
        <Cards isLoggingOut={isLoggingOut} />
      </div>
    </>
  );
};

export default HomePage;
