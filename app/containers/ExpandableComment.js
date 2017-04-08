import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

const style = {
    margin: '20px 20px 20px 0',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px',
    maxHeight: 'auto',
    width: '300px',
    float: 'left !important',
    display: 'block !important',
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
            <Card style={style} class="col-xs-12" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={<span>{this.props.comment.nick}</span>}
                    subtitle={this.getShortComment(this.props.comment.comment)}
                    avatar={this.getAvatar(this.props.comment.nick)}
                    actAsExpander={true}
                    showExpandableButton={true}
                />

                <CardText  expandable={true}>
                    {this.getComment(this.props.comment.comment)}
                </CardText>
            </Card>
        );
    }
}