import React, {Component, ReactClass, PropTypes} from 'react';

import * as _ from "lodash";

import Icon from "components/Icon";

class SearchListJCP extends React.Component {

    render() {
        const {hits} = this.props;

        if (!hits || hits.length == 0) {
            return ("")
        }
        return (
            <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
                <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Summary</th>
                        <th>Tags Count</th>
                        <th>Glossary</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(hits, hit => (

                        <tr key={hit.slug}>
                            <td><Icon nick={hit._source.slug ? hit._source.slug : ""}
                                      size={40}/></td>
                            <td><a href={hit._source.link }>{hit._source.slug} </a>
                                {hit._source ? (hit._source.summary && hit._source.summary.length > 1000 ? hit._source.summary.substring(0, 1000) + "..." : hit._source.summary) : ""}
                            </td>
                            <td>{hit._source ? (hit._source.tagsCount && hit._source.tagsCount.length > 20 ? JSON.stringify(hit._source.tagsCount.splice(0, 20)) + "..." : JSON.stringify(hit._source.tagsCount)) : ""}</td>
                            <td>{hit._source ? (hit._source.glossary && hit._source.glossary.length > 100 ? JSON.stringify(hit._source.glossary.splice(0, 100)) + "..." : JSON.stringify(hit._source.glossary)) : ""}</td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )

    }
}

export {SearchListJCP}