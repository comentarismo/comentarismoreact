import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadCommentators } from 'actions/commentators'
import { Link } from 'react-router'
import _ from 'lodash'
import Commentators from 'components/Commentators'
var MainNavbar = require('components/MainNavbar');

class CommentatorContainer extends Component {
    static fetchData({ store, params }) {
        let { index,value } = params
        return store.dispatch(loadCommentators({index, value}))
    }

    componentDidMount() {
        let { index,value } = this.props.params
        this.props.loadCommentators({index, value})
    }

    render() {
        let { value } = this.props.params
        return (
            <div>
                <MainNavbar/>
                <h1>Showing Commentators for {value}</h1>
                <Commentators commentators={this.props.commentators}/>
                <Link to="/">Back to Home</Link>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {commentators: state.commentators}
}

export { CommentatorContainer }
export default connect(mapStateToProps, {loadCommentators})(CommentatorContainer)
