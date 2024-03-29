import React, {Component} from 'util/safe-react';
import {AutoComplete}     from 'material-ui';
import JSONP                from 'jsonp';
const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';
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
		return <div  key={`div-${this.props.id}`}  style={{ display: 'inline-flex', width: '100%'}}>
			<AutoComplete key={`autocomplete-${this.props.id}`}  textFieldStyle={{ height: '84px'}}
				hintText={this.props.hintText}
	          fullWidth
			searchText={this.state.inputValue}
			floatingLabelText={this.props.placeHolder}
			filter={AutoComplete.noFilter}
			openOnFocus={true}
			dataSource={this.state.dataSource}
			onUpdateInput={this.onUpdateInput}
			onNewRequest={this.onNewRequest}/>
			<button key={`button-${this.props.id}`}  onClick={this.onNewRequest} style={{height: '76px', width: '152px', color: '#fff', background: '#656972', borderRadius: '0px'}}>SEARCH</button>
		</div>

	}
}


export default Autocomplete;