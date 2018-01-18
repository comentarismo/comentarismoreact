'use strict';

var React = require('react');
import Date from "components/Date";
import Image from "components/Image";

import config from 'config'
var host = config.API_URL;

var $ = require("jquery");

var crud = require("./crud");

import {CtrBtns,FormGroup,FormGroupTextArea,handleDeleteButton,handleSaveButton,handleChange,getInitialState} from "./crud"


module.exports = createReactClass({
    displayName: 'NewsComponent',


    getInitialState: function () {
        let { article } = this.props;
        return getInitialState(article,["tags"]);
    },

    handleChange: function (event) {
        handleChange(event,this);
    },

    handleDeleteButton: function (event) {
        let {id} = this.state;
        var target = `${host}/delete/news/${id}/`;

        handleDeleteButton($,target);
    },

    handleSaveButton: function (event) {
        let { article } = this.props;
        var that = this;
        var target = `${host}/update/news/`;

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
                        {<Image src={this.state.image} classes={"img-responsive"}/>}
                    </div>
                    <div style={{height: '50px'}}></div>

                    <CtrBtns handleSaveButton={this.handleSaveButton} href="/admin/l/news/languages/english/0/50/totalComments"
                             id={this.state.id} handleDeleteButton={this.handleDeleteButton}/>

                </div>


                <div className='caption col-xs-8'>

                    <form className='form-horizontal' role='form' id='crud-form'>

                        <FormGroup id='id' placeholder='Id' value={this.state["id"]} onChange={this.handleChange} disabled={true} />
                        <FormGroup id='titleurlize' placeholder='Titleurlize'
                                   value={this.state.titleurlize} onChange={this.handleChange} disabled={true}/>

                        <FormGroup id='title' placeholder='Title'
                                   value={this.state.title} onChange={this.handleChange}/>

                        <FormGroup id='summary' placeholder='Summary'
                                   value={this.state.summary} onChange={this.handleChange}/>

                        <FormGroupTextArea id='resume' placeholder='Resume'
                                           rows='8' value={this.state.resume}
                                           onChange={this.handleChange}/>

                        <FormGroup id='author' placeholder='Author'
                                   value={this.state.author} onChange={this.handleChange}/>

                        <FormGroup id='categories' placeholder='Categories'
                                   value={this.state.categories} onChange={this.handleChange}/>

                        <FormGroup id='countries' placeholder='Countries'
                                   value={this.state.countries} onChange={this.handleChange}/>

                        <FormGroup id='date' placeholder='Date'
                                   value={this.state.date} onChange={this.handleChange}/>

                        <FormGroup id='genre' placeholder='Genre'
                                   value={this.state.genre} onChange={this.handleChange}/>

                        <FormGroup id='image' placeholder='Image'
                                   value={this.state.image} onChange={this.handleChange}/>

                        <FormGroup id='languages' placeholder='Languages'
                                   value={this.state.languages} onChange={this.handleChange}/>

                        <FormGroup id='link' placeholder='Link'
                                   value={this.state.link} onChange={this.handleChange} disabled={true}/>

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
