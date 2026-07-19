# 📈 StockVision – AI-Powered Stock Market Price Prediction

![Python](https://img.shields.io/badge/Python-3.10-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Flask](https://img.shields.io/badge/Flask-3.1-black)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

StockVision is a Full-Stack Machine Learning web application that predicts stock prices using historical market data. The application provides interactive stock analysis, real-time market visualization, future price forecasting, and investment recommendations through an intuitive dashboard.

---

## 🚀 Live Demo

### Frontend
[> *(Add your frontend deployment link here)*](https://stockvision-8b0r.onrender.com)

### Backend API
https://stock-market-ywnw.onrender.com

---

# 📖 Project Overview

The application allows users to:

- 📈 Analyze historical stock prices
- 🤖 Predict future stock prices using Machine Learning
- 📊 Visualize stock trends using interactive charts
- 📅 Generate a 7-day stock price forecast
- 💹 Receive Buy / Hold / Sell recommendations
- 📉 View model evaluation metrics
- 🌐 Fetch live stock market data using Yahoo Finance

---

# ✨ Features

- Real-Time Stock Data
- Machine Learning Prediction
- Historical Price Visualization
- 7-Day Future Forecast
- Buy / Hold / Sell Recommendation
- Interactive Dashboard
- Responsive UI
- Multiple Stock Support
- Error Handling
- Fast API Integration

---

# 🛠 Tech Stack

## Frontend

- React.js
- JavaScript
- Axios
- Chart.js
- CSS3

## Backend

- Python
- Flask
- Flask-CORS
- Scikit-Learn
- Pandas
- NumPy
- yFinance

---

# 📂 Project Structure

```
stock-market/
│
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/pranithrao24/stock-market.git
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

python app.py
```

Runs on

```
http://127.0.0.1:5000
```

---

## Frontend

```bash
cd frontend

npm install

npm start
```

Runs on

```
http://localhost:3000
```

---

# 📊 Machine Learning Workflow

```
Historical Stock Data
        │
        ▼
Data Preprocessing
        │
        ▼
Feature Engineering
        │
        ▼
Linear Regression Model
        │
        ▼
Prediction
        │
        ▼
Forecast Generation
        │
        ▼
Visualization
```

---

# 📈 API Endpoint

### Predict Stock

```
GET /predict?company=INFY.NS
```

Example

```
https://stock-market-ywnw.onrender.com/predict?company=INFY.NS
```

---

# 📊 Sample Output

```json
{
  "company": "INFY.NS",
  "price": 1096.50,
  "predicted_price": 1136.33,
  "recommendation": "BUY",
  "confidence": 83.39
}
```

---

# 🎯 Future Enhancements

- LSTM Deep Learning Model
- Multiple Prediction Algorithms
- Portfolio Management
- User Authentication
- Watchlist
- News Sentiment Analysis
- Email Alerts
- Cryptocurrency Prediction
- Candlestick Charts
- Technical Indicators

---

# 👨‍💻 Author

**Pusukuri Pranith Rao**

B.Tech CSE

Vaagdevi College of Engineering

GitHub:
https://github.com/pranithrao24

LinkedIn:
https://www.linkedin.com/in/pranith-rao-1a4460318

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

# 📜 License

This project is developed for educational and learning purposes.
