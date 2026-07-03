import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

function Result() {
  const location = useLocation();
  const companies = location.state?.companies || [];

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ companies })
      })
        .then(res => res.json())
        .then(res => {
          setData(res);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, [companies]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>⏳ Loading...</h2>;
  }

  return (
    <div className="result">
      <h1>📊 Live Stock Dashboard</h1>

      {Object.keys(data).map(company => {
        if (!data[company] || !data[company].prices) return null;

        const prices = data[company].prices;
        const latest = data[company].latest_price;
        const predicted = data[company].predicted_price;

        const fullData = [...prices.slice(-10), predicted];

        // 🔥 SIGNAL LOGIC
        let signal = "HOLD";
        if (predicted > latest) signal = "BUY";
        else if (predicted < latest) signal = "SELL";

        const chartData = {
          labels: fullData.map((_, i) => `T${i + 1}`),
          datasets: [
            {
              label: `${company} Trend`,
              data: fullData,
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 3,
              borderColor: "#00ffcc",
              backgroundColor: "rgba(0,255,204,0.2)"
            }
          ]
        };

        const options = {
          responsive: true,
          animation: {
            duration: 1000
          },
          plugins: {
            legend: {
              labels: { color: "white" }
            }
          },
          scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } }
          }
        };

        return (
          <div className="card fade-in" key={company}>
            <h2>{company}</h2>

            <div className="values">
              <p>💰 Latest: {latest}</p>
              <p>🔮 Predicted: {predicted}</p>

              {/* 🔥 SIGNAL DISPLAY */}
              <p className={`signal ${signal.toLowerCase()}`}>
                {signal === "BUY" && "📈 BUY SIGNAL"}
                {signal === "SELL" && "📉 SELL SIGNAL"}
                {signal === "HOLD" && "⏸ HOLD"}
              </p>
            </div>

            <Line data={chartData} options={options} />
          </div>
        );
      })}
    </div>
  );
}

export default Result;