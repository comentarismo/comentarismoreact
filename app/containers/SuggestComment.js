import React, { Component,ReactClass } from 'util/safe-react';
import PropTypes from 'prop-types';
import { State, Navigation } from 'react-router';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Helmet from "react-helmet";


import { loadSuggestCommentDetail } from 'actions/commentators'

import {PlayComment} from './PlayComment';
var PlayNavbar = require('components/PlayNavbar');

class SuggestComment extends Component {
    static fetchData({ store, params }) {
        let { index,value,skip,limit } = params;
        // console.log(value);
        return store.dispatch(loadSuggestCommentDetail({index, value, skip, limit}))
    }

    render() {
        let { comment } = this.props;
        var index = this.props.params.index;
        var value = this.props.params.value;
        var skip = this.props.params.skip;
        var limit = this.props.params.limit;

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {"name": "description", "content": "Welcome to Comentarismo"},
                        {"property": "og:type", "content": "article"}
                    ]}
                    link={[
                        {"rel":"stylesheet","href":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"},
                        {"rel":"stylesheet","href":"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"},
                        {"rel":"stylesheet","href":"https://use.fontawesome.com/releases/v5.0.6/css/all.css"},
                        
                    ]}
                />
                <PlayNavbar/>

                <PlayComment comment={comment} index={index} value={value} skip={skip} limit={limit} />
               
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {comment: state.suggestCommentDetail}
}

SuggestComment.propTypes = {
    comment: PropTypes.array.isRequired,
};


export { SuggestComment }
export default connect(mapStateToProps, {loadSuggestCommentDetail})(SuggestComment)
