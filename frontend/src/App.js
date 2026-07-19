import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const popularStocks = [
  { name: "Infosys", symbol: "INFY.NS" },
  { name: "Reliance", symbol: "RELIANCE.NS" },
  { name: "TCS", symbol: "TCS.NS" },
  { name: "Apple", symbol: "AAPL" },
  { name: "Tesla", symbol: "TSLA" },
  { name: "Microsoft", symbol: "MSFT" },
];

function App() {
  const [company, setCompany] = useState("INFY.NS");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrencySymbol = (symbol) => {
    return symbol?.endsWith(".NS") ? "₹" : "$";
  };

  const getPrediction = async () => {
    const symbol = company.trim().toUpperCase();

    if (!symbol) {
      setError("Please enter a valid stock symbol.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/predict`, {
        params: {
          company: symbol,
        },
      });

      setStockData(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          "Unable to fetch stock data. Make sure the Flask server is running."
      );

      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  getPrediction();
  // Run only once when the application opens
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    getPrediction();
  };

  const selectStock = async (symbol) => {
  setCompany(symbol);
  setError("");

  try {
    setLoading(true);

    const response = await axios.get(`${API_URL}/predict`, {
      params: {
        company: symbol,
      },
    });

    setStockData(response.data);
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Unable to fetch stock data. Make sure the Flask server is running."
    );

    setStockData(null);
  } finally {
    setLoading(false);
  }
};

  const statistics = useMemo(() => {
    if (!stockData?.prices?.length) {
      return null;
    }

    const firstPrice = Number(stockData.prices[0]);
    const latestPrice = Number(stockData.price);
    const highestPrice = Math.max(...stockData.prices);
    const lowestPrice = Math.min(...stockData.prices);
    const change = latestPrice - firstPrice;

    const percentageChange =
      firstPrice !== 0 ? (change / firstPrice) * 100 : 0;

    return {
      firstPrice,
      latestPrice,
      highestPrice,
      lowestPrice,
      change,
      percentageChange,
    };
  }, [stockData]);

  const historicalChartData = useMemo(() => {
    if (!stockData?.prices?.length) {
      return null;
    }

    const positive = statistics?.change >= 0;

    return {
      labels: stockData.dates,
      datasets: [
        {
          label: "Historical closing price",
          data: stockData.prices,
          borderColor: positive ? "#10b981" : "#ef4444",
          backgroundColor: positive
            ? "rgba(16, 185, 129, 0.12)"
            : "rgba(239, 68, 68, 0.12)",
          pointBackgroundColor: positive ? "#10b981" : "#ef4444",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          borderWidth: 3,
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [stockData, statistics]);

  const forecastChartData = useMemo(() => {
    if (!stockData?.forecast_prices?.length) {
      return null;
    }

    return {
      labels: stockData.forecast_dates,
      datasets: [
        {
          label: "Predicted closing price",
          data: stockData.forecast_prices,
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.12)",
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          borderWidth: 3,
          borderDash: [7, 5],
          tension: 0.35,
          fill: true,
        },
      ],
    };
  }, [stockData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#cbd5e1",
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
        },
      },
      y: {
        grid: {
          color: "rgba(148, 163, 184, 0.18)",
        },
        ticks: {
          color: "#64748b",
        },
      },
    },
  };

  const currency = getCurrencySymbol(stockData?.company || company);

  const recommendationClass = stockData?.recommendation
    ? stockData.recommendation.toLowerCase()
    : "";

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">SV</div>

          <div>
            <h1>StockVision</h1>
            <p>AI-Powered Market Intelligence</p>
          </div>
        </div>

        <div className="market-status">
          <span className="status-dot"></span>
          Live market data
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-section">
          <div className="hero-content">
            <span className="eyebrow">STOCK MARKET FORECASTING</span>

            <h2>Analyse trends and forecast future stock prices</h2>

            <p>
              View recent market performance, machine-learning forecasts,
              recommendation signals and model evaluation metrics.
            </p>
          </div>
        </section>

        <section className="search-card">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="input-group">
              <label htmlFor="company">Stock symbol</label>

              <div className="input-wrapper">
                <span className="search-icon">⌕</span>

                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="Example: INFY.NS, TCS.NS, AAPL"
                />
              </div>
            </div>

            <button
              type="submit"
              className="analyse-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Predicting
                </>
              ) : (
                <>
                  Analyse Stock
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="popular-stocks">
            <span>Popular:</span>

            {popularStocks.map((stock) => (
              <button
                key={stock.symbol}
                type="button"
                className={
                  company.toUpperCase() === stock.symbol
                    ? "stock-chip active"
                    : "stock-chip"
                }
                onClick={() => selectStock(stock.symbol)}
              >
                {stock.name}
              </button>
            ))}
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              <p>{error}</p>
            </div>
          )}
        </section>

        {!stockData && !loading && (
          <section className="empty-state">
            <div className="empty-icon">↗</div>
            <h3>Start stock analysis</h3>
            <p>
              Choose a company or enter a Yahoo Finance stock symbol.
            </p>
          </section>
        )}

        {stockData && statistics && (
          <>
            <section className="stock-header-card">
              <div>
                <p className="section-label">SELECTED STOCK</p>
                <h3>{stockData.company}</h3>
                <span>Latest available closing price</span>
              </div>

              <div className="current-price">
                <p>
                  {currency}
                  {Number(stockData.price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <span
                  className={
                    statistics.change >= 0
                      ? "price-change positive"
                      : "price-change negative"
                  }
                >
                  {statistics.change >= 0 ? "▲" : "▼"}{" "}
                  {Math.abs(statistics.percentageChange).toFixed(2)}%
                </span>
              </div>
            </section>

            <section className="stats-grid">
              <article className="stat-card">
                <div className="stat-icon opening-icon">O</div>
                <div>
                  <span>Period opening</span>
                  <strong>
                    {currency}
                    {statistics.firstPrice.toFixed(2)}
                  </strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-icon high-icon">H</div>
                <div>
                  <span>7-day high</span>
                  <strong>
                    {currency}
                    {statistics.highestPrice.toFixed(2)}
                  </strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-icon low-icon">L</div>
                <div>
                  <span>7-day low</span>
                  <strong>
                    {currency}
                    {statistics.lowestPrice.toFixed(2)}
                  </strong>
                </div>
              </article>

              <article className="stat-card">
                <div className="stat-icon trend-icon">%</div>
                <div>
                  <span>Period change</span>
                  <strong
                    className={
                      statistics.change >= 0
                        ? "positive-text"
                        : "negative-text"
                    }
                  >
                    {statistics.change >= 0 ? "+" : ""}
                    {currency}
                    {statistics.change.toFixed(2)}
                  </strong>
                </div>
              </article>
            </section>

            <section className="prediction-grid">
              <article className="prediction-card main-prediction">
                <span>Next trading-day prediction</span>

                <strong>
                  {currency}
                  {Number(stockData.predicted_price).toFixed(2)}
                </strong>

                <p>
                  Generated using one year of historical closing-price data.
                </p>
              </article>

              <article className="prediction-card">
                <span>Recommendation</span>

                <strong
                  className={`recommendation ${recommendationClass}`}
                >
                  {stockData.recommendation}
                </strong>

                <p>Based on predicted movement from the latest price.</p>
              </article>

              <article className="prediction-card">
                <span>Model confidence</span>

                <strong>{Number(stockData.confidence).toFixed(2)}%</strong>

                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${Math.min(
                        Number(stockData.confidence),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </article>
            </section>

            <section className="metrics-grid">
              <article className="metric-card">
                <span>MAE</span>
                <strong>{Number(stockData.metrics.mae).toFixed(2)}</strong>
                <p>Average absolute prediction error</p>
              </article>

              <article className="metric-card">
                <span>RMSE</span>
                <strong>{Number(stockData.metrics.rmse).toFixed(2)}</strong>
                <p>Prediction error with larger errors penalized</p>
              </article>

              <article className="metric-card">
                <span>R² score</span>
                <strong>{Number(stockData.metrics.r2).toFixed(4)}</strong>
                <p>
                  Values nearer to 1 indicate better model performance
                </p>
              </article>
            </section>

            <section className="chart-card">
              <div className="chart-card-header">
                <div>
                  <p className="section-label">PRICE HISTORY</p>
                  <h3>Seven-day historical trend</h3>
                </div>

                <span className="chart-period">
                  Last 7 trading days
                </span>
              </div>

              <div className="chart-container">
                <Line
                  data={historicalChartData}
                  options={chartOptions}
                />
              </div>
            </section>

            <section className="chart-card">
              <div className="chart-card-header">
                <div>
                  <p className="section-label">ML FORECAST</p>
                  <h3>Seven-day future price forecast</h3>
                </div>

                <span className="chart-period">
                  Next 7 trading days
                </span>
              </div>

              <div className="chart-container">
                <Line
                  data={forecastChartData}
                  options={chartOptions}
                />
              </div>
            </section>

            <section className="forecast-table-card">
              <div className="chart-card-header">
                <div>
                  <p className="section-label">FORECAST DETAILS</p>
                  <h3>Predicted closing prices</h3>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Trading day</th>
                      <th>Date</th>
                      <th>Predicted price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stockData.forecast_dates.map((date, index) => (
                      <tr key={date}>
                        <td>Day {index + 1}</td>
                        <td>{date}</td>
                        <td>
                          {currency}
                          {Number(
                            stockData.forecast_prices[index]
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="disclaimer">
              <strong>Disclaimer:</strong> Predictions are generated using
              historical data and Linear Regression. Stock markets are
              unpredictable, and these results are intended only for
              educational purposes.
            </section>
          </>
        )}
      </main>

      <footer>
        <p>© 2026 StockVision — Stock Market Price Prediction</p>
      </footer>
    </div>
  );
}

export default App;