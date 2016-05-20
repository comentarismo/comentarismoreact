var React = require('react');
var _ = require("underscore");

function handleDeleteButton($,target){
    var successbox = $(".success");
    var errorbox = $(".error");

    // post to comentarismo api
    console.log(target);
    $.post({
        url: target,
        type: 'post',
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function (user) {
            $('a#inifiniteLoader').hide();
            console.log(user);
            console.log("delete success");
            successbox.html("delete success");
            successbox.show();
        },
        error: function (err) {
            $('a#inifiniteLoader').hide();
            if (err.status === 200) {
                console.log(err);
                console.log("delete success");
                successbox.html("delete success");
                successbox.show();
            } else {
                console.log(err);
                successbox.hide();
                errorbox.html("delete failed " + JSON.stringify(err));
                errorbox.show();
            }
        }
    });
}

function handleSaveButton($,target,that,article){
    var targetObj = {};
    Object.keys(article).forEach(function (key) {
        //if(typeof that.state[key] == "object"){
        //    console.log(that.state[key])
        //}
        targetObj[key] = that.state[key];
    }, article);

    //console.log(targetObj)

    var successbox = $(".success");
    var errorbox = $(".error");

    // post to comentarismo api

    console.log(target);
    $.ajax({
        url: target,
        type: 'post',
        data: targetObj,
        xhrFields: {
            withCredentials: true
        },
        success: function (user) {
            $('a#inifiniteLoader').hide();
            console.log(user);
            console.log("update success");
            successbox.html("update success");
            successbox.show();
        },
        error: function (err) {
            $('a#inifiniteLoader').hide();
            if (err.status === 200) {
                console.log(err);
                console.log("update success");
                successbox.html("update success");
                successbox.show();
            } else {
                console.log(err);
                successbox.hide();
                errorbox.html("update failed " + JSON.stringify(err));
                errorbox.show();
            }
        }
    });
}

function handleChange(event,that){
    var target = event.target.id;
    var change = {};
    change[target] = event.target.value;
    that.setState(change);
}

function getInitialState(article,avoidKey){
    var targetObj = {};
    Object.keys(article).forEach(function (key) {
        //console.log(key);

        if( _.indexOf(avoidKey, key) !==-1){
            console.log("skip key to avoid using --> "+key);
        }else {
            targetObj[key] = this[key];
        }

    }, article);

    return targetObj
}

var CtrBtns = React.createClass({
    render: function () {
        return (
            <div className='col-sm-offset-20 col-xs-12'>
                <span onClick={this.props.handleSaveButton} className='btn btn-lg btn-block btn-primary'>Save</span>
                <a className='btn btn-lg btn-block btn-warning'
                   href={this.props.href}>Cancel</a>
                        <span id='deleteBtn' data-id={this.props.id} target='user'
                              className='btn btn-lg btn-block btn-danger'
                              onClick={this.props.handleDeleteButton}>Delete</span>
            </div>
        )
    }
});

var FormGroup = React.createClass({
    render: function () {
        return (
            <div className='form-group'>
                <label className='col-sm-2 control-label'>{this.props.placeholder}</label>
                <div className='col-sm-10'>
                    <input type='text' className='form-control' id={this.props.id} placeholder={this.props.placeholder}
                           value={this.props.value} onChange={this.props.disabled ? "" : this.props.onChange}/>
                </div>
            </div>
        )
    }
});

var FormGroupTextArea = React.createClass({
    render: function () {
        return (
            <div className='form-group'>
                <label className='col-sm-2 control-label'>{this.props.placeholder}</label>
                <div className='col-sm-10'>
                                <textarea className='form-control'
                                          id={this.props.id} placeholder={this.props.placeholder}
                                          value={this.props.value} onChange={this.props.onChange}
                                          rows={this.props.rows}/>
                </div>
            </div>
        )
    }
});


module.exports = {
    CtrBtns:CtrBtns,
    FormGroup:FormGroup,
    FormGroupTextArea:FormGroupTextArea,
    handleDeleteButton:handleDeleteButton,
    handleSaveButton:handleSaveButton,
    handleChange:handleChange,
    getInitialState:getInitialState
};