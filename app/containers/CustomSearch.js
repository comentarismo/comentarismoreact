import React, {Component, ReactClass, PropTypes} from 'react';

import {connect} from 'react-redux';


import {loadIntroDetail} from 'actions/intro'

import {SearchCommentsList} from 'components/SearchCommentsList';
var analytics = require('ga-browser')();
import Sentiment from "components/Sentiment";

import {
	SearchBox,
	SearchkitProvider,
	SearchkitManager,
	InitialLoader,
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

const InitialLoaderComponent = (props) => (
	<div>
		loading please wait...
	</div>
)

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
function gup(name, url) {
	if (!url) url = location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	return results == null ? null : results[1];
}

class CustomSearch extends Component {
	
	componentDidMount() {
		analytics('create', 'UA-51773618-1', 'auto');
		setInterval(function () {
			ga('send', 'event', 'ping', window.location.href, {}, 0)
		}, 10000);
	}

	
	render() {
		
		let removalFn = searchkit.addResultsListener((results)=>{
			//do something with results
		})
		
		var searcbox = "";
		if (typeof window !== 'undefined') {
			var searchOnLoad = false;
			var q = gup("q");
			// console.log("Arguments -> ", q);
			if (q) {
				searchOnLoad = true;
			}
			
			const searchkit = new SearchkitManager("//api.comentarismo.com/elk/_all", {
				searchOnLoad: searchOnLoad,
				useHistory: true,
				httpHeaders: {
					"COMENTARISMO-KEY": "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY="
				},
			});
			
			const style = {
				background: 'hsl(0, 0%, 96%) !important', color:'black'
			};
			
			searcbox = <SearchkitProvider searchkit={searchkit}>
				<Layout size="l">
					<SearchBox style={style}
					           autofocus={true}
					           searchThrottleTime={1500}
					           searchOnChange={true}
					           prefixQueryFields={["nick", "genre", "operator", "title", "language"]}/>
					<LayoutBody >
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
								fields={["operator"]}
								title="Source"
								id="operator"/>
						
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
							
							<Hits mod="sk-hits-list" hitsPerPage={5} listComponent={SearchCommentsList}
							      highlightFields={["comment", "nick"]}
							      sourceFilter={["comment", "nick","operator","titleurlize","sentiment"]}/>
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

CustomSearch.propTypes = {
	comment: PropTypes.object,
};


export {CustomSearch}
export default connect(mapStateToProps, {loadIntroDetail})(CustomSearch)
