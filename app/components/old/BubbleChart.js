import React            from 'react';
import ReactBubbleChart from 'react-bubble-chart';

var colorLegend = [
    //reds from dark to light
    {color: "#67000d", text: 'Negative', textColor: "#ffffff"}, "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
    //neutral grey
    {color: "#f0f0f0", text: 'Neutral'},
    // blues from light to dark
    "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", {color: "#08306b", text: 'Positive', textColor: "#ffffff"}
];

var tooltipProps = [{
    css: 'symbol',
    prop: '_id'
}, {
    css: 'value',
    prop: 'value',
    display: 'Last Value'
}, {
    css: 'change',
    prop: 'colorValue',
    display: 'Change'
}];

var sentimentMap = {
    "Terrible!":-0.50000000001,
    "Sucks":-0.40000000001,
    "Bad":-0.30000000001,
    "Not Good":-0.20000000001,
    "Eh":-0.10000000001,
    "Neutral":0.00000000001,
    "OK":0.10000000001,
    "Good":0.20000000001,
    "Like It":0.30000000001,
    "Loved It":0.40000000001,
    "Awesome!":0.50000000001,
    "Unknown":0.60000000001
}

var sentimentMapInverse = {
    "-5!":-0.50000000001,
    "-4":-0.40000000001,
    "-3":-0.30000000001,
    "-2":-0.20000000001,
    "-1":-0.10000000001,
    "0":0.00000000001,
    "1":0.10000000001,
    "2":0.20000000001,
    "3":0.30000000001,
    "4":0.40000000001,
    "5":0.50000000001,
    "6":0.60000000001
}

class BubbleChart extends React.Component {
    render () {
        var data = this.props.data.map(d => ({
            _id: d._id,
            value: d.value,
            colorValue: sentimentMapInverse[d.sentiment],
            selected: d.selected
        }));

        return <ReactBubbleChart
            className="comentarismo-bubble-chart col-lg-12"
            colorLegend={colorLegend}
            data={data}
            selectedColor="#737373"
            selectedTextColor="#d9d9d9"
            fixedDomain={{min: -0.5, max: 0.6}}
            legend={true}
            legendSpacing={10}
            tooltip={true}
            tooltipProps={tooltipProps}
            delay={50}
            mediumDiameter={20}
        />;
    }
}

module.exports = BubbleChart;