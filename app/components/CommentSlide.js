import React from 'react';
import {XDiv} from 'components/XDiv';
import {ShareNetworks} from 'components/ShareNetworks';

//import config from 'config'
//var host = config.BASE_URL;

var CommentSlide = React.createClass({
    render: function () {
        let { comment } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div className="facts-box testimonial-cta">
                            <div className="row">
                                <div className="col-sm-12">
                                    <img src="/static/img/comentarismo-extra-mini-logo.png" alt="img"
                                         className="img-circle img-thumbnail"/>
                                    <div className="text-blue">
                                        <a href={`/news/${comment.titleurlize}`} target="_blank" >
                                            <XDiv text={comment.title}/>
                                        </a>
                                    </div>
                                    <XDiv text={"<b>"+comment.comment+"</b>"}/>
                                    <span className="btn-default">
                                        <span className="text-colored"><h1><XDiv text={"@"+comment.nick}/></h1></span>
                                    </span>
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
