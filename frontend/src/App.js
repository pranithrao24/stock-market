import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Result from "./Result";
import Select from "react-select";
import "./App.css";

const options = [
  { value: "AAPL", label: "Apple" },
  { value: "TSLA", label: "Tesla" },
  { value: "GOOGL", label: "Google" },
  { value: "MSFT", label: "Microsoft" },
  { value: "INFY", label: "Infosys" },
  { value: "TCS", label: "TCS" }
];

function Home() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  const handlePredict = () => {
    const companies = selected.map(item => item.value);

    if (companies.length === 0) {
      alert("Select at least one company");
      return;
    }

    navigate("/result", { state: { companies } });
  };

  return (
    <div className="home">
      <h1>📈 Stock Prediction Dashboard</h1>

      {/* 🔥 UPDATED SELECT COMPONENT */}
      <Select
        options={options}
        isMulti
        onChange={setSelected}
        placeholder="Select companies..."
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "white",
            color: "black"
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "white",
            color: "black"
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#ddd" : "white",
            color: "black"
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#ff7b00"
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white"
          })
        }}
      />

      <button onClick={handlePredict}>Predict</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;