import React, { Component } from 'util/safe-react';

var createReactClass = require('create-react-class')

import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Helmet from 'react-helmet'

import { loadCommentDetail } from 'actions/commentators'

import { CommentSlide } from 'components/CommentSlide'

var analytics = require('ga-browser')()
import {
    Panel,
} from 'react-bootstrap'

var Slide = createReactClass({
    render: function () {
        let {comment} = this.props
        
        return (
            <div className="container">
                <CommentSlide key={comment.id} comment={comment}/>
            </div>
        )
    },
})

var Slideshow = createReactClass({
    
    getInitialState: function () {
        let {comment} = this.props
        return {
            currentSlide: comment,
            counter: 0,
            playing: false,
        }
    },
    render: function () {
        
        return (
            <Slide key={this.props.comment.id} comment={this.props.comment}/>
        )
    },
})

class Comment extends Component {
    static fetchData ({store, params}) {
        let {id} = params
        // console.log(id);
        return store.dispatch(loadCommentDetail({id}))
    }
    
    componentDidMount () {
        analytics('create', 'UA-51773618-1', 'auto')
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 20000)
    }
    
    render () {
        let {comment} = this.props
        
        return (
            <div>
                <Helmet
                    htmlAttributes={{'lang': 'en'}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            'name': 'description',
                            'content': 'Welcome to Comentarismo',
                        },
                        {
                            'property': 'og:type',
                            'content': 'article',
                        },
                    ]}
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
                
                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                        
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <Slideshow comment={comment}/>
                    </Panel.Body>
                </Panel>
            
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {comment: state.commentDetail}
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
}

export { Comment }
export default connect(mapStateToProps, {loadCommentDetail})(Comment)
