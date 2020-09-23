import pandas as pd
from statistics import mean
import numpy as np


def get_initial_data():
    col_names = ['zone_date', 'timezone', 'simple_date', 'electricity']
    df = pd.read_csv('data.csv', names=col_names)
    return df.to_json(orient='records')


# return numpy array of values incremented from first date value (date - minimum-date)
# in minutes from first date value
def flatten_dates(date_series):
    min_date = date_series.iloc[0]
    date_series = (date_series - min_date) / pd.Timedelta(minutes=1)
    return date_series.to_numpy()


def get_initial_data_as_df():
    col_names = ['zone_date', 'timezone', 'simple_date', 'electricity']
    df = pd.read_csv('data.csv', names=col_names)
    df = df.iloc[1:]  # remove leftover header row
    # format the columns from strings
    df.zone_date = pd.to_datetime(df.zone_date)
    df.electricity = pd.to_numeric(df.electricity)
    df.electricity = df.electricity.round(2)
    # drop any rows with non-values (NaNs)
    return df.dropna()

def best_fit_slope_and_intercept(xs, ys):
    m = ((mean(xs) * mean(ys)) - mean(xs * ys)) / ((mean(xs) * mean(xs)) - (mean(xs * xs)))
    b = mean(ys) - (m * mean(xs))
    return m, b

def get_regression_line(df):
    # get x values to numpy array
    time = df.zone_date
    # get y values to numpy array
    time_deltas = flatten_dates(time)
    elect_vals = df.electricity.to_numpy()
    # calculate slope and intercept
    m, b = best_fit_slope_and_intercept(time_deltas, elect_vals)
    # print(m, b)
    # apply slope/intercept to x values for regression line
    regression_line = [round((m * x) + b, 2) for x in time_deltas]
    return regression_line


