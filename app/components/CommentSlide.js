import React from 'react';
import {XDiv} from 'components/XDiv';
import {ShareNetworks} from 'components/ShareNetworks';
import Date from "components/Date";
import Icon from "components/Icon";
import Sentiment from "components/Sentiment";

//import config from 'config'
//var host = config.BASE_URL;

var CommentSlide = React.createClass({
    render: function () {
        let { comment } = this.props;

        if(!comment){
            comment = {}
        }
        return (
            <div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">

                        <div className="facts-box testimonial-cta">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="col-md-1">
                                        <Icon nick={comment.nick} size={50}/>
                                    </div>
                                    <div className="col-md-11">
                                        <div className="text-blue">
                                            <a href={`/news/${comment.titleurlize}`} target="_blank">
                                                <XDiv text={comment.title}/>
                                                <Date date={comment.date}/>
                                                <Sentiment sentiment={comment.sentiment} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <XDiv text={"<b>"+comment.comment+"</b>"}/>

                                        <span className="btn-default">
                                            <span className="text-colored"><h1><XDiv text={"@"+comment.nick}/></h1></span>
                                        </span>
                                    </div>
                                    <ShareNetworks comment={comment}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

//href={`${host}/commentators/${comment.nick}`}

export { CommentSlide }
