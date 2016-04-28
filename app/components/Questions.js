import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Questions extends Component {
    render() {
        return (
            <div>
                Questions component
                {
                    this.props.questions.map((q)=> {
                        return (
                            <div key={q.id}>
                                <p>Last seen: {q.maxDate}</p>
                                <Link to={`/questions/${q.id}`}> { q.nick }</Link>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

Questions.propTypes = {
    questions: PropTypes.array.isRequired
}

export default Questions
