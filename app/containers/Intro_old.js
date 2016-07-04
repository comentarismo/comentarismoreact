import React, { Component,ReactClass,PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

var MainNavbar = require('components/MainNavbar');
import Helmet from "react-helmet";

import {PlayComment} from './PlayComment';
import { loadIntroDetail } from 'actions/intro'

import WorldRank from 'components/WorldRank';
import LoginStore from 'store/LoginStore';

class Intro extends Component {
    static fetchData({ store, params }) {
        var index = params.index || "languages";
        var value = params.value || "english";
        var skip = params.skip || "0";
        var limit = params.limit || "50";

        return store.dispatch(loadIntroDetail({index, value, skip, limit}))
    }

    componentDidMount() {

        if (typeof window !== 'undefined') {
            console.log("navigator.language: "+navigator.language);
            console.log("navigator.userLanguage: "+navigator.userLanguage);
            //console.log("navigator.browserLanguage: "+navigator.browserLanguage);
            //console.log("navigator.userAgent: "+navigator.userAgent);

            var userLang = navigator.language || navigator.userLanguage || navigator.browserLanguage;
            console.log('detected user language --> ' + userLang);
            var targetLang = "";
            if (userLang.indexOf("pt") !== -1) {
                targetLang = "portuguese";
            } else if (userLang.indexOf("es") !== -1) {
                targetLang = "spanish";
            } else if (userLang.indexOf("it") !== -1) {
                targetLang = "italian";
            } else if (userLang.indexOf("fr") !== -1) {
                targetLang = "french";
            } else if (userLang.indexOf("russian") !== -1) {
                targetLang = "russian";
            } else if (userLang.indexOf("croatian") !== -1) {
                targetLang = "croatian";
            }else {
                console.log("default lang will be used");
                return;
            }

            var index = "languages";
            var value = targetLang;
            var skip =  "0";
            var limit = "50";
            console.log("will re-load comments on the user lang. ");
            this.props.loadIntroDetail({index, value, skip, limit});
        }
    }


    render() {//languages/english/0/5/
        let { comment } = this.props;

        var index = this.props.params.index || "languages";
        var value = this.props.params.value || "english";
        var skip = this.props.params.skip || "0";
        var limit = this.props.params.limit || "50";

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
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>

                <div className="home-wrapper text-center">
                    <p>*NEW Comentarismo Play, use the controller below to read unlimited comments</p>
                    <p>{LoginStore.isLoggedIn() ? 'Welcome back ' + JSON.stringify(LoginStore.user.username) : ''}</p>
                </div>
                <PlayComment playing={true} comment={comment.comment} index={index} value={value} skip={skip} limit={limit} playingtimeout={10000}/>

                <section className="section home" id="home">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2">
                                <div className="home-wrapper text-center">
                                    <p>Welcome to Comentarismo</p>
                                    <div className="text-tran-box">
                                        <h1 className="text-transparent">Start commenting and contribute to a better
                                            world</h1>
                                    </div>
                                    <a href="/news/languages/english" className="btn btn-dark">Read News</a>
                                    <br/><br/>
                                    <a href="/commentators/languages/english" className="btn btn-dark">Find
                                        Commentators</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <WorldRank alexarank={comment.alexa}/>

                <div className="clearfix"></div>
                <section className="section" id="features">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="features-box text-center">
                                    <div className="feature-icon">

                                    </div>
                                    <h3>Target group</h3>
                                    <p className="text-muted">
                                        Comentarismo is created for internet users all over the world who are passionate
                                        about reading other people’s comments on news and who like to engage in
                                        commenting and discussing stories on newspaper websites.
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="features-box text-center">
                                    <div className="feature-icon">
                                        <i className="pe-7s-light"></i>
                                    </div>
                                    <h3>Mission statement</h3>
                                    <p className="text-muted">We believe that a story does not end with its publication,
                                        but rather is a starting point for generating commentary and contributing by the
                                        public.</p>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="features-box text-center">
                                    <div className="feature-icon">
                                        <i className="pe-7s-display1"></i>
                                    </div>
                                    <h3>Website culture</h3>
                                    <p className="text-muted">Any internet user can read the website content, however if
                                        user wishes to comment or vote, registration is required. Once registered, user
                                        becomes member of Comentarismo community. Our users are commonly referred as
                                        “comentarismos”.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-10 col-sm-offset-1">
                                <img src="/static/img/comentarismo-bg-450-150.png" className="img-responsive"/>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section" id="clients">
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-sm-12">
                                <h2 className="title">Trusted by Thousands</h2>
                                <p className="slogan">Commentarismo support the following providers</p>
                                <ul className="list-inline client-list">
                                    <li><a href="" title="Facebook"><img src="/static/img/facebook.png" alt="clients"/></a>
                                    </li>
                                    <li><a href="" title="Google"><img src="/static/img/google.png" alt="clients"/></a>
                                    </li>
                                    <li><a href="" title="Twitter"><img src="/static/img/twitter.png"
                                                                        alt="clients"/></a></li>
                                    <li><a href="" title="Github"><img src="/static/img/github.png" alt="clients"/></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="clearfix"></div>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2">
                                <div className="facts-box testimonial-cta">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <img src="/static/img/comentarismo-extra-mini-logo.png" alt="img"
                                                 className="img-circle img-thumbnail"/>
                                            <p>"People want to learn because they want to get better. They want to be
                                                part of 'next' to learn their way into bigger opportunities." <span
                                                    className="text-colored">Jacques Panis</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2016 Comentarismo.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {comment: state.introDetail}
}

Intro.propTypes = {
    comment: PropTypes.object.isRequired,
};


export { Intro }
export default connect(mapStateToProps, {loadIntroDetail})(Intro)