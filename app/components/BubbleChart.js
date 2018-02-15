import React from 'util/safe-react';
import ReactBubbleChart from 'components/bubblev3/ReactBubbleChart'
// import ReactBubbleChart from 'react-bubble-chart';
// import ReactBubbleChart from 'components/bubblev4/ReactBubbleChart';
//     "d3": "^4.12.2",
//     "d3-interpolate": "^1.1.6",

var colorLegend = [
    //reds from dark to light
    {
        color: '#67000d',
        text: 'Negative',
        textColor: '#ffffff',
    },
    '#a50f15',
    '#cb181d',
    '#ef3b2c',
    '#fb6a4a',
    '#fc9272',
    '#fcbba1',
    '#fee0d2',
    //neutral grey
    {
        color: '#f0f0f0',
        text: 'Neutral',
    },
    // blues from light to dark
    '#deebf7',
    '#c6dbef',
    '#9ecae1',
    '#6baed6',
    '#4292c6',
    '#2171b5',
    '#08519c',
    {
        color: '#08306b',
        text: 'Positive',
        textColor: '#ffffff',
    },
]

var tooltipProps = [
    {
        css: 'symbol',
        prop: '_id',
        display: 'Word',
    }, {
        css: 'sentiment',
        prop: 'sentiment',
        display: 'Sentiment',
    }, {
        css: 'value',
        prop: 'value',
        display: 'Total found',
    }]

// var sentimentMap = {
//     "Terrible!":-0.50000000001,
//     "Sucks":-0.40000000001,
//     "Bad":-0.30000000001,
//     "Not Good":-0.20000000001,
//     "Eh":-0.10000000001,
//     "Neutral":0.00000000001,
//     "OK":0.10000000001,
//     "Good":0.20000000001,
//     "Like It":0.30000000001,
//     "Loved It":0.40000000001,
//     "Awesome!":0.50000000001,
//     "Unknown":0.60000000001
// }

var sentimentMapReverse = {
    '-5': 'Terrible!',
    '-4': 'Sucks',
    '-3': 'Bad',
    '-2': 'Not Good',
    '-1': 'Eh',
    '0': 'Neutral',
    '1': 'OK',
    '2': 'Good',
    '3': 'Like It',
    '4': 'Loved It',
    '5': 'Awesome!',
    '6': 'Unknown',
}

var sentimentMapInverse = {
    '-5': -0.50000000001,
    '-4': -0.40000000001,
    '-3': -0.30000000001,
    '-2': -0.20000000001,
    '-1': -0.10000000001,
    '0': 0.00000000001,
    '1': 0.10000000001,
    '2': 0.20000000001,
    '3': 0.30000000001,
    '4': 0.40000000001,
    '5': 0.50000000001,
    '6': 0.60000000001,
}

class BubbleChart extends React.Component {
    render () {
        var data = this.props.data.map(d => ({
            _id: d._id,
            display: d._id,
            value: d.value,
            colorValue: sentimentMapInverse[d.sentiment],
            selected: d.selected,
            sentiment: sentimentMapReverse[d.sentiment],
        }))
        
        // console.log('BubbleChart, =>> ', data)
        
        return (<ReactBubbleChart
                className="comentarismo-bubble-chart"
                colorLegend={colorLegend}
                data={data}
                selectedColor="#737373"
                selectedTextColor="#d9d9d9"
                fixedDomain={{min: -0.5, max: 0.6}}
                legend={true}
                legendSpacing={5}
                tooltip={true}
                tooltipProps={tooltipProps}
                delay={10}
                mediumDiameter={100}
            />)
    }
}

module.exports = BubbleChart