import React, {Component, ReactClass} from 'react';
import PropTypes from 'prop-types';
import * as _ from "lodash";

import Sentiment from "components/Sentiment";
import Date from "components/Date"

class SearchNewsCommentsList extends React.Component {
	
	render() {
		const {hits} = this.props;
		
		if (!hits || hits.length === 0) {
			return ("")
		}
		
		return (
			<div style={{
				width: '100%', boxSizing: 'border-box', padding: 8, em: {
					backgroundColor: 'lightyellow',
					color: 'maroon',
					fontWeight: 'bold'
				}
				
			}}>
				<table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
					<thead>
					<tr>
						<th></th>
						<th>Author</th>
						<th>Comment</th>
						<th>News</th>
						<th>Date</th>
					</tr>
					</thead>
					<tbody>
					{_.map(hits, hit => {
						const _hit = _.extend({}, hit._source, hit.highlight)
						return (
							
							<tr key={_hit._id + _hit.nick}>
								<td><img style={{height: '24px', width: '24px'}}
								         src={`/static/img/sources/${_hit.operator}.png`}/></td>
								<td><b>
									<div
									   dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.nick", _hit.nick)}}/>
								</b></td>
								
								<td>
									<Sentiment sentiment={hit._source ? hit._source.sentiment : ""}/>
									<b><div
									      dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.comment", _hit.comment)}}/></b>
								</td>
								<td><b>
									<a target="_blank" href={`/news/${_hit.titleurlize}`} className="sk-hits-grid-hit"
									   dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.title", _hit.title)}}/>
								</b>
								</td>
								<td><b>
									<Date style={{fontSize: '14px'}} date={_.get(_hit, "highlight.title", _hit.date)}/>
									
								</b>
								</td>
							</tr>  )
					})}
					</tbody>
				</table>
			</div>
		)
	}
}

export {SearchNewsCommentsList}