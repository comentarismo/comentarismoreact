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
    displayName: 'CommentatorComponent',


    getInitialState: function () {
        let { article } = this.props;
        return getInitialState(article,["genre"]);
    },

    handleChange: function (event) {
        handleChange(event,this);
    },

    handleDeleteButton: function (event) {
        let {id} = this.state;
        var target = `${host}/delete/commentator/${id}/`;

        handleDeleteButton($,target);
    },

    handleSaveButton: function (event) {
        let { article } = this.props;
        var that = this;
        var target = `${host}/update/commentator/`;

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
                        <Icon nick={this.state.nick} size={125}/>
                    </div>
                    <div style={{height: '50px'}}></div>

                    <CtrBtns handleSaveButton={this.handleSaveButton} href="/admin/l/commentator/languages/english/0/50/totalComments"
                             id={this.state.id} handleDeleteButton={this.handleDeleteButton}/>
                </div>


                <div className='caption col-xs-8'>

                    <form className='form-horizontal' role='form' id='crud-form'>

                        <FormGroup id='id' placeholder='Id' value={this.state["id"]} onChange={this.handleChange}/>

                        <FormGroup id='nick' placeholder='Nick'
                                   value={this.state.nick} onChange={this.handleChange}/>

                        <FormGroup id='slug' placeholder='Slug'
                                   value={this.state.slug} onChange={this.handleChange}/>

                        <FormGroup id='maxDate' placeholder='Last Seen'
                                   value={this.state.maxDate} onChange={this.handleChange}/>

                        <FormGroup id='minDate' placeholder='First Seen'
                                   value={this.state.minDate} onChange={this.handleChange}/>

                        <FormGroup id='categories' placeholder='Categories'
                                   value={this.state.categories} onChange={this.handleChange}/>

                        <FormGroup id='countries' placeholder='Countries'
                                   value={this.state.countries} onChange={this.handleChange}/>

                        <FormGroup id='languages' placeholder='Languages'
                                   value={this.state.languages} onChange={this.handleChange}/>

                        <FormGroup id='operator' placeholder='Operator'
                                   value={this.state.operator} onChange={this.handleChange}/>

                        <FormGroup id='totalComments'
                                   placeholder='Total Comments' value={this.state.totalComments}
                                   onChange={this.handleChange}/>

                    </form>
                </div>
            </div>
        );
    }
});
