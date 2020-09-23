from flask import Flask
from flask_cors import CORS
from analyze import *


app = Flask(__name__)
CORS(app)


@app.route('/')
def get_initial_data():
    df = get_initial_data_as_df()
    return df.to_json(orient='records')
    # return { 'data': [{'name': 'Page A', 'uv': 400, 'pv': 2400, 'amt': 2400},
    #                   {'name': 'Page B', 'uv': 500, 'pv': 2600, 'amt': 2700},
    #                   {'name': 'Page C', 'uv': 600, 'pv': 2200, 'amt': 2500},
    #                   {'name': 'Page D', 'uv': 500, 'pv': 2400, 'amt': 2400},
    #                   {'name': 'Page E', 'uv': 400, 'pv': 2700, 'amt': 2600}]}


@app.route('/best-fit')
def get_best_fit():
    df = get_initial_data_as_df()
    best_fit_line = get_regression_line(df)
    df['best_fit'] = best_fit_line
    return df.to_json(orient='records')


if __name__ == '__main__':
    app.run()
