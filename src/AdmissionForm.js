"use client";
import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Receipt from "./Receipt";
const AdmissionForm = ({ roomId, deskNumber }) => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customPreparingFor, setCustomPreparingFor] = useState("");
  const [customAuthorityPerson, setCustomAuthorityPerson] = useState("");
  const [customFee, setCustomFee] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    aadharNumber: "",
    preparingFor: "",
    gender: "",
    address: "",
    membershipType: "Reserved-Seat", // Set default membership type to "Reserved-Seat"
    room: roomId || "",
    desk: deskNumber || "",
    deposit: "",
    fee: "",
    paymentMethod: "",
    authorityPerson: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      let updatedFormData = { ...prevFormData, [name]: value };

      if (name === "contactNumber") {
        if (!/^\d{10}$/.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            contactNumber: "Contact number should be exactly 10 digits",
          }));
        } else {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.contactNumber;
            return newErrors;
          });
        }
      }
      if (name === "fullName") {
        const capitalizedFullName = value
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        updatedFormData = { ...updatedFormData, [name]: capitalizedFullName };
      }
      if (name === "preparingFor" && value !== "Other") {
        setCustomPreparingFor("");
      }

      return updatedFormData;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number should be exactly 10 digits";
    if (!formData.aadharNumber)
      newErrors.aadharNumber = "Aadhar number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.room) newErrors.room = "Room is required for reserved seat";
    if (!formData.desk) newErrors.desk = "Desk is required for reserved seat";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (formData.preparingFor === "Other" && !customPreparingFor)
      newErrors.customPreparingFor =
        "Please specify what you are preparing for";
    if (formData.authorityPerson === "Other" && !customAuthorityPerson)
      newErrors.customAuthorityPerson = "Please specify authority person";
    return newErrors;
  }, [formData, customPreparingFor, customAuthorityPerson]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post("/api/add-member", {
          ...formData,
          preparingFor:
            formData.preparingFor === "Other"
              ? customPreparingFor
              : formData.preparingFor,
          authorityPerson:
            formData.authorityPerson === "Other"
              ? customAuthorityPerson
              : formData.authorityPerson,
        });
        if (response) {
          toast.success("Admission successful");
          setFormData({
            fullName: "",
            contactNumber: "",
            aadharNumber: "",
            preparingFor: "",
            gender: "",
            address: "",
            membershipType: "Reserved-Seat",
            room: "",
            desk: "",
            deposit: "",
            fee: "",
            paymentMethod: "",
            authorityPerson: "",
          });
          setCustomPreparingFor("");
          setCustomAuthorityPerson("");
          setErrors({});
          setModalOpen(true); // Show the modal on successful submission
        } else {
          toast.error("Admission failed");
        }
      } catch (error) {
        console.error("Error:", error.response);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An error occurred while processing your request");
        }
      }
      setLoading(false);
    },
    [formData, customPreparingFor, customAuthorityPerson, validateForm]
  );
  const renderInput = useCallback(
    (
      id,
      labelname,
      type,
      placeholder,
      name,
      value,
      onChange,
      minLength,
      maxLength
    ) => (
      <div>
        <Label htmlFor={id} labelname={labelname} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          minLength={minLength}
          maxLength={maxLength}
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        />
        {errors[name] && <p className="text-red-500">{errors[name]}</p>}
      </div>
    ),
    [errors]
  );

  const renderSelect = useCallback(
    (id, labelname, name, value, onChange, options) => (
      <div>
        <Label htmlFor={id} labelname={labelname} />
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors[name] && <p className="text-red-500">{errors[name]}</p>}
      </div>
    ),
    [errors]
  );

  const preparingForOptions = useMemo(
    () => [
      { value: "", label: "Select" },
      { value: "CA", label: "CA" },
      { value: "MPSC", label: "MPSC" },
      { value: "UPSC", label: "UPSC" },
      { value: "Banking", label: "Banking" },
      { value: "SSC", label: "SSC" },
      { value: "Railway", label: "Railway" },
      { value: "Law", label: "Law" },
      { value: "Police", label: "Police" },
      { value: "Engineering", label: "Engineering" },
      { value: "Medical", label: "Medical" },
      { value: "Other", label: "Other" },
    ],
    []
  );

  const genderOptions = useMemo(
    () => [
      { value: "", label: "Select Gender" },
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Other", label: "Other" },
    ],
    []
  );

  const roomOptions = useMemo(
    () => [
      { value: "", label: "Select Branch" },
      { value: "A", label: "Pioneer Library" },
      { value: "B", label: "Premium Library" },
      { value: "C", label: "VIP Library" },
      { value: "D", label: "Vignaharta Library" },
      { value: "E", label: "Swami Library" },
    ],
    []
  );

  const authorityOptions = useMemo(
    () => [
      { value: "", label: "Authority Person" },
      { value: "Ram Sir", label: "Ram Sir" },
      { value: "Pandurang Sir", label: "Pandurang Sir" },
      { value: "Dhanashri Madam", label: "Dhanashri Madam" },
      { value: "Other", label: "Other" },
    ],
    []
  );
  const paymentMethodOptions = useMemo(
    () => [
      { value: "", label: "Select Payment Method" },
      { value: "Cash", label: "Cash" },
      { value: "UPI", label: "UPI" },
    ],
    []
  );

  const feeOptions = useMemo(() => [
    { value: "", label: "Select Amount" },
    {
      value: "1300",
      label: "1300",
    },
    { value: "1400", label: "1400" },
    { value: "1500", label: "1500" },
    { value: "1700", label: "1700" },
    { value: "1900", label: "1900" },
    { value: "2000", label: "2000" },
    { value: "2500", label: "2500" },
    { value: "2700", label: "2700" },
    { value: "Other", label: "Other" },
  ]);

  const depositOptions = useMemo(() => [
    { value: "", label: "Select Deposit Amount" },
    { value: "200", label: "200" },
    { value: "unpaid", label: "Unpaid" },
  ]);

  const monthOptions = useMemo(() => [
    { value: "", label: "Select Month" },
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ]);

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-3xl text-center text-gray-800">New Admission</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          {renderSelect(
            "room",
            "Branch ",
            "room",
            formData.room,
            handleChange,
            roomOptions
          )}
          {renderInput(
            "desk",
            "Seat No",
            "text",
            "Seat No",
            "desk",
            formData.desk,
            handleChange
          )}

          {renderInput(
            "fullName",
            "Full Name",
            "text",
            "Full Name",
            "fullName",
            formData.fullName,
            handleChange
          )}
          {renderInput(
            "contactNumber",
            "Whatsapp Number",
            "text",
            "Whatsapp Number",
            "contactNumber",
            formData.contactNumber,
            handleChange,
            "10",
            "10"
          )}
          {renderInput(
            "aadharNumber",
            "Aadhar Number(Optional)",
            "text",
            "Aadhar Number",
            "aadharNumber",
            formData.aadharNumber,
            handleChange,
            "12",
            "12"
          )}

          {renderSelect(
            "preparingFor",
            "Preparing For",
            "preparingFor",
            formData.preparingFor,
            handleChange,
            preparingForOptions
          )}

          {formData.preparingFor === "Other" &&
            renderInput(
              "customPreparingFor",
              "Please Specify Preparing For",
              "text",
              "Please Specify Preparing For",
              "customPreparingFor",
              customPreparingFor,
              (e) => setCustomPreparingFor(e.target.value)
            )}

          {renderSelect(
            "gender",
            "Gender",
            "gender",
            formData.gender,
            handleChange,
            genderOptions
          )}
          {renderInput(
            "address",
            "Address",
            "textarea",
            "Address",
            "address",
            formData.address,
            handleChange
          )}

          {renderSelect(
            "paymentMethod",
            "Payment Method",
            "paymentMethod",
            formData.paymentMethod,
            handleChange,
            paymentMethodOptions
          )}
          {renderSelect(
            "fee",
            "Fee",
            "fee",
            formData.fee,
            handleChange,
            feeOptions
          )}
          {formData.fee === "Other" &&
            renderInput(
              "customFee",
              "Please Specify Fee",
              "text",
              "Please Specify Fee",
              "customFee",
              customFee,
              (e) => setCustomFee(e.target.value)
            )}

          {renderSelect(
            "deposit",
            "Deposit",
            "deposit",
            formData.deposit,
            handleChange,
            depositOptions
          )}

          {renderSelect(
            "month",
            "Month",
            "month",
            formData.month,
            handleChange,
            monthOptions
          )}

          {renderSelect(
            "authorityPerson",

            "Authority Person",
            "authorityPerson",
            formData.authorityPerson,
            handleChange,
            authorityOptions
          )}
          {formData.authorityPerson === "Other" &&
            renderInput(
              "customPreparingFor",
              "Please Specify Authority Person",
              "text",
              "Please Specify Authority Person",
              "customAuthorityPerson",
              customAuthorityPerson,
              (e) => setCustomAuthorityPerson(e.target.value)
            )}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-gray-600"
            onClick={() => setModalOpen(true)}
          >
            Submit
          </button>
        </div>
      </form>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-11/12 md:w-1/2">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <Receipt formData={formData} />
          </div>
        </div>
      )}
    </section>
  );
};

const Label = ({ htmlFor, labelname }) => (
  <label className="text-gray-700" htmlFor={htmlFor}>
    {labelname}
  </label>
);

export default AdmissionForm;
