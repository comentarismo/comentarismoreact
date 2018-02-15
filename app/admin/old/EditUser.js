'use strict';

import React from 'util/safe-react';
var createReactClass = require('create-react-class');

import config from 'config'
var host = config.API_URL;

var $ = require("jquery");

var crud = require("./crud");

import {CtrBtns,FormGroup,FormGroupTextArea,handleDeleteButton,handleSaveButton,handleChange,getInitialState} from "./crud"
import Icon from "components/Icon"


module.exports = createReactClass({
    displayName: 'NewsComponent',


    getInitialState: function () {
        let { article } = this.props;
        return getInitialState(article,"rawdata");
    },

    handleChange: function (event) {
        handleChange(event,this);
    },

    handleDeleteButton: function (event) {
        let {id} = this.state;
        var target = `${host}/delete/user/${id}/`;

        handleDeleteButton($,target);
    },

    handleSaveButton: function (event) {
        let { article } = this.props;
        var that = this;
        var target = `${host}/update/user/`;

        handleSaveButton($,target,that,article);
    },

    render: function () {
        return (
            <div className="col-xs-12">
                <div id='success' className='success' style={{"display": "none"}}></div>
                <div id='error' className='error' style={{"display": "none"}}></div>
                <div style={{height: '50px'}}></div>
                <div className="col-xs-4">
                    <div className="image">
                        <Icon nick={this.state.nickname} size={125}/>
                    </div>
                    <div style={{height: '50px'}}></div>

                    <CtrBtns handleSaveButton={this.handleSaveButton} href="/admin/l/user/provider/github/0/50/name"
                             id={this.state.id} handleDeleteButton={this.handleDeleteButton}/>

                </div>


                <div className='caption col-xs-8'>

                    <form className='form-horizontal' role='form' id='crud-form'>

                        <FormGroup id='id' placeholder='Id' value={this.state["id"]} onChange={this.handleChange}/>

                        <FormGroup id='accesstoken' placeholder='accesstoken'
                                   value={this.state.accesstoken} onChange={this.accesstoken}/>

                        <FormGroup id='avatarurl' placeholder='avatarurl'
                                   value={this.state.avatarurl} onChange={this.handleChange}/>

                        <FormGroup id='key' placeholder='key'
                                   value={this.state.key} onChange={this.handleChange}/>

                        <FormGroup id='keydate' placeholder='keydate'
                                   value={this.state.keydate} onChange={this.handleChange}/>

                        <FormGroup id='location' placeholder='location'
                                   value={this.state.location} onChange={this.handleChange}/>

                        <FormGroup id='provider' placeholder='provider'
                                   value={this.state.provider} onChange={this.handleChange}/>

                        <FormGroup id='userid' placeholder='userid'
                                   value={this.state.userid} onChange={this.handleChange}/>

                    </form>
                </div>
            </div>
        );
    }
});
