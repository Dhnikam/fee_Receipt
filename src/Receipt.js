import React from "react";
import logo from "./logo.png";
import qr from "./qr-code (1).png";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Receipt = ({ formData, seatNo, receiptNo, date }) => {
  function getFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const {
    fullName,
    contactNumber,
    month,
    aadharNumber,
    preparingFor,
    gender,
    address,
    membershipType,
    room,
    desk,
    deposit,
    fee,
    paymentMethod,
    authorityPerson,
  } = formData;

  const printReceipt = () => {
    window.print();
  };

  const saveAsPdf = () => {
    const receiptElement = document.getElementById("receipt");
    html2canvas(receiptElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("receipt.pdf");
    });
  };

  return (
    <div
      id="receipt"
      className="max-w-4xl mx-auto p-4 bg-white border border-gray-300 rounded-lg shadow-md"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <img src={logo} alt="Logo" className="h-16 mb-4 md:mb-0" />
        <div className="text-center md:text-left">
          <p className="text-xl md:text-2xl font-bold text-orange-500">
            PIONEER LIBRARY
          </p>
          <p className="text-orange-500">
            Vighnaharta Apartment, Tilak Road, Pune
          </p>
          <p className="text-orange-500">Mob: 8830449779 / 8010188570</p>
        </div>
        <img src={qr} alt="QR Code" className="h-16 mt-4 md:mt-0" />
      </div>

      {/* Receipt Details */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="text-left mb-4 md:mb-0">
          <h2 className="text-lg md:text-xl font-semibold text-orange-500">
            RECEIPT
          </h2>
          <p className="text-orange-500">GSTR No.: __________</p>
          <p className="text-orange-500">Receipt No.: {receiptNo}</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-orange-500">Seat No.: {desk}</p>
          <p className="text-orange-500">Month: {month}</p>
          <p className="text-orange-500">Date: {getFormattedDate()}</p>
        </div>
      </div>

      {/* Received From Section */}
      <div className="mb-6">
        <label className="block mb-2 text-orange-500">
          Received with thanks from Mr./Ms./Mrs.:
        </label>
        <input
          type="text"
          value={fullName}
          className="w-full border border-gray-300 p-2 rounded-md"
          readOnly
        />
      </div>

      {/* Contact No. Section */}
      <div className="mb-6">
        <label className="block mb-2 text-orange-500">Contact No.:</label>
        <input
          type="text"
          value={contactNumber}
          className="w-full border border-gray-300 p-2 rounded-md"
          readOnly
        />
      </div>

      {/* By Draft Section */}
      <div className="mb-6">
        <label className="block mb-2 text-orange-500">Aadhar No.:</label>
        <input
          type="text"
          value={aadharNumber}
          className="w-full border border-gray-300 p-2 rounded-md"
          readOnly
        />
      </div>

      {/* Financial Details */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-orange-500">Total Amount:</label>
          <input
            type="text"
            value={fee}
            className="w-full border border-gray-300 p-2 rounded-md"
            readOnly
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-2 text-orange-500">Deposit:</label>
          <input
            type="text"
            value={deposit}
            className="w-full border border-gray-300 p-2 rounded-md"
            readOnly
          />
        </div>
      </div>

      {/* Next Payment Date */}
      <div className="mb-6">
        <label className="block mb-2 text-orange-500">
          Next Date of Payment:
        </label>
        <input
          type="text"
          value="__________"
          className="w-full border border-gray-300 p-2 rounded-md"
          readOnly
        />
      </div>

      {/* Payment Method */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <label className="block text-orange-500">Payment Method:</label>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="inline-flex items-center text-orange-500">
            <input
              type="radio"
              name="paymentMethod"
              className="form-radio"
              checked={paymentMethod === "Cash"}
              readOnly
            />
            <span className="ml-2">Cash</span>
          </label>
          <label className="inline-flex items-center text-orange-500">
            <input
              type="radio"
              name="paymentMethod"
              className="form-radio"
              checked={paymentMethod === "UPI"}
              readOnly
            />
            <span className="ml-2">UPI</span>
          </label>
          <label className="inline-flex items-center text-orange-500">
            <input
              type="radio"
              name="paymentMethod"
              className="form-radio"
              checked={paymentMethod === "Credit card"}
              readOnly
            />
            <span className="ml-2">Credit card</span>
          </label>
          <label className="inline-flex items-center text-orange-500">
            <input
              type="radio"
              name="paymentMethod"
              className="form-radio"
              checked={paymentMethod === "Other"}
              readOnly
            />
            <span className="ml-2">Other</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <div className="text-left">
          <p className="border-t border-gray-300 p-2 text-orange-500">
            Pioneer Library
          </p>
        </div>
        <div className="text-right">
          <p className="border-t border-gray-300 p-2 text-orange-500">
            Student's Sign
          </p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-orange-500">
        एकदा भरलेली फी कोणत्याही कारणास्तव परत मिळणार नाही.
      </p>

      <div className="bg-orange-500 text-white text-center mt-6 p-4 rounded-lg">
        <p className="font-bold">
          PIONEER GIRLS HOSTEL | PIONEER BOYS HOSTEL | PIONEER TYPING CENTER
        </p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={printReceipt}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Print Receipt
        </button>
        <button
          onClick={saveAsPdf}
          className="bg-green-500 text-white px-4 py-2 rounded ml-4"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
};

export default Receipt;
