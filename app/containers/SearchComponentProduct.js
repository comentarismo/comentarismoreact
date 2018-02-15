import React, { Component, ReactClass } from 'util/safe-react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'material-ui/Tabs'

import Helmet from 'react-helmet'

import { loadSearchResults } from 'actions/search'

import { Search } from './Search'
import {
    SearchkitManager,
} from 'searchkit'
import { getSearchHost, gup } from 'util/searchutils'
import Promise from 'bluebird'
const index = 'product'
class SearchComponentProduct extends Component {
    
    static fetchData ({store, query}) {
        // console.log('SearchComponent fetchData, ', query)
        
        if (query) {
            return store.dispatch(loadSearchResults({index, query}))
        } else {
            return Promise.resolve()
        }
    }
    
    render () {
        
        let isServer = typeof window === 'undefined'
        
        let searchOnLoad = false
        
        
        let q = gup('q')
        if (q) {
            searchOnLoad = true
        }
        
        var searchOnTypeUrl = getSearchHost(index)
        
        let results = this.props.searchResults
            ? this.props.searchResults.results
            : {}
        let state = this.props.searchResults
            ? this.props.searchResults.state
            : {}
        
        // console.log('GOT RESULTS ', results, state, this.props.searchResults)
        
        const searchkit = new SearchkitManager(searchOnTypeUrl, {
            // const searchkit = new SearchkitManager(
            //     'https://apis.comentarismo.com/elk/_all', {
            searchOnLoad: searchOnLoad,
            useHistory: !isServer,
            httpHeaders: {
                // "COMENTARISMO-KEY": "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY="
            },
        }, {
            results: results,
            state: state,
        })
        
        searchkit.setQueryProcessor((plainQueryObject) => {
            // console.log('queryProcessor, ', plainQueryObject)
            if (plainQueryObject.filter) {
                // hot fix for ES5
                plainQueryObject.post_filter = plainQueryObject.filter
                delete plainQueryObject.filter
            }
            return plainQueryObject
        })
        
        // console.log('SearchComponent, render, ', q)
        
        var searcbox = <Search searchkit={searchkit}
                               type="product"
                               placeholder="Search for comments on Products. (try: playstation)"/>
        
        return (
            <div>
                <Helmet
                    htmlAttributes={{'lang': 'en'}} // amp takes no value
                    title="Comentarismo Search Engine - Search Any Products, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Search Comentarismo.com - %s"
                    meta={[
                        {
                            'name': 'description',
                            'content': 'Welcome to Search on Products - Comentarismo',
                        },
                        {
                            'property': 'og:type',
                            'content': 'article',
                        },
                    ]}
                />
                
                <Tabs style={{height: '135px', paddingBottom: '75px'}}
                      initialSelectedIndex={1}>
                    <Tab label="News" onActive={function () {
                        document.location.href = '/search'
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px',
                    }}>
                    
                    </Tab>
                    
                    <Tab onActive={function () {
                        document.location.href = '/search/product/'
                    }} label="Products" style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px',
                    }}>
                        {searcbox}
                    </Tab>
                </Tabs>
                
                
                <div className="clearfix"/>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2017
                                    Comentarismo.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        searchResults: state.loadSearchResults,
    }
}

SearchComponentProduct.propTypes = {
    searchResults: PropTypes.object,
}

export { SearchComponentProduct }
export default connect(mapStateToProps, {loadSearchResults})(
    SearchComponentProduct)
