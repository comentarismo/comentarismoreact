import React, { Component,ReactClass } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Helmet from "react-helmet";

import { loadIntroDetail } from 'actions/intro'

import {Search} from './Search'

class SearchComponentProduct extends Component {

    render() {

        var searcbox = <Search type="product" />

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Comentarismo Search Engine - Search Any Product, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Search Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": "Welcome to Search Comentarismo"},
                    {"property": "og:type", "content": "article"}
                ]}
                />

                {searcbox}

                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2017 Comentarismo.com</p>
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

SearchComponentProduct.propTypes = {
    comment: PropTypes.object.isRequired,
};


export { SearchComponentProduct }
export default connect(mapStateToProps, {loadIntroDetail})(SearchComponentProduct)
