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
import Avatar from 'material-ui/Avatar'

var moment = require('moment')
var table = 'commentator'

var $ = require('jquery')
var ImageResized = require('components/ImageResized')

class Commentator extends Component {
    static fetchData ({store, params}) {
        let {id} = params
        return store.dispatch(loadCommentatorDetail({id, table}))
    }
    
    componentDidMount () {
        let {id} = this.props.params
        this.props.loadCommentatorDetail({id, table})
    }
    
    render () {
        let {commentator} = this.props
        if (!commentator.comments) {
            commentator.comments = []
        }
        let {id} = this.props.params
        
        var commentsavgperday = 0.0
        
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
                
                <Grid fluid={false}
                      style={{padding: '4rem', paddingBottom: '6rem'}}>
                    
                    <Row
                        style={{
                            background: '#fff',
                            height: 'auto',
                            fontFamily: 'Open Sans, sans-serif',
                            color: '#656972',
                        }}>
                        <Row className="col-lg-6" style={{}}>
                            <CardHeader style={{
                                paddingTop: '0px !important',
                                paddingBottom: '0px',
                            }}
                                        title={<span style={{
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                        }}>{commentator.operator
                                            ? commentator.operator + ' '
                                            : ' '}</span>}
                                        avatar={<a
                                            href={`/news/operator/${commentator.operator}`}><img
                                            style={{
                                                height: '24px',
                                                width: '24px',
                                                marginTop: '8px',
                                            }}
                                            src={`/static/img/sources/${commentator.operator}.png`}/></a>}
                                        subtitle={<Date
                                            style={{fontSize: '14px'}}
                                            date={this.props.commentator.date}/>}
                            />
                            
                            <CardTitle style={{
                                paddingTop: '0px !important',
                                paddingBottom: '0px',
                            }}
                                       title={<a target="_blank"
                                                 href={commentator.link}><span
                                           dangerouslySetInnerHTML={{__html: commentator.title}}/></a>}
                                       titleStyle={{}}
                                       subtitle={<a target="_blank"
                                                    href={`/html/news.html?table=commentaries&skip=0&limit=50&operator=${commentator.operator}&key=operator_titleurlize&value=${commentator.titleurlize}`}><span
                                           dangerouslySetInnerHTML={{__html: ''}}/></a>}
                            />
                        </Row>
                        <Col key={commentator.id}>
                            <Row>
                                
                                <CardText style={{
                                    paddingTop: '0px',
                                    paddingBottom: '0px',
                                }}>
                                    
                                    <Col key={commentator.id} style={{
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                    }}>
                                        <Row>
                                            <span>NICK: <b>{commentator.nick}</b></span>
                                        </Row>
                                        <Row>
                                            <span>HANDLE: <b>@{commentator.slug}</b></span>
                                        </Row>
                                        
                                        <Row>
                                            Total Comments: <b>
                                            <span
                                                id="total_comments">{commentator.totalComments
                                                ? commentator.totalComments
                                                : ''}</span></b>
                                        </Row>
                                    </Col>
                                    <Col key={commentator.id} style={{
                                        fontSize: '14px',
                                        textTransform: 'uppercase',
                                    }}>
                                        
                                        <Row>
                                            Average comments per day: <b> <span
                                            id="comments_per_day"> {commentsavgperday &&
                                        commentsavgperday !== '0'
                                            ? commentsavgperday.toFixed(2)
                                            : '0'}</span></b>
                                        </Row>
                                        
                                        <Row><span> FIRST SEEN: <Date
                                            date={commentator.minDate}/></span>
                                        </Row>
                                        <Row><span> LAST SEEN: <Date
                                            date={commentator.maxDate}/></span>
                                        </Row>
                                        
                                        <Row>
                                            <span>COUNTRY: <b>{commentator.countries}</b></span>
                                        </Row>
                                        
                                        <Row>
                                            <span>LANGUAGE: <b>{commentator.languages}</b></span>
                                        
                                        </Row>
                                    </Col>
                                
                                </CardText>
                                <CardActions>
                                
                                
                                </CardActions>
                            </Row>
                        </Col>
                        <Col key={commentator.id}>
                            <div className="progress" style={{
                                color: '#656972',
                                textTransform: 'uppercase',
                            }}>
                                <LinearProgress mode="determinate" value="100"/>
                                <div
                                    className="progress-bar progress-bar-success"
                                    role="progressbar"
                                    aria-valuenow="0"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{width: '0%'}}>
                                    
                                    <b>Comments Analyzed: 0%</b>
                                </div>
                            </div>
                            <ImageResized src={commentator.image}
                                          srcfallback={'https://unsplash.it/1400/350?random'}
                                          id={commentator.id}
                                          width="520" height="395"
                                          quality="50"/>
                        
                        
                        </Col>
                        
                        
                        <Row>
                            
                            <Row>
                                <div style={{
                                    color: '#656972',
                                    textTransform: 'uppercase',
                                }}>
                                    <b>Interests</b>
                                </div>
                            </Row>
                            <Row>
                                {
                                    commentator.genre &&
                                    commentator.genre.map((tag, i) => {
                                        return (<Chip>
                                            <Avatar size={32}>{tag.slice(0,
                                                1).toUpperCase()}</Avatar>
                                            {tag}
                                        </Chip> )
                                    })
                                }
                            </Row>
                        </Row>
                    </Row>
                
                
                </Grid>
                
                <Tabs style={{width: '100%'}}>
                    
                    <Tab label="Comments"
                         style={{background: '#f5f5f5', color: '#333'}}>
                        {
                            commentator.comments.map((q) => {
                               
                                
                                return (
                                    <CommentSingle comment={q} />
                                )
                            })
                        }
                    
                    </Tab>
                    <Tab label="Report"
                         style={{background: '#f5f5f5', color: '#333'}}>
                    
                    </Tab>
                
                </Tabs>
            
            
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
