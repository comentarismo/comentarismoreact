import React from 'react'

var createReactClass = require('create-react-class')

import { XDiv } from 'components/XDiv'
import { ShareNetworks } from 'components/ShareNetworks'
import Date from 'components/Date'
import Icon from 'components/Icon'
import Sentiment from 'components/Sentiment'
import Like from 'components/Like'
import DisLike from 'components/DisLike'

//import config from 'config'
//var host = config.BASE_URL;
import {
    ButtonGroup,
    ButtonToolbar,
    Button,
    Alert,
    Panel,
    Label,
    ListGroup,
    ListGroupItem,
} from 'react-bootstrap'

var CommentSlide = createReactClass({
    render: function () {
        let {comment} = this.props
        
        if (!comment) {
            comment = {}
        }
        
        const currentSlideLike = <Like id={comment.id}/>
        const currentSlideDisLike = <DisLike id={comment.id}/>
        
        return (
            <div>
                
                <ListGroup>
                    <ListGroupItem>
                        <ButtonToolbar>
                            <ButtonGroup bsSize="large">
                                <Icon nick={comment.nick} size={35}/>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Label
                                    bsStyle="default">@<span dangerouslySetInnerHTML={{__html:comment.nick}}/></Label>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Sentiment sentiment={comment.sentiment}/>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </ListGroupItem>
                    <ListGroupItem>
                        <a href={`/news/${comment.titleurlize}`}
                           target="_blank">
                            <Label bsStyle="info"><b><span dangerouslySetInnerHTML={{__html:comment.title}}/></b></Label>
                            <Label bsStyle="warning"><Date
                                date={comment.date}/></Label>
                        </a>
                    </ListGroupItem>
                </ListGroup>
                
                <XDiv text={'<b>' + comment.comment + '</b>'}/>
                <ShareNetworks comment={comment}/>
                
                
                <Panel bsStyle="info">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Did you like it or not
                            ?</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <ButtonToolbar>
                            <ButtonGroup bsSize="large">
                                {currentSlideLike}
                                {currentSlideDisLike}
                            </ButtonGroup>
                        </ButtonToolbar>
                    
                    </Panel.Body>
                
                </Panel>
            </div>
        )
    },
})

//

export { CommentSlide }
