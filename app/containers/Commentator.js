import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { loadCommentatorDetail } from 'actions/commentators'

import Date from 'components/Date'
import Helmet from 'react-helmet'
import CommentSingle from 'components/CommentSingle'

import {
    CardActions,
    CardHeader,
    CardTitle,
    CardText,
} from 'material-ui/Card'
import { Tabs, Tab } from 'material-ui/Tabs'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'

import LinearProgress from 'material-ui/LinearProgress'

import Chip from 'material-ui/Chip'

import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import FontIcon from 'material-ui/FontIcon';

import PersonOutline from 'material-ui/svg-icons/social/person-outline';
import Place from 'material-ui/svg-icons/maps/place';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';



var moment = require('moment')
var table = 'commentator'

var $ = require('jquery')
var ImageResized = require('components/ImageResized')

class Commentator extends Component {
    static fetchData ({store, params}) {
        let {id} = params
        return store.dispatch(loadCommentatorDetail({id, table}))
    }
    
    // componentDidMount () {
    //     let {id} = this.props.params
    //     this.props.loadCommentatorDetail({id, table})
    // }
    
    render () {


        let {commentator} = this.props;
        if (!commentator.comments) {
            commentator.comments = []
        }
        let {id} = this.props.params;
        
        var commentsavgperday = 0.0;
        
        try {
            var targetDate = moment()
            if (commentator.minDate) {
                targetDate = moment(commentator.minDate)
            }
            var today = moment()
            
            var diffInDays = today.diff(targetDate, 'days') // x days
            
            // console.log('commentsavgperday, diffInDays, ', diffInDays)
            
            if (diffInDays > 0) {
                commentsavgperday = parseFloat(commentator.totalComments) /
                    (parseFloat(diffInDays) / parseFloat(24))
            }
        } catch (e) {
            console.log('Error when getting commentsavgperday :| ', e, id)
        }
        
        if (typeof window !== 'undefined') {
            $('.progress-bar').
                attr('aria-valuenow', 100).
                css({'width': 100 + '%'}).
                text('Comments Analyzed: ' + 100 + '%')
        }
        
        return (
            <div>
                <Helmet
                    htmlAttributes={{'lang': 'en'}} // amp takes no value
                    title={`Latest Comments - Commentator Profile -> @${commentator.slug &&
                    typeof commentator.slug.toUpperCase === 'function'
                        ? commentator.slug.toUpperCase()
                        : commentator.nick} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            'name': 'description',
                            'content': `Find all comments for @${commentator.slug &&
                            typeof commentator.slug.toUpperCase === 'function'
                                ? commentator.slug.toUpperCase()
                                : commentator.nick} - the world's leading liberal comments website.`,
                        },
                        {
                            'property': 'og:type',
                            'content': 'comments',
                        },
                        {
                            'property': 'og:image',
                            'content': 'https://unsplash.it/1400/350?random',
                        },
                        {
                            'property': 'og:title',
                            'content': `${commentator && commentator.nick
                                ? commentator.nick
                                : id}`,
                        },
                    ]}

                />

                <div className="commentator-container">

                        <div className="commentator-container__user">
                            <Avatar
                                icon={<PersonOutline/>}
                                size={120} />
                            <div className="commentator-container__panel-wrapper">
                                <div className="commentator-container__panel">
                                    <span className="commentator-container__panel--header">About me</span>
                                    <ul>
                                        <li>
                                            <span>{<AccountCircle/>}</span>
                                            <span className="commentator-container__user--nick"> @{commentator.slug}</span>
                                        </li>
                                        <li className="commentator-container__place">
                                            <span>{<Place/>}</span>
                                            <span className="commentator-container__place--state">{commentator.countries.toUpperCase()}</span>
                                        </li>
                                        <li><div className="padding-small"><b> Language </b> </div>
                                            <div>{commentator.languages}</div>
                                        </li>
                                        <li>
                                            <div className="padding-small"><b>Avg. comments per day</b></div>
                                            <div id="comments_per_day"> {commentsavgperday &&
                                            commentsavgperday !== '0'
                                            ? commentsavgperday.toFixed(0)
                                            : '0'}</div>
                                        </li>
                                        <li>
                                            <div className="padding-small"><b> Member since </b></div>
                                            <Date date={commentator.minDate}/>
                                        </li>
                                        <li>
                                            <div className="padding-small"><b>Last comment on</b></div>
                                            <div> <Date date={commentator.maxDate}/> </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div  className="commentator-container__comments">
                            <span className="triangle-isosceles"> We have found
                                <span
                                    id="total_comments"> {commentator.totalComments
                                    ? commentator.totalComments
                                    : ''} </span> comments from  @{commentator.slug} on <a href="" target="_blank">
                                    {commentator.operator}</a>!
                            </span>
                            <div className="commentator-container__chip">
                                <span className="commentator-container__chip--headline">
                                     @{commentator.slug} is also commenting on this topics:
                                </span>
                                {
                                    commentator.genre &&
                                    commentator.genre.map((tag, i) => {
                                        return (
                                            <div className="commentator-container__chip--wrapper">
                                                <a href={`/commentator_news/${commentator.id}?genre=${tag}`}>
                                                    <Chip className="commentator-container__chip--label"
                                                          key={`chip-${i}`}>
                                                        <Avatar size={32}>{tag.slice(0,
                                                            1).toUpperCase()}</Avatar>
                                                        {tag}
                                                    </Chip>
                                                </a>
                                            </div>
                                        )
                                    })
                                }
                            </div>


                            <div  className="commentator-container__commentslist">
                            {
                                commentator.comments.map((comment,i) => {
                                    if (!this.props.location.query.genre || this.props.location.query.genre === comment.genre) {
                                        return (
                                            <CommentSingle key={`c-${i}`} comment={comment}/>
                                        )
                                    }
                                    return (
                                        ""
                                    )
                                })
                            }
                            </div>
                        </div>
                </div>

            </div>
        )
    }
}

function mapStateToProps (state) {
    return {commentator: state.commentatorDetail}
}

Commentator.propTypes = {
    commentator: PropTypes.object.isRequired,
}

export { Commentator }
export default connect(mapStateToProps, {loadCommentatorDetail})(Commentator)
