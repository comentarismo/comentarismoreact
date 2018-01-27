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
			<div>
				<table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
					<thead>
					<tr>
						<th>Source</th>
						<th>Author</th>
						<th>Comment</th>
						<th>Sentiment</th>
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
								<td>
									<div
									   dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.nick", _hit.nick)}}/>
								</td>

								<td>
                                    <a target="_blank" href={`/news/${_hit.titleurlize}`}
                                       dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.title", _hit.title)}}/>
                                    <div
                                        dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.comment", _hit.comment)}}/>
								</td>
								<td>
                                    <Sentiment sentiment={hit && hit._source ? hit._source.sentiment : ""}/>
								</td>
								<td>
									<Date style={{fontSize: '14px'}} date={_.get(_hit, "highlight.title", _hit.date)}/>
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