from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

from model import build_prediction_model


app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "message": "StockVision backend is running",
            "status": "success",
        }
    )


@app.route("/predict", methods=["GET"])
def predict():
    try:
        company = request.args.get("company", "").strip().upper()

        if not company:
            return jsonify(
                {"error": "Company symbol is required."}
            ), 400

        stock = yf.Ticker(company)

        recent_history = stock.history(period="7d")
        training_history = stock.history(period="1y")

        if recent_history.empty:
            return jsonify(
                {
                    "error": (
                        "No recent data found. "
                        "Please check the stock symbol."
                    )
                }
            ), 404

        if training_history.empty:
            return jsonify(
                {
                    "error": (
                        "Not enough historical data was found "
                        "for prediction."
                    )
                }
            ), 404

        prices = [
            round(float(price), 2)
            for price in recent_history["Close"].tolist()
        ]

        dates = recent_history.index.strftime(
            "%Y-%m-%d"
        ).tolist()

        latest_price = prices[-1]

        prediction_result = build_prediction_model(
            training_history,
            forecast_days=7
        )

        response = {
            "company": company,
            "price": latest_price,
            "prices": prices,
            "dates": dates,
            "predicted_price": prediction_result[
                "predicted_price"
            ],
            "forecast_prices": prediction_result[
                "forecast_prices"
            ],
            "forecast_dates": prediction_result[
                "forecast_dates"
            ],
            "recommendation": prediction_result[
                "recommendation"
            ],
            "confidence": prediction_result["confidence"],
            "metrics": prediction_result["metrics"],
        }

        return jsonify(response)

    except Exception as error:
        print("Prediction error:", error)

        return jsonify(
            {
                "error": (
                    "Unable to process stock prediction. "
                    f"{str(error)}"
                )
            }
        ), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False,
    )