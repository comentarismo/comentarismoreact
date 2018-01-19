import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardText,
} from 'material-ui/Card'
import Icon from 'components/Icon'
import Date from 'components/Date'
import Sentiment from 'components/Sentiment'

export default class CommentSingle extends React.Component {
    
    constructor (props) {
        super(props)
        this.state = {
            expanded: false,
        }
    }
    
    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded})
    }
    
    render () {
        var q = this.props.comment
        
        var date = q.date ? <Date date={q.date}/> : ""
        
        return (
            <Card expanded={this.state.expanded}
                  onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={<b><span dangerouslySetInnerHTML={{__html:q.title}}/></b>}
                    subtitle={<Sentiment sentiment={q.sentiment}/>}
                    avatar={<Icon nick={q.nick} size={50}/>}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardTitle style={{textTransform: 'uppercase'}}
                           title={`GENRE: ${q.genre}`}
                           subtitle={date} expandable={true}/>
                
                <CardText expandable={true}>
                    <span dangerouslySetInnerHTML={{__html: q.comment}}/>
                </CardText>
            </Card>
        )
    }
}

