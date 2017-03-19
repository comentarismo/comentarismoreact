import React, {Component} from 'react'
import {AutoComplete}     from 'material-ui';
import JSONP                from 'jsonp';
const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
var analytics = require('ga-browser')();

class Autocomplete extends Component {
	constructor(props) {
		super(props);
		this.onUpdateInput = this.onUpdateInput.bind(this);
		this.onNewRequest = this.onNewRequest.bind(this);
		this.state = {
			dataSource: [],
			inputValue: ''
		}
	}
	
	componentDidMount() {
		analytics('create', 'UA-51773618-1', 'auto');
	}
	
	performSearch() {
		const
			self = this,
			url = googleAutoSuggestURL + this.state.inputValue;
		
		if (this.state.inputValue !== '') {
			ga('send', 'event', 'performSearch', this.state.inputValue, {}, 0)
			JSONP(url, function (error, data) {
				let searchResults, retrievedSearchTerms;
				
				if (error) return console.log(error);
				
				searchResults = data[1];
				
				retrievedSearchTerms = searchResults.map(function (result) {
					return result[0];
				});
				
				self.setState({
					dataSource: retrievedSearchTerms
				});
			});
		}
	}
	
	onUpdateInput(inputValue) {
		const self = this;
		
		this.setState({
			inputValue: inputValue
		}, function () {
			self.performSearch();
		});
	}
	
	onNewRequest() {
		var q = `/search?q=${this.state.inputValue}`
		ga('send', 'event', 'onNewRequest', q, {}, 0)
		// console.log("onNewRequest() --> ",searchTerm,q);
		document.location.href = q;
	}
	
	render() {
		return <Card>
			<CardTitle title={<SearchIcon/>} subtitle={<AutoComplete hintText="Search for products, news, youtube videos, commentators, and more …"     fullWidth
			searchText={this.state.inputValue}
			floatingLabelText={this.props.placeHolder}
			filter={AutoComplete.noFilter}
			openOnFocus={true}
			dataSource={this.state.dataSource}
			onUpdateInput={this.onUpdateInput}
			onNewRequest={this.onNewRequest}/> } />
			
		</Card>
		
	}
}


export default Autocomplete;