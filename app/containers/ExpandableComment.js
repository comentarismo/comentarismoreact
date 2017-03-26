import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

const style = {
    height: 'auto',
    margin: '20px',
    width: '100%',
    textAlign: 'left',
    display: 'block',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px'
};

export default class ExpandableComment extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }
    
    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };
    
    handleToggle = (event, toggle) => {
        this.setState({expanded: toggle});
    };
    
    handleExpand = () => {
        this.setState({expanded: true});
    };
    
    handleReduce = () => {
        this.setState({expanded: false});
    };
    
    getShortComment(title) {
        const t = title && title.length > 40 ? title.substring(0, 40) + "..." : title
        return (
            <span dangerouslySetInnerHTML={{__html: t}}/>
        );
    }
    
    getComment(title) {
        return (
            <span dangerouslySetInnerHTML={{__html: title}}/>
        );
    }
    
    getAvatar(nick){
        const n = nick && nick.length >= 1 ? nick.substring(0, 1) : "A"
        return (
            <Avatar>{n}</Avatar>
        );
    }
    
    
    
    render() {
        return (
            <Card style={style} expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={this.props.comment.nick}
                    subtitle={this.getShortComment(this.props.comment.comment)}
                    avatar={this.getAvatar(this.props.comment.nick)}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                

                <CardText expandable={true}>
                    {this.getComment(this.props.comment.comment)}
                </CardText>
                
            </Card>
        );
    }
}