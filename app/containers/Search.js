import React, { Component, ReactClass} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { loadIntroDetail } from 'actions/intro'

import { SearchNewsCommentsList } from 'components/SearchCommentsList'

var analytics = require('ga-browser')()
 import Sentiment from 'components/Sentiment'

import {
    SearchBox,
    SearchkitProvider,
    SearchkitManager,
    SideBar,
    TopBar,
    Layout,
    LayoutBody,
    LayoutResults,
    ActionBar,
    ActionBarRow,
    TagCloud,
    RefinementListFilter,
    NoHits,
    Hits,
    HitsStats,
    SearchkitComponent,
    SelectedFilters,
    MenuFilter,
    HierarchicalMenuFilter,
    Pagination,
    ResetFilters,
    ViewSwitcherToggle,
    SortingSelector,
    ViewSwitcherHits
} from 'searchkit'



const RefinementOption = (props) => (
    <div className={props.bemBlocks.option().
        state({selected: props.selected}).
        mix(props.bemBlocks.container('item'))}
         onClick={props.onClick}>
        <div className={props.bemBlocks.option('text')}><Sentiment
            sentiment={props.label}/></div>
        <div className={props.bemBlocks.option('count')}>{props.count}</div>
    </div>
)

const SelectedFilter = (props) => (
    <div className={props.bemBlocks.option().
        mix(props.bemBlocks.container('item')).
        mix(`selected-filter--${props.filterId}`)}>
        <div className={props.bemBlocks.option(
            'name')}>{props.labelKey}: {props.labelKey === 'Sentiment' ?
            <Sentiment sentiment={props.labelValue}/> : props.labelValue}</div>
        <div className={props.bemBlocks.option('remove-action')}
             onClick={props.removeFilter}>x
        </div>
    </div>
)

const customHitStats = (props) => {
    const {bemBlocks, hitsCount, timeTaken} = props
    
    return (
        <div className={bemBlocks.container()} data-qa="hits-stats">
            <div className={bemBlocks.container('info')} data-qa="info">
                We found {hitsCount} comments ({timeTaken} milliseconds)
            
            </div>
        </div>
    )
}

function gup (name, url) {
    // console.log('GUP typeof window ', typeof window);
    if (typeof window === 'undefined') {
        return null
    }

    if (!url) url = location.href
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
    var regexS = '[\\?&]' + name + '=([^&#]*)'
    var regex = new RegExp(regexS)
    var results = regex.exec(url)
    return results == null ? null : results[1]
}

class Search extends Component {
    
    componentDidMount () {
        analytics('create', 'UA-51773618-1', 'auto')
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 10000)
    }
    
    render () {


        
        var searcbox = ''
        let isServer = typeof window === 'undefined'
        
        var searchOnLoad = false
        var q = gup('q')
        // console.log("Arguments -> ", q);
        if (q) {
            searchOnLoad = true
        }
        var  type = this.props.type;
        // console.log('type', type)

        var searchOnTypeUrl = ''
        switch (type) {
            case 'news':
                //searchOnTypeUrl = 'http://localhost:9000/elk/_all/commentaries';

                searchOnTypeUrl = 'https://apis.comentarismo.com/elk/_all/commentaries';
                break
            case 'product':
                //searchOnTypeUrl = 'http://localhost:9000/elk/_all/commentaries_product';

                searchOnTypeUrl = 'https://apis.comentarismo.com/elk/_all/commentaries_product';
                break
            default:
                // searchOnTypeUrl = 'http://localhost:9000/elk/_all/';

               searchOnTypeUrl = 'https://apis.comentarismo.com/elk/_all/';
                break

        }

        // console.log('let searchOnTypeUrl = ',searchOnTypeUrl);
        const searchkit = new SearchkitManager(searchOnTypeUrl, {
            // const searchkit = new SearchkitManager(
            //     'https://apis.comentarismo.com/elk/_all', {
            searchOnLoad: searchOnLoad,
            useHistory: !isServer,
            httpHeaders: {
                // "COMENTARISMO-KEY": "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY="
            },
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
        
        const style = {
            background: 'hsla(0, 0%, 100%, 1.15) !important', color: 'black',
        }
        
        searcbox = <SearchkitProvider searchkit={searchkit}>
            <Layout>
                <SearchBox style={style}
                           autofocus={true}
                           searchThrottleTime={1500}
                           searchOnChange={true}
                           prefixQueryFields={[
                               'nick',
                               'genre',
                               'comment',
                               'operator',
                               'title',
                               'languages']}/>
                <LayoutBody>
                    <SideBar>
                        
                        <RefinementListFilter
                            id="languages"
                            title="Language"
                            field="languages"
                            operator="AND"
                            size={2}/>
                        
                        <RefinementListFilter
                            id="nick"
                            title="Author"
                            field="nick"
                            operator="AND"
                            size={5}/>

                        <HierarchicalMenuFilter
                            fields={['categories']}
                            title="Categories"
                            id="categories"/>
                        
                        <HierarchicalMenuFilter
                            fields={['operator']}
                            title="Source"
                            id="operator"/>
                        
                        <RefinementListFilter
                            id="sentiment"
                            title="Sentiment"
                            field="sentiment"
                            operator="AND"
                            size={5} itemComponent={RefinementOption}/>
                    
                    </SideBar>
                    
                    <LayoutResults>
                        
                        <ActionBar>
                            
                            <ActionBarRow>
                                <HitsStats component={customHitStats}/>
                                
                                <ViewSwitcherToggle/>
                                <SortingSelector options={[
                                    {
                                        label: 'Latest Comments',
                                        field: 'date',
                                        order: 'desc',
                                        defaultOption: true,
                                    },
                                    {
                                        label: 'Earliest Comments',
                                        field: 'date',
                                        order: 'asc',
                                    },
                                    {
                                        label: 'Sentiment (Bad to Good)',
                                        field: 'sentiment',
                                        order: 'asc',
                                    },
                                    {
                                        label: 'Sentiment (Good to Bad)',
                                        field: 'sentiment',
                                        order: 'desc',
                                    },
                                
                                ]}/>
                            </ActionBarRow>
                            
                            <ActionBarRow>
                                <SelectedFilters
                                    itemComponent={SelectedFilter}/>
                                <ResetFilters/>
                            </ActionBarRow>
                        
                        </ActionBar>

                        <Hits mod="" hitsPerPage={10}
                              listComponent={SearchNewsCommentsList}
                              itemComponent={this.props.type}
                              highlightFields={[
                                  'comment',
                                  'nick',
                                  'title',
                                  'sentiment',
                                  'date']}
                              sourceFilter={[
                                  'title',
                                  'comment',
                                  'nick',
                                  'operator',
                                  'titleurlize',
                                  'sentiment', 'date']}/>
                        
                        <NoHits suggestionField={'title'}/>
                        <Pagination showNumbers={true}/>
                    
                    </LayoutResults>
                </LayoutBody>
            </Layout>
        </SearchkitProvider>
        
        return (
            <div>
                {searcbox}
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {comment: state.introDetail}
}

Search.propTypes = {
    comment: PropTypes.object,

}

export { Search }
export default connect(mapStateToProps, {loadIntroDetail})(Search)
