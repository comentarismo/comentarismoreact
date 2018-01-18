import React, {Component, ReactClass} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';


import {loadIntroDetail} from 'actions/intro'

import {SearchListJCP} from 'components/SearchListJCP';

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
    <div className={props.bemBlocks.option().state({selected: props.selected}).mix(props.bemBlocks.container("item"))}
         onClick={props.onClick}>
        <div className={props.bemBlocks.option("text")}><Sentiment sentiment={props.label}/></div>
        <div className={props.bemBlocks.option("count")}>{props.count}</div>
    </div>
);

const SelectedFilter = (props) => (
    <div className={props.bemBlocks.option()
        .mix(props.bemBlocks.container("item"))
        .mix(`selected-filter--${props.filterId}`)()}>
        <div className={props.bemBlocks.option("name")}>{props.labelKey}: {props.labelKey == "Sentiment" ?
            <Sentiment sentiment={props.labelValue}/> : props.labelValue}</div>
        <div className={props.bemBlocks.option("remove-action")} onClick={props.removeFilter}>x</div>
    </div>
);

const customHitStats = (props) => {
    const {bemBlocks, hitsCount, timeTaken} = props;

    return (
        <div className={bemBlocks.container()} data-qa="hits-stats">
            <div className={bemBlocks.container("info")} data-qa="info">
                We found {hitsCount} results in {timeTaken}ms!

            </div>
        </div>
    )
};
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

class SearchJCP extends Component {

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
            if (q) {
                searchOnLoad = true;
            }

            // var url2 = "http://localhost:3000/jcp/_all";
            var targetAPI = "//api.comentarismo.com/jcp/_all";

            const searchkit = new SearchkitManager(targetAPI, {
                searchOnLoad: searchOnLoad,
                useHistory: true,
                httpHeaders: {
                    "COMENTARISMO-KEY": "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY="
                },
            });
            searcbox = <SearchkitProvider searchkit={searchkit}>
                <Layout>
                    <TopBar>
                        <SearchBox
                            autofocus={false}
                            searchThrottleTime={1500}
                            searchOnChange={true}
                            prefixQueryFields={["html", "operator", "link", "slug", "summary", "glossary", "tags", "tagsCount", "source"]}/>
                    </TopBar>
                    <LayoutBody>
                        <SideBar>
                            <RefinementListFilter
                                id="summary"
                                title="Summary"
                                field="Summary"
                                operator="AND"
                                size={3}/>

                            <RefinementListFilter
                                id="glossary"
                                title="Glossary"
                                field="glossary"
                                operator="AND"
                                size={3}/>

                            <RefinementListFilter
                                id="tags"
                                title="Tags"
                                field="tags"
                                operator="AND"
                                size={3}/>

                            <RefinementListFilter
                                id="slug"
                                title="Slug"
                                field="slug"
                                operator="AND"
                                size={3}/>

                            <HierarchicalMenuFilter
                                fields={["operator"]}
                                title="Source"
                                id="operator" size={1}/>


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

                            <Hits mod="sk-hits-grid" hitsPerPage={50} listComponent={SearchListJCP}
                                  sourceFilter={["html", "operator", "summary", "link", "slug", "glossary", "tags", "tagsCount", "source"]}
                                  highlightFields={["html", "operator", "summary","slug", "link", "glossary", "tags", "tagsCount", "source"]}/>
                            <NoHits/>
                            <Pagination showNumbers={true}/>

                        </LayoutResults>
                    </LayoutBody>
                </Layout>
            </SearchkitProvider>
        }

        return (
            <div>
                {searcbox}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {comment: state.introDetail}
}

SearchJCP.propTypes = {
    comment: PropTypes.object,
};


export {SearchJCP}
export default connect(mapStateToProps, {loadIntroDetail})(SearchJCP)
