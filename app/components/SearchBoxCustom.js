import React, { Component, ReactClass, PropTypes } from 'react'
import { connect } from 'react-redux'


export class SearchBoxCustom {


    render () {
        return <div className='sb-padding'>
                <input placeholder="Try Bitcoin"
                       className='sb-input'/>
               </div>
    }
}