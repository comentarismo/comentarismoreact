import React, { Component,ReactClass,PropTypes } from 'react';

import * as _ from "lodash";

import Icon from "components/Icon"

class SearchCommentsList extends React.Component {

    render() {
        const { hits } = this.props;

        if(!hits || hits.length == 0){
            return ("")
        }

        return (
            <div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
                <table className="sk-table sk-table-striped" style={{width: '100%', boxSizing: 'border-box'}}>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Author</th>
                        <th>Comment</th>
                        <th>Source</th>
                        <th>Title</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(hits, hit => (

                        <tr key={hit._id}>
                            <td><Icon nick={hit._source.new_val ? hit._source.new_val.nick : ""} size={40}/>
                            </td>
                            <td>{hit._source.new_val? hit._source.new_val.nick : ""}</td>
                            <td>{hit._source.new_val? hit._source.new_val.comment : ""}</td>
                            <td>{hit._source.new_val? hit._source.new_val.operator : ""}</td>
                            <td>{hit._source.new_val? (hit._source.new_val.title && hit._source.new_val.title.length > 35 ? hit._source.new_val.title.substring(0,35) + "..." : hit._source.new_val.title) : ""}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export { SearchCommentsList }