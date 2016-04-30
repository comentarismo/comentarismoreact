import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

var Article = require('./Article');

class Articles extends Component {
    render() {
        return (
            <div className="row single-post-row">
                <div className="col-sm-12 col-sm-offset-0 col-xs-12 article-body">
                    <div className="col-xs-12">
                        <div className="content">
                            <div className="posts">
                                {
                                    this.props.articles.map((q)=> {
                                        return (
                                            <Article
                                                key={q.id}
                                                article={q}
                                            />
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

Articles.propTypes = {
    articles: PropTypes.array.isRequired
}

export default Articles
