import React, {Component, ReactClass} from 'util/safe-react';
import * as _ from "lodash";

import Sentiment from "components/Sentiment";
import Date from "components/Date"

class SearchCommentsList extends React.Component {
	
	render() {
		const {hits, itemComponent} = this.props;
		
		if (!hits || hits.length === 0) {
			return ("")
		}
		let counter = 0
		return (
			<div>
				<table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
					<thead>
					<tr>
						<th>Source</th>
						<th>Author</th>
						<th>Comment in News</th>
						<th>Sentiment</th>
						<th>Date</th>
					</tr>
					</thead>
					<tbody>
					{_.map(hits, hit => {
						const _hit = _.extend({}, hit._source, hit.highlight)
                        return (
							<tr key={(counter++) + _hit.nick}>
								<td><img style={{height: '24px', width: '24px'}}
								         src={`/static/img/sources/${_hit.operator}.png`}/></td>
								<td>
									<a target="_blank" href={`/${itemComponent}/${_hit.titleurlize}`}
									   dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.nick", _hit.nick)}}/>
								</td>

								<td>
                                    <a className="comment" target="_blank" href={`/${itemComponent}/${_hit.titleurlize}`}
                                       dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.comment", _hit.comment)}}/>
									<br/>
                                    <a className="news" target="_blank" href={`/${itemComponent}/${_hit.titleurlize}`}
                                        dangerouslySetInnerHTML={{__html: _.get(_hit, "highlight.title", _hit.title)}}/>
								</td>
								<td>
									<a target="_blank" href={`/${itemComponent}/${_hit.titleurlize}`}/>
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

export {SearchCommentsList}