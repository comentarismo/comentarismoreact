import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

const style = {
    margin: '20px 20px 0px 0',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px',
    maxHeight: 'auto',
    width: '100%',
    float: 'left !important',
    display: 'block !important',
};

class ModalBody extends React.Component {
    fixhtml(html) {
        if (typeof window !== 'undefined') {
            var div = document.createElement('div');
            div.innerHTML = html
            return (div.innerHTML);
        }else {
            return html
        }
    }
    
    rawMarkup() {
        var rawMarkup = this.props.content
        return {__html: this.fixhtml(rawMarkup)};
    }
    
    render() {
        return (
            <div>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
            
            </div>
        )
    }
}
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
        const t = title && title.length > 40 ? title.substring(0, 40) + "..." : title;
        return (
            <ModalBody content={t}/>
        );
    }
    
    getComment(title) {
        return (
            <span dangerouslySetInnerHTML={{__html: title}}/>
        );
    }
    
    getAvatar(nick) {
        const n = nick && nick.length >= 1 ? nick.substring(0, 1) : "A";
        return (
            <Avatar>{n}</Avatar>
        );
    }
    
    
    render() {
        return (
            <Card style={style} class="col-xs-12" expanded={this.state.expanded}
                  onExpandChange={this.handleExpandChange}>
                <CardHeader
                    title={<span>{this.props.comment.nick} </span>}
                    subtitle={<span>{this.props.comment.likes} LIKES on <b>{this.props.title ? this.props.title : this.props.comment.title}</b></span>}
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