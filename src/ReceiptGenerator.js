import React, { useState } from "react";
import axios from "axios";
import Receipt from "./Receipt"; // Ensure the path is correct
import ReceiptForm from "./ReceiptForm"; // Correct relative path
import Modal from "./Modal"; // Ensure the path is correct

const ReceiptGenerator = () => {
  const [details, setDetails] = useState({
    libraryName: "PIONEER LIBRARY",
    address: "Vighnaharta Apartment, Tilak Road, Pune",
    contact: "Mob: 8830449779 / 8010188570",
    gstrNo: "__________",
    receiptNo: "__________",
    seatNo: "__________",
    month: "__________",
    date: "__________",
    receiver: "",
    contactNo: "",
    draft: "",
    totalAmount: "",
    deposit: "",
    nextPaymentDate: "",
    paymentMethod: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const fetchDetailsFromAPI = async () => {
    try {
      const response = await axios.get("/api/receipt-details"); // Replace with your API endpoint
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching receipt details:", error);
    }
  };

  const generateReceipt = () => {
    setShowModal(true);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Generate Fee Receipt
      </h1>

      {/* Form for Input */}
      <ReceiptForm details={details} onChange={handleChange} />

      {/* Button to Fetch Details */}
      <button
        onClick={fetchDetailsFromAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Fetch Details from API
      </button>

      {/* Button to Generate Receipt */}
      <button
        onClick={generateReceipt}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate Receipt
      </button>

      {/* Display Modal with Receipt */}
      <Modal showModal={showModal} onClose={() => setShowModal(false)}>
        <Receipt
          libraryName={details.libraryName}
          address={details.address}
          contact={details.contact}
          gstrNo={details.gstrNo}
          receiptNo={details.receiptNo}
          seatNo={details.seatNo}
          month={details.month}
          date={details.date}
          receiver={details.receiver}
          contactNo={details.contactNo}
          draft={details.draft}
          totalAmount={details.totalAmount}
          deposit={details.deposit}
          nextPaymentDate={details.nextPaymentDate}
          paymentMethod={details.paymentMethod}
        />
        <div className="text-center mt-6">
          <button
            onClick={printReceipt}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Print Receipt
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReceiptGenerator;
