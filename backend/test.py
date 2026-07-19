import yfinance as yf

stock = yf.Ticker("INFY.NS")

history = stock.history(period="7d")

print(history)
