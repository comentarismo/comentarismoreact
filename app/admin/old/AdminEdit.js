import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { loadAdminDetail } from 'actions/admin'
import {XScript} from 'components/XScript'

import Date from "components/Date"
import Helmet from "react-helmet";

import EditNews from 'admin/EditNews';
import EditCommentaries from 'admin/EditCommentaries';
import EditCommentator from 'admin/EditCommentator';
import EditUser from 'admin/EditUser';

import {loadByID} from 'middleware/sa';

class AdminRead extends Component {

    constructor(props) {
        super();
        this.state = {
            article: {}
        };
    }

    componentDidMount() {
        console.log("componentDidMount", this.props.article)
        let { table,index } = this.props.params;

        //query and set setState
        loadByID(table, index, function (err, res) {
            // Do something
            if (err || !res || res.body.length == 0) {
                //this.props.params.hasMore = false;
                this.setState({hasMore: false});
            } else {
                console.log("loadByID --> ", res.body);
                this.setState({article: res.body});
            }
        }.bind(this));

    }

    render() {
        let { article } = this.state;
        if (!article.id) {
            return (
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='thumbnail article text-center'>Loading <i className='fa fa-cog fa-spin'></i></div>
                </div>
            )
        }
        console.log("render --> ", article);
        var helmet = <Helmet
            htmlAttributes={{"lang": "en"}} // amp takes no value
            title={`Latest Comments - Commentator Profile -> @${article.title} `}
            titleTemplate="Comentarismo.com - %s"
            meta={[
                    {"name": "description", "content": `Find all comments for @${article.title} - the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "comments"},
                    {"property": "og:image", "content": '/static/img/comentarismo-extra-mini-logo.png'}
                ]}
        />;

        if (this.props.params.table == "news") {
            return (
                <div>
                    {helmet}
                    <EditNews article={article}/>
                </div>
            )
        } else if (this.props.params.table == "commentaries") {
            return (
                <div>
                    {helmet}
                    <EditCommentaries article={article}/>
                </div>
            )
        } else if (this.props.params.table == "commentator") {
            return (
                <div>
                    {helmet}
                    <EditCommentator article={article}/>
                </div>
            )
        } else if (this.props.params.table == "user") {
            return (
                <div>
                    {helmet}
                    <EditUser article={article}/>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    console.log("mapStateToProps");
    console.log(state.adminDetail);
    return {article: state.adminDetail}
}

AdminRead.propTypes = {
    article: PropTypes.object.isRequired
};

export { AdminRead }

export default connect(mapStateToProps, {loadAdminDetail})(AdminRead)
