import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadArticles } from 'actions/articles'
import { Link } from 'react-router'
import _ from 'lodash'
import Articles from 'components/Articles'
var MainNavbar = require('components/MainNavbar');

class ArticleContainer extends Component {
    static fetchData({ store, params }) {
        let { index,value } = params
        return store.dispatch(loadArticles({index, value}))
    }

    //componentDidMount() {
    //    let { index,value } = this.props.params
    //    this.props.loadArticles({index, value})
    //}

    render() {
        return (
            <div>
                <MainNavbar/>
                <Articles articles={this.props.articles}/>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {articles: state.articles}
}

export { ArticleContainer }
export default connect(mapStateToProps, {loadArticles})(ArticleContainer)
