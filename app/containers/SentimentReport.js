import React, { Component } from 'react'

var S = require('jquery')

var createReactClass = require('create-react-class')

import PropTypes from 'prop-types'
import { State, Navigation } from 'react-router'

import { connect } from 'react-redux'

import Helmet from 'react-helmet'
import Icon from 'components/Icon'

import { FormControl } from 'react-bootstrap'
import { loadArticleDetail } from 'actions/articles'

import { loadSentimentCommentDetail } from 'actions/commentators'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

import {
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    CardTitle,
    CardText,
} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'

var emojione = require('emojione')
import Date from 'components/Date'
import { Tabs, Tab } from 'material-ui/Tabs'
import CircularProgress from 'material-ui/CircularProgress'

// import TextField from 'material-ui/TextField'
//
// import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
// import Checkbox from 'material-ui/Checkbox'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import { GoogleSearchScript } from 'components/GoogleSearchScript'

import { saSentimentCommentDetail } from '../middleware/sa'

import YouTube from 'react-youtube'

import BubbleChart from 'components/BubbleChart'

import { XScript } from 'components/XScriptYoutube'
import { YoutubeReportRun } from 'containers/YoutubeReportRun'

class SentimentReport extends Component {
    static fetchData ({store, params}) {
        let {url, lang, refresh} = params
        console.log('SentimentComment, fetchData -> ', url, lang, refresh)
        return store.dispatch(loadSentimentCommentDetail({url, lang, refresh}))
    }
    
    constructor (props) {
        super()
        this.state = {
            comment: {},
        }
    }
    
    getUrlVars () {
        var vars = [], hash
        var hashes = window.location.href.slice(window.location.href.indexOf(
            '?') + 1).split('&')
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=')
            vars.push(hash[0])
            vars[hash[0]] = hash[1]
        }
        return vars
    }
    
    render () {
        //console.log(this.props)
        let {comment} = this.props
        let {url} = this.props.params
        if (typeof window !== 'undefined') {
            var vars = this.getUrlVars()
            var lang = vars['lang']
            var refresh = vars['refresh']
            console.log('render -> ', url, lang, refresh)
        }
        
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
                        {
                            'property': 'og:type',
                            'content': 'article',
                        },
                        
                        {
                            'property': 'og:title',
                            'content': `${comment.title ? comment.title : ''}`,
                        },
                        {
                            'property': 'og:video',
                            'content': `${comment.url ? comment.url : ''}`,
                        },
                        
                        {
                            'property': 'og:image',
                            'content': `${comment.metadata
                                ? comment.metadata.thumbnail
                                : '//comentarismo.com/static/img/comentarismo-extra-mini-logo.png' }`,
                        },
                    ]}
                />
                <Sentiment comment={comment} url={url}
                           lang={comment && comment.metadata
                               ? comment.metadata.language
                               : null}
                           refresh={refresh}/>
                
                <XScript operator={comment.operator} page={comment.id}
                         index="operator_uuid"/>
                
                
                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2017
                                    Comentarismo.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

var terrible = 'Terrible!'
var sucks = 'Sucks'
var bad = 'Bad'
var notgood = 'Not Good'
var eh = 'Eh'
var neutral = 'Neutral'
var ok = 'OK'
var good = 'Good'
var likeit = 'Like It'
var lovedit = 'Loved It'
var awesome = 'Awesome!'
var unknown = 'Unknown'

var terribleInt = -5
var sucksInt = -4
var badInt = -3
var notgoodInt = -2
var ehInt = -1
var neutralInt = 0
var okInt = 1
var goodInt = 2
var likeitInt = 3
var loveditInt = 4
var awesomeInt = 5
var unknownInt = 6

var emojis = {
    'Terrible!': terrible + emojione.shortnameToUnicode(':scream:'),
    'Sucks': sucks + emojione.shortnameToUnicode(':angry:'),
    'Bad': bad + emojione.shortnameToUnicode(':worried:'),
    'Not Good': notgood + emojione.shortnameToUnicode(':unamused:'),
    'Eh': eh + emojione.shortnameToUnicode(':confused:'),
    'Neutral': neutral + emojione.shortnameToUnicode(':expressionless:'),
    'OK': ok + emojione.shortnameToUnicode(':neutral_face:'),
    'Good': good + emojione.shortnameToUnicode(':smile:'),
    'Like It': likeit + emojione.shortnameToUnicode(':smiley:'),
    'Loved It': lovedit + emojione.shortnameToUnicode(':yum:'),
    'Awesome!': awesome + emojione.shortnameToUnicode(':grinning:'),
    'Unknown': unknown + emojione.shortnameToUnicode(':no_mouth:'),
}

var Sentiment = createReactClass({
    displayName: 'Sentiment',
    
    getInitialState: function () {
        let {url, comment, lang, refresh} = this.props
        
        return {
            vid: url,
            comment: comment,
            numBubbles: 70,
            lang: lang,
            refresh: refresh,
        }
    },
    
    next: function () {
        let {url, comment, lang} = this.props
        if (comment && comment.metadata && comment.keywords &&
            comment.sentimentscores && comment.sentiment &&
            comment.sentimentlist) {
            console.log(
                'INFO: Sentiment report looks perfect, going to re-use this for now :D')
            
            this._runReport()
            
            return
        }
        var that = this
        saSentimentCommentDetail(url, lang, false, function (err, res) {
            // Do something
            if (err || !res || res.body.length === 0) {
                console.log(
                    'Got error when trying to fallback on sentiment report :| ',
                    err)
                
                this.timeout = setTimeout(this.next, 1000)
            } else {
                var comment = res.body
                
                if (!comment || !comment.metadata || !comment.keywords ||
                    !comment.sentiment || !comment.sentimentlist ||
                    !comment.topcomments) {
                    console.log(
                        'Got error when trying to fallback on sentiment report :|, will retry again in 1s ',
                        comment)
                    this.timeout = setTimeout(this.next, 1000)
                    return
                }
                
                console.log('fallback ok :D , updating view ',
                    comment.metadata)
                this.setState(
                    {comment: comment, lang: comment.metadata.language})
                
                that._runReport()
                
            }
        }.bind(this))
    },
    
    componentDidMount () {
        this.timeout = setTimeout(this.next, 1000)
    },
    
    runReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/report/' +
                encodeURIComponent(this.state.vid) + '?' +
                (this.state.lang ? 'lang=' + this.state.lang : '')
        }
    },
    
    updateReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/report/' +
                encodeURIComponent(this.state.vid) + '?' +
                (this.state.lang ? 'lang=' + this.state.lang : '') +
                '&refresh=true'
        }
    },
    
    handleChange: function (event) {
        var change = event.target.value
        this.setState({vid: change})
    },
    
    handleChangeLang: function (event) {
        var change = event.target.value
        this.setState({lang: change})
    },
    
    _runReport () {
        let {comment} = this.state
        
        if (typeof window !== 'undefined' && comment && comment.keywords &&
            comment.sentiment) {
            
            console.log('Going to generate report :D ')
            
            var Chart = require('chart.js')
            
            // Sort the keyword list
            var sortable = []
            for (var k in comment.keywords) {
                sortable.push([k, comment.keywords[k]])
            }
            
            sortable.sort(function (a, b) {
                return b[1] - a[1]
            })
            
            var y = 0
            for (var s in sortable) {
                y++
                S('#keywords').
                    append('<tr><td>' + y + '.</td><td>' + sortable[s][0] +
                        ' (' + sortable[s][1] + ')</td></tr>')
            }
            
            var elabels = [
                emojis[terrible],
                emojis[sucks],
                emojis[bad],
                emojis[notgood],
                emojis[eh],
                emojis[neutral],
                emojis[ok],
                emojis[good],
                emojis[likeit],
                emojis[lovedit],
                emojis[awesome],
                emojis[unknown],
            ]
            
            var labels = [
                terrible,
                sucks,
                bad,
                notgood,
                eh,
                neutral,
                ok,
                good,
                likeit,
                lovedit,
                awesome,
                unknown]
            var dp = {}
            for (var x in comment.sentiment) {
                var n = comment.sentiment[x]['name']
                if (n === '') {
                    n = unknown
                }
                var p = comment.sentiment[x]['percent']
                
                dp[n] = p
            }
            var element = document.getElementById('myChart')
            var ctx = {}
            if (element) {
                ctx = element.getContext('2d')
            }
            // Bar Chart
            var data = {
                labels: elabels,
                datasets: [
                    {
                        label: 'Percent',
                        backgroundColor: [
                            '#040D45',
                            '#0A0D57',
                            '#0C0F63',
                            '#111585',
                            '#12168C',
                            '#151AAD',
                            '#2D32C4',
                            '#3A3EC7',
                            '#4D51C9',
                            '#5F62C9',
                            '#7679CC',
                            '#8F91CC',
                        ],
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [
                            dv(dp[terribleInt], 0),
                            dv(dp[sucksInt], 0),
                            dv(dp[badInt], 0),
                            dv(dp[notgoodInt], 0),
                            dv(dp[ehInt], 0),
                            dv(dp[neutralInt], 0),
                            dv(dp[okInt], 0),
                            dv(dp[goodInt], 0),
                            dv(dp[likeitInt], 0),
                            dv(dp[loveditInt], 0),
                            dv(dp[awesomeInt], 0),
                            dv(dp[unknownInt], 0)],
                    },
                ],
            }
            
            new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    showLines: false,
                    responsive: false,
                    maintainAspectRatio: true,
                },
            })
            
            var ctx2 = document.getElementById('scaleChart').getContext('2d')
            
            // Bar Chart
            var data2 = {
                labels: elabels,
                datasets: [
                    {
                        label: 'Percent',
                        backgroundColor: [
                            '#040D45',
                            '#0A0D57',
                            '#0C0F63',
                            '#111585',
                            '#12168C',
                            '#151AAD',
                            '#2D32C4',
                            '#3A3EC7',
                            '#4D51C9',
                            '#5F62C9',
                            '#7679CC',
                            '#8F91CC',
                        ],
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [
                            dv(dp[terribleInt], 0),
                            dv(dp[sucksInt], 0),
                            dv(dp[badInt], 0),
                            dv(dp[notgoodInt], 0),
                            dv(dp[ehInt], 0),
                            dv(dp[neutralInt], 0),
                            dv(dp[okInt], 0),
                            dv(dp[goodInt], 0),
                            dv(dp[likeitInt], 0),
                            dv(dp[loveditInt], 0),
                            dv(dp[awesomeInt], 0),
                            dv(dp[unknownInt], 0)],
                    },
                ],
            }
            
            new Chart(ctx2, {type: 'pie', data: data2, options: {}})
            
        } else {
            console.log('ERROR: Could not load Charts :( ', comment)
        }
    },
    
    render: function () {
        let {comment, numBubbles} = this.state
        
        if (!comment || !comment.metadata) {
            return (
                <div>
                    <CircularProgress size={80} thickness={5}/>
                </div>
            )
        }
        
        var bubblechart = []
        
        const opts = {
            height: '290',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
            },
        }
        var bubblechartComponent = null
        if (comment.sentimentscores) {
            
            for (var u = 0; u < comment.sentimentscores.length; u++) {
                
                var t = comment.sentimentscores[u]
                if (t) {
                    Object.keys(t).forEach(function (key) {
                        var target = {
                            _id: key,
                            sentiment: t[key],
                            value: bubblechart.length + 10,
                        }
                        if (bubblechart.length < numBubbles) {
                            bubblechart.push(target)
                        }
                    })
                }
            }
            bubblechartComponent = <BubbleChart data={bubblechart}/>
        } else {
            console.log(
                'ERROR: sentimentscores is not defined, bubble chart will not load!!!!!!!!!!!!!!!!!!! ')
        }
        
        return (
            <div className="">
                
                
                <Grid fluid={true}
                      style={{padding: '4rem 0 6rem 4rem'}}>
                    <Row>
                        <YoutubeReportRun/>
                        
                        <Row style={{
                            paddingTop: '5px !important',
                            background: '#fff',
                            height: 'auto',
                            fontFamily: 'Open Sans, sans-serif',
                            color: '#656972',
                        }}>
                            <CardHeader style={{
                                paddingBottom: '0px',
                            }}
                                        title={<span style={{
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                        }}> YouTube </span>}
                                        avatar={<img
                                            src="/static/img/sources/youtube.png"
                                            style={{
                                                height: '24px',
                                                width: '24px',
                                                marginTop: '8px',
                                            }}
                                        />}
                                        subtitle={<Date
                                            style={{fontSize: '14px'}}
                                            date={comment.date}/>}
                            />
                            
                            <CardTitle
                                title={comment.title}/>
                            <div style={{
                                marginLeft: '15px',
                                paddingBottom: '5rem',
                                color: '#656972',
                                textTransform: 'uppercase',
                                fontSize: '14px',
                                lineHeight: '1.5',
                            }}>
                                <div>
                                    <span><b>{comment.metadata
                                        ? comment.metadata.totalcomments
                                        : ''}</b></span>
                                    <span
                                    > Comments</span>
                                </div>
                                <div>
                                    <span><b>{comment.metadata
                                        ? comment.metadata.videoviews
                                        : ''}</b></span>
                                    <span> Views</span>
                                </div>
                                <div>
                                    <span
                                        id="comments_per_day"><b>{comment.commentavgperday
                                        ? comment.commentavgperday.toFixed(2)
                                        : '0'}</b></span>
                                    <span> Comments per day</span>
                                </div>
                            </div>
                        </Row>
                        <Row>
                            
                            <div style={{
                                marginLeft: '10px',
                                paddingBottom: '10px',
                                color: '#656972',
                                textTransform: 'uppercase',
                                fontSize: '14px',
                            }}>Trending words
                            </div>
                            {
                                comment.keywords &&
                                Object.keys(comment.keywords).
                                    map((tag, i) => {
                                        if (i > 15 || (tag && tag.length < 2)) {
                                            return ''
                                        }
                                        return (
                                            <Chip key={`${tag}-${i}`}>
                                                <Avatar
                                                    size={32}>{tag.slice(0,
                                                    1).
                                                    toUpperCase()}</Avatar>
                                                <a href={`/search?q=${tag}`}>
                                                    {tag}
                                                </a>
                                            </Chip>
                                        )
                                    })
                            }
                        </Row>
                        <Row>
                            <YouTube
                                videoId={comment.metadata
                                    ? comment.metadata.id
                                    : comment.id}
                                opts={opts}
                                onReady={this._onReady}
                                width="500" height="395"
                            />
                        </Row>
                    </Row>
                </Grid>
                
                <Tabs>
                    <Tab label="BubbleChart"
                         style={{background: '#f5f5f5', color: '#333'}}>
                        {bubblechartComponent}
                        <div style={{'justify-content': 'center'}}>
                            <div className="">{numBubbles +
                            (numBubbles === 1 ? ' Circle' : ' Circles')}</div>
                            <input
                                className=""
                                type="range"
                                min="1"
                                max="250"
                                value={numBubbles}
                                onChange={this.onChange}/>
                        </div>
                    </Tab>
                    <Tab label="Sentiment Statistics"
                         style={{background: '#f5f5f5', color: '#333'}}>
                        <canvas id="myChart" width="600" height="300"></canvas>
                    </Tab>
                    <Tab label="Scale of values"
                         style={{background: '#f5f5f5', color: '#333'}}>
                        <canvas id="scaleChart" width="200px"
                                height="100px"></canvas>
                    </Tab>
                
                </Tabs>
            
            </div>
        )
    },
    onChange: function (e) {
        this.setState({numBubbles: e.target.value})
    },
    _onReady: function (event) {
        // access to player in all event handlers via event.target
        // event.target.pauseVideo()
    },
})

var PlayButton = createReactClass({
    render: function () {
        return (
            <div className="col-xs-3 btn btn-custom"
                 onClick={this.props.onClick}>
        <span className="fa fa-play"
              data-text="play"/> {this.props.label}
            </div>
        )
    },
})

var CommentsView = createReactClass({
    displayName: 'CommentsView',
    
    getInitialState: function () {
        let {comment, emojis, sentimentlist} = this.props
        return {
            comment: comment,
            emojis: emojis,
            sentimentlist: sentimentlist,
        }
    },
    
    componentWillReceiveProps: function (p) {
        //console.log(p);
        let {comment, sentimentlist} = p
        console.log('componentWillReceiveProps -> ')
        this.setState({comment: comment, sentimentlist: sentimentlist})
    },
    
    loadterrible: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[terrible]})
    },
    loadsucks: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[sucks]})
    },
    loadbad: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[bad]})
    },
    loadnotgood: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[notgood]})
    },
    loadeh: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[eh]})
    },
    loadneutral: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[neutral]})
    },
    loadok: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[ok]})
    },
    loadgood: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[good]})
    },
    loadlikeit: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[likeit]})
    },
    loadlovedit: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[lovedit]})
    },
    loadawesome: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[awesome]})
    },
    loadunknown: function () {
        let {sentimentlist} = this.state
        this.setState({comment: sentimentlist[unknown]})
    },
    
    render: function () {
        let {comment, emojis} = this.state
        
        if (!comment) {
            comment = []
        }
        
        var loadterribleButton = <PlayButton label={emojis[terrible]}
                                             onClick={this.loadterrible}/>
        var loadsucksButton = <PlayButton label={emojis[sucks]}
                                          onClick={this.loadsucks}/>
        var loadbadButton = <PlayButton label={emojis[bad]}
                                        onClick={this.loadbad}/>
        var loadnotgoodButton = <PlayButton label={emojis[notgood]}
                                            onClick={this.loadnotgood}/>
        var loadehButton = <PlayButton label={emojis[eh]}
                                       onClick={this.loadeh}/>
        var loadneutralButton = <PlayButton label={emojis[neutral]}
                                            onClick={this.loadneutral}/>
        var loadokButton = <PlayButton label={emojis[ok]}
                                       onClick={this.loadok}/>
        var loadgoodButton = <PlayButton label={emojis[good]}
                                         onClick={this.loadgood}/>
        var loadlikeitButton = <PlayButton label={emojis[likeit]}
                                           onClick={this.loadlikeit}/>
        var loadloveditButton = <PlayButton label={emojis[lovedit]}
                                            onClick={this.loadlovedit}/>
        var loadawesomeButton = <PlayButton label={emojis[awesome]}
                                            onClick={this.loadawesome}/>
        var loadunknownButton = <PlayButton label={emojis[unknown]}
                                            onClick={this.loadunknown}/>
        
        return (
            
            <div id="comentarismo-container"
                 className="comentarismo-comment col-md-10">
                
                <div className="col-md-12">
                    {loadterribleButton}
                    {loadsucksButton}
                    {loadbadButton}
                    {loadnotgoodButton}
                    {loadehButton}
                    {loadneutralButton}
                    {loadokButton}
                    {loadgoodButton}
                    {loadlikeitButton}
                    {loadloveditButton}
                    {loadawesomeButton}
                    {loadunknownButton}
                </div>
                <div className="col-xs-12" style={{height: '45px'}}></div>
                
                
                <div className="col-md-12">
                    {
                        comment.map((q) => {
                            return (
                                <div key={q.id}>
                                    <div className="col-xs-1 hidden-xs">
                                        <a className="avatar img-responsive user-photo"/>
                                        <Icon nick={q.authorname} size={50}/>
                                    </div>
                                    <div className="text-wrapper col-xs-11">
                                        <div className="col-xs-8">
                                            <div role="meta"
                                                 className="comentarismo-comment-header">
                                                        <span
                                                            className="author">
                                                            <b>@{q.authorname}</b>
                                                        </span>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            Sentiment {emojis[q.sentiment]}
                                        </div>
                                        
                                        <div className="col-xs-8">
                                            <div role="meta"
                                                 className="comentarismo-comment-header">
                                                        <span
                                                            className="author">
                                                            <b><img
                                                                src="/static/img/thumbs-up.png"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                }}/> {q.likes}
                                                            </b>
                                                        </span>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            <Date
                                                date={q.published}/>
                                        </div>
                                        
                                        <div className="text col-sm-12">
                                            <p dangerouslySetInnerHTML={{__html: q.content}}></p>
                                        </div>
                                        
                                        <div
                                            className="comentarismo-comment-footer col-sm-12">
                                        
                                        </div>
                                        <div
                                            className="comentarismo-follow-up"></div>
                                        <div
                                            className="comentarismo-postbox"></div>
                                    
                                    </div>
                                </div>
                            
                            )
                        })
                    }
                </div>
            </div>
        )
    },
})

function dv (data, defaultData) {
    return (data ? data : defaultData)
}

function mapStateToProps (state) {
    return {comment: state.commentatorDetail}
}

SentimentReport.propTypes = {
    comment: PropTypes.object.isRequired,
}

export { SentimentReport }
export default connect(mapStateToProps, {loadSentimentCommentDetail})(
    SentimentReport)
    
