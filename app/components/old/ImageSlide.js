import React, { Component, PropTypes } from 'react'
import {XDiv} from 'components/XDiv';

import { Popover,Image } from 'react-bootstrap';

var Drift;

import $ from "jquery";


var ImageSlide = React.createClass({
    render: function () {
        let { image } = this.props;

        return (
            <div>

                <div className="row col-xs-12 col-md-12" style={{ height: 50 }}>
                    <Popover
                        id="popover-basic"
                        placement="top"
                    >
                        <div dangerouslySetInnerHTML={{__html:image.title}}></div>
                    </Popover>
                </div>

                <div className="row col-xs-12 col-md-12">
                    <MyImgZoom img={image.gimage} imgzoom={image.image} width="400" height="250" zoomWidth="500"/>
                </div>


            </div>
        )
    }
});


class MyImgZoom extends Component {

    render() {

        if (typeof window !== 'undefined') {
            $(function () {

                if (!Drift) {
                    Drift = require("drift-zoom");
                }
                new Drift(document.getElementById('imgZoom'), {
                    paneContainer: document.getElementById('mycontainer'),
                    inlinePane: 900,
                    inlineOffsetY: -85,
                    containInline: true

                });
            });
        }
        return <div>
            <img id="imgZoom" className="imgZoom img-responsive" src={this.props.img} data-zoom={this.props.imgzoom}/>
            <div id="mycontainer" className="mycontainer"></div>
        </div>
    }
}

export { ImageSlide }
