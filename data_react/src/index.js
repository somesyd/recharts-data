import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {ResponsiveContainer, LineChart, Label, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import App from './App';
import * as serviceWorker from './serviceWorker';
import FLASK_SERVICE from "./config";


const Chart = () => {
    const [chartState, setChartState] = useState(0);

    useEffect(() => {
        fetch( FLASK_SERVICE )
            .then((response) => response.json())
            .then((responseArr) => createDateLabels(responseArr))
            .then((responseData) => {
                setChartState({data: responseData})
            })
    }, []);

    const addBestFitLine = () => {
        console.log(FLASK_SERVICE);
        fetch(FLASK_SERVICE + '/best-fit')
                .then(response => response.json())
                .then((responseArr) => createDateLabels(responseArr))
                .then((responseData) => {
                    setChartState({data: responseData})
                })
    };
        return (
            <React.Fragment>
                <ResponsiveContainer height={500} width="100%">
                    <LineChart data={chartState.data} margin={{top:20, right:30, left:20, bottom:20}}>
                        <XAxis dataKey="date_label"  interval={95} textanchor="end" tick={{fontsize:'10px', width:'50px'}}>
                            <Label value="Date/Time" position="bottom"/>
                        </XAxis>
                        <YAxis type="number" domain={[100, 2500]} dataKey="electricity">
                            <Label value="Electricity Usage" position="left" angle={-90}/>
                        </YAxis>
                        <Line type="monotone" dot={false} dataKey="electricity" stroke="#8884d8" />
                        <Line type="monotone" dot={false} dataKey="best_fit" stroke="red" />
                        <CartesianGrid vertical={false}/>
                        <Tooltip/>
                    </LineChart>
                </ResponsiveContainer>
                <BestFitButton onAddBestFitLine={addBestFitLine}/>
            </React.Fragment>
        );
};



const BestFitButton = (props) => {
    const handleBestFit = event => {
        event.preventDefault();
        props.onAddBestFitLine();
    };
    return (
        <button onClick={handleBestFit}>Best Fit</button>
    );
};


const createDateLabels = (data) => {
    let currentDate = 0;
    for (const index in data) {
        if (data[index].hasOwnProperty('simple_date')) {
            let [date, time, meridiem] = data[index].simple_date.split(' ');
            if (date === currentDate) {
                data[index].date_label = time + ' ' + meridiem;
            } else {
                data[index].date_label = date;
                currentDate = date;
            }
        }
    }
    return data;
};

function ChartDisplay() {
    return(
            <Chart/>
    );
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);

export {ChartDisplay as default};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
