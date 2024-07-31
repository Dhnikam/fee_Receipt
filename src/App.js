import React from "react";
import AdmissionForm from "./AdmissionForm";

const App = () => {
  const roomId = "A"; // Example value for roomId
  const deskNumber = "101"; // Example value for deskNumber

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">Admission Form</h1>
      <AdmissionForm roomId={roomId} deskNumber={deskNumber} />
    </div>
  );
};

export default App;
