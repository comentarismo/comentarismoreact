import React from 'react'
import Snackbar from 'material-ui/Snackbar'

export default class GDPR extends React.Component {
    
    constructor (props) {
        super(props)
        this.state = {
            message: 'NOTICE: This page has been anonymized to comply with General Data Protection Regulation!',
            open: true,
        }
        this.timer = undefined
        
        this.timer = setTimeout(() => {
            this.setState({
                message: `@Comentarismo we are proud to respect user's privacy!`,
            })
        }, 10000)
        
    }
    
    handleRequestClose = () => {
        this.setState({
            open: false,
        })
        var win = window.open('https://api.comentarismo.com/more/gdpr.html', '_blank')
        win.focus()
    }
    
    render () {
        return (
            <div>
                
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    action="Read Official Statement"
                    autoHideDuration={120000}
                    onClick={this.handleRequestClose}

                />
            </div>
        )
    }
}