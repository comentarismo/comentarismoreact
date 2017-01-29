import React, {Component, PropTypes} from 'react'
import {XDiv} from 'components/XDiv';

import {Popover, Image} from 'react-bootstrap';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

var Drift;

import $ from "jquery";


var ImageSlide = React.createClass({
    render: function () {
        let {image} = this.props;

        return (
            <Card>
                <div className="row col-xs-12 col-md-12" style={{height: 50}}>
                    <Popover
                        id="popover-basic"
                        placement="top"
                    >
                        <div dangerouslySetInnerHTML={{__html: image.title}}></div>
                    </Popover>
                </div>

                <CardMedia

                >
                    <MyImgZoom img={image.gimage} imgzoom={image.image} width="400" height="250" zoomWidth="500"/>
                </CardMedia>

            </Card>
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
        return <Card>
            <img id="imgZoom" className="imgZoom img-responsive" src={this.props.img} data-zoom={this.props.imgzoom}/>
            <div id="mycontainer" className="mycontainer"></div>
        </Card>
    }
}

export {ImageSlide}
