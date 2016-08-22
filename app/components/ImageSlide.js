import React from 'react';
import {XDiv} from 'components/XDiv';

import { Popover,Image } from 'react-bootstrap';


var ImageSlide = React.createClass({
    render: function () {
        let { image } = this.props;

        return (
            <div>

                <div  className="row col-xs-12 col-md-12" style={{ height: 50 }}>
                    <Popover
                        id="popover-basic"
                        placement="top"
                    >
                        <div dangerouslySetInnerHTML={{__html:image.title}}></div>
                    </Popover>
                </div>

                <div className="row col-xs-12 col-md-12">
                    <Image src={image.gimage} thumbnail />

                </div>


            </div>
        )
    }
});

export { ImageSlide }
