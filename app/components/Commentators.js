import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

var jdenticon = require("jdenticon");
var md5 = require('md5');


var Icon = React.createClass({
    render: function () {
        return <div
            dangerouslySetInnerHTML={{__html:jdenticon.toSvg(md5(this.props.nick ? this.props.nick : ""), 250)}}/>;
    }
});
class Commentators extends Component {
    render() {
        return (
            <div className="row single-post-row">
                <div className="col-sm-12 col-sm-offset-0 col-xs-12 article-body">
                    <div className="col-xs-12">
                        <div className="content">
                            <div className="posts">
                                {
                                    this.props.commentators.map((q)=> {
                                        return (
                                            <div className="col-lg-3 col-md-3 col-sm-5 col-xs-10">
                                                <a href={`/commentators/${q.id}`} className='thumbnail article'>
                                                    <div className="imageNoPadding">
                                                        <Icon nick={q.nick}/>
                                                    </div>
                                                    <div className='caption'>
                                                        <h3 className='article-header'>{q.nick}</h3>
                                                        <p>Last seen: {q.maxDate}</p>
                                                        Interest:
                                                        {q.genre && Object.keys(q.genre).map(function (char, idx) {
                                                            return <span> {q.genre[idx]} </span>
                                                        }.bind(this))}
                                                        <p className='source'>Total Comments {q.totalComments}</p>
                                                    </div>
                                                </a>
                                                <Link to={`/commentators/${q.id}`}> See Comments »</Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Commentators.propTypes = {
    commentators: PropTypes.array.isRequired
}

export default Commentators
