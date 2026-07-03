from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # ✅ Validate input
    if not data or 'companies' not in data:
        return jsonify({"error": "No companies provided"}), 400

    companies = data.get('companies', [])
    result = {}

    for company in companies:
        company = company.strip().upper()

        try:
            # 🔹 Fetch real-time stock data
            stock = yf.Ticker(company)
            hist = stock.history(period="1mo")

            # ❗ If no data found
            if hist.empty:
                result[company] = {"error": "Invalid company or no data found"}
                continue

            prices = hist['Close'].values

            # ❗ Ensure enough data
            if len(prices) < 2:
                result[company] = {"error": "Not enough data"}
                continue

            # 🔹 Prepare ML model
            X = np.arange(len(prices)).reshape(-1, 1)
            y = prices

            model = LinearRegression()
            model.fit(X, y)

            # 🔹 Predict next day price
            next_day = np.array([[len(prices)]])
            predicted_price = model.predict(next_day)[0]

            # ✅ Send response (important for graph)
            result[company] = {
                "latest_price": float(prices[-1]),
                "predicted_price": float(predicted_price),
                "prices": prices.tolist()
            }

        except Exception as e:
            result[company] = {"error": str(e)}

    return jsonify(result)


# ✅ Run server
if __name__ == "__main__":
    app.run(debug=True)