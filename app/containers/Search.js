import React, { Component,ReactClass,PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

var MainNavbar = require('components/MainNavbar');
import Helmet from "react-helmet";

import { loadIntroDetail } from 'actions/intro'

import {SearchCommentsList} from 'components/SearchCommentsList';
var analytics = require('ga-browser')();
import Sentiment from "components/Sentiment";

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
    MovieHitsGridItem,
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
    ResetFilters
} from "searchkit";


const RefinementOption = (props) => (
    <div className={props.bemBlocks.option().state({selected:props.selected}).mix(props.bemBlocks.container("item"))} onClick={props.onClick}>
        <div className={props.bemBlocks.option("text")}><Sentiment sentiment={props.label} /></div>
        <div className={props.bemBlocks.option("count")}>{props.count}</div>
    </div>
);

const SelectedFilter = (props) => (
    <div className={props.bemBlocks.option()
    .mix(props.bemBlocks.container("item"))
    .mix(`selected-filter--${props.filterId}`)()}>
        <div className={props.bemBlocks.option("name")}>{props.labelKey}: {props.labelKey =="Sentiment" ? <Sentiment sentiment={props.labelValue} /> : props.labelValue}</div>
        <div className={props.bemBlocks.option("remove-action")} onClick={props.removeFilter}>x</div>
    </div>
);

const customHitStats = (props) => {
    const {bemBlocks, hitsCount, timeTaken} = props;

    return (
        <div className={bemBlocks.container()} data-qa="hits-stats">
            <div className={bemBlocks.container("info")} data-qa="info">
                We found {hitsCount} comments in {timeTaken}ms!

            </div>
        </div>
    )
};
function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

class Search extends Component {

    componentDidMount() {
        analytics('create', 'UA-51773618-1', 'auto');
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 10000);
    }

    render() {

        var searcbox = "";
        if (typeof window !== 'undefined') {
            var searchOnLoad = false;
            var q = gup("q");
            if(q){
                searchOnLoad = true;
            }

            const searchkit = new SearchkitManager("http://elk.comentarismo.com/_all",{
                searchOnLoad:searchOnLoad,
                useHistory:true
            });
            searcbox = <SearchkitProvider searchkit={searchkit} >
                <Layout>
                    <TopBar>
                        <SearchBox
                            autofocus={false}
                            searchThrottleTime={1500}
                            searchOnChange={true}
                            prefixQueryFields={["nick","genre","operator","title","language","sentiment"]}/>
                    </TopBar>
                    <LayoutBody>
                        <SideBar>
                            <RefinementListFilter
                                id="new_val.languages"
                                title="Language"
                                field="new_val.languages"
                                operator="AND"
                                size={1}/>
                            <RefinementListFilter
                                id="new_val.nick"
                                title="Author"
                                field="new_val.nick"
                                operator="AND"
                                size={5}/>
                            <RefinementListFilter
                                id="new_val.sentiment"
                                title="Sentiment"
                                field="new_val.sentiment"
                                operator="AND"
                                size={5} itemComponent={RefinementOption}/>

                            <HierarchicalMenuFilter
                                fields={["new_val.operator"]}
                                title="Source"
                                id="new_val.operator"/>
                        </SideBar>
                        <LayoutResults>

                            <ActionBar>

                                <ActionBarRow>
                                    <HitsStats component={customHitStats}/>
                                </ActionBarRow>

                                <ActionBarRow>
                                    <SelectedFilters itemComponent={SelectedFilter}/>
                                    <ResetFilters/>
                                </ActionBarRow>

                            </ActionBar>
                            <Pagination showNumbers={true}/>

                            <Hits mod="sk-hits-grid" hitsPerPage={10} listComponent={SearchCommentsList}
                                  sourceFilter={["new_val.title", "new_val.comment", "new_val.nick","new_val.operator","new_val.sentiment"]}/>
                            <NoHits/>
                            <Pagination showNumbers={true}/>

                        </LayoutResults>
                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        }

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Comentarismo Search Engine - Search Any news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
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

Search.propTypes = {
    comment: PropTypes.object.isRequired,
};


export { Search }
export default connect(mapStateToProps, {loadIntroDetail})(Search)
