import React, { Component,ReactClass,PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

var MainNavbar = require('components/MainNavbar');
import Helmet from "react-helmet";

import { loadIntroDetail } from 'actions/intro'

import {SearchCommentsList} from 'components/SearchCommentsList';

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
const searchkit = new SearchkitManager("http://elk.comentarismo.com/_all");


class Search extends Component {

    componentDidMount() {

    }

    render() {

        var searcbox = "";
        if (typeof window !== 'undefined') {

            searcbox = <SearchkitProvider searchkit={searchkit}>

                <Layout>
                    <TopBar>
                        <SearchBox
                            autofocus={false}
                            searchThrottleTime={500}
                            searchOnChange={true}
                            prefixQueryFields={["nick^5","genre^5","operator^5","title^10","language^5"]}/>
                    </TopBar>
                    <LayoutBody>
                        <SideBar>
                            <HierarchicalMenuFilter
                                fields={["new_val.operator"]}
                                title="Source"
                                id="new_val.operator"/>
                            <RefinementListFilter
                                id="new_val.nick"
                                title="Author"
                                field="new_val.nick"
                                operator="AND"
                                size={10}/>
                        </SideBar>
                        <LayoutResults>
                            <ActionBar>

                                <ActionBarRow>
                                    <HitsStats/>
                                </ActionBarRow>

                                <ActionBarRow>
                                    <SelectedFilters/>
                                    <ResetFilters/>
                                </ActionBarRow>

                            </ActionBar>
                            <Pagination showNumbers={true}/>

                            <Hits mod="sk-hits-grid" hitsPerPage={10} listComponent={SearchCommentsList}
                                  sourceFilter={["new_val.title", "new_val.comment", "new_val.nick","new_val.operator"]}/>
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
