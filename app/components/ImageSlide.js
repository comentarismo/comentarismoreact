import React, { Component } from 'util/safe-react';
var createReactClass = require('create-react-class');

import { Popover } from 'react-bootstrap'
import {
    Card,
    CardMedia,
} from 'material-ui/Card'

var Drift

import $ from 'jquery'
import Helmet from 'react-helmet'

var ImageSlide = createReactClass({
    render: function () {
        let {image} = this.props
        
        return (
            <Card>
                <div className="row col-xs-12 col-md-12" style={{height: 50}}>
                    <Popover
                        id="popover-basic"
                        placement="top"
                    >
                        <a href={image.link} target="_blank">
                            <div
                                dangerouslySetInnerHTML={{__html: image.title}}/>
                        </a>
                    </Popover>
                </div>
                <CardMedia
                >
                    <MyImgZoom img={image.gimage} imgzoom={image.image}
                               width="400" height="250" zoomWidth="500"/>
                </CardMedia>
            </Card>
        )
    },
})

class MyImgZoom extends Component {
    
    componentDidMount () {
        if (typeof window !== 'undefined') {
            $(function () {
                if (!Drift) {
                    Drift = require('drift-zoom')
                }
                new Drift(document.getElementById('imgZoom'), {
                    paneContainer: document.getElementById('mycontainer'),
                    inlinePane: 900,
                    inlineOffsetY: -85,
                    containInline: true,
                })
            })
        }
    }
    
    render () {
        
        return <Card>
            <Helmet
                    link={[
                        {
                            'rel': 'stylesheet',
                            'href': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
                        },
                        {
                            'rel': 'stylesheet',
                            'href': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css',
                        },
                        {
                            'rel': 'stylesheet',
                            'href': 'https://use.fontawesome.com/releases/v5.0.6/css/all.css',
                        },
                    
                    ]}
                />
            <img id="imgZoom" className="imgZoom img-responsive"
                 src={this.props.img} data-zoom={this.props.imgzoom}/>
            <div id="mycontainer" className="mycontainer"></div>
        </Card>
    }
}

export { ImageSlide }
