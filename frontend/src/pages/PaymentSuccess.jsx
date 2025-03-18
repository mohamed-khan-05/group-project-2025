import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const user_id = useContext(Context);
    if (!user_id) {
      return;
    }
    const verifyPaymentAndCreateOrder = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get("reference");

      if (!reference) {
        alert("No payment reference found!");
        navigate(`${url}/cart/${user_id}`);
        return;
      }

      try {
        const response = await axios.post(
          `${url}/cart/verify-paystack-payment`,
          { reference }
        );

        if (response.data.status === "success") {
          alert("Payment successful! Your order has been placed.");
          navigate(`${url}/cart/${user_id}`);
        } else {
          alert("Payment verification failed. Please contact support.");
          navigate(`${url}/cart/${user_id}`);
        }
      } catch (error) {
        console.error("Error verifying payment", error);
        alert("An error occurred while verifying payment.");
        navigate(`${url}/cart/${user_id}`);
      }
    };

    verifyPaymentAndCreateOrder();
  }, [navigate, user_id]);

  return <h2>Verifying payment, please wait...</h2>;
};

export default PaymentSuccess;
