import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Commentators extends Component {
    render() {
        return (
            <div>
                Commentators component
                {
                    this.props.commentators.map((q)=> {
                        return (
                            <div key={q.id}>
                                <p>Last seen: {q.maxDate}</p>
                                <Link to={`/commentators/${q.id}`}> { q.nick }</Link>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

Commentators.propTypes = {
    commentators: PropTypes.array.isRequired
}

export default Commentators
