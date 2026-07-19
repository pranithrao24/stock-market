from datetime import timedelta

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def prepare_stock_data(history):
    dataframe = history.reset_index().copy()

    if "Date" not in dataframe.columns:
        raise ValueError("Date column is missing from stock data.")

    dataframe["Date"] = pd.to_datetime(dataframe["Date"])
    dataframe["Close"] = pd.to_numeric(
        dataframe["Close"],
        errors="coerce"
    )

    dataframe = dataframe.dropna(subset=["Date", "Close"])
    dataframe = dataframe.sort_values("Date")
    dataframe = dataframe.reset_index(drop=True)

    if len(dataframe) < 30:
        raise ValueError("Not enough historical data for prediction.")

    dataframe["Days"] = np.arange(len(dataframe))

    return dataframe


def build_prediction_model(history, forecast_days=7):
    dataframe = prepare_stock_data(history)

    features = dataframe[["Days"]]
    target = dataframe["Close"]

    split_index = int(len(dataframe) * 0.8)

    x_train = features.iloc[:split_index]
    x_test = features.iloc[split_index:]

    y_train = target.iloc[:split_index]
    y_test = target.iloc[split_index:]

    evaluation_model = LinearRegression()
    evaluation_model.fit(x_train, y_train)

    test_predictions = evaluation_model.predict(x_test)

    mae = mean_absolute_error(y_test, test_predictions)
    rmse = np.sqrt(mean_squared_error(y_test, test_predictions))
    r2 = r2_score(y_test, test_predictions)

    final_model = LinearRegression()
    final_model.fit(features, target)

    last_index = int(dataframe["Days"].iloc[-1])
    last_date = dataframe["Date"].iloc[-1]

    future_indices = np.arange(
        last_index + 1,
        last_index + forecast_days + 1
    )

    future_features = pd.DataFrame(
        {"Days": future_indices}
    )

    future_predictions = final_model.predict(future_features)

    forecast_dates = []
    current_date = last_date

    while len(forecast_dates) < forecast_days:
        current_date += timedelta(days=1)

        if current_date.weekday() < 5:
            forecast_dates.append(current_date.strftime("%Y-%m-%d"))

    predicted_prices = [
        round(max(float(price), 0), 2)
        for price in future_predictions
    ]

    latest_price = float(dataframe["Close"].iloc[-1])
    next_day_price = predicted_prices[0]

    percentage_difference = (
        ((next_day_price - latest_price) / latest_price) * 100
        if latest_price != 0
        else 0
    )

    if percentage_difference >= 1:
        recommendation = "BUY"
    elif percentage_difference <= -1:
        recommendation = "SELL"
    else:
        recommendation = "HOLD"

    confidence = max(
        50,
        min(95, 100 - abs(float(mae) / latest_price * 100))
    )

    return {
        "predicted_price": round(next_day_price, 2),
        "forecast_prices": predicted_prices,
        "forecast_dates": forecast_dates,
        "recommendation": recommendation,
        "confidence": round(confidence, 2),
        "metrics": {
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2),
            "r2": round(float(r2), 4),
        },
    }