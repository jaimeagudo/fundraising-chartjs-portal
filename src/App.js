import React, { Component } from 'react'
import { render } from 'react-dom'
import App from 'base-shell/lib'
import MUIConfig from 'material-ui-shell/lib'
import ErrorBoundary from './components/ErrorBoundary'

import merge from 'base-shell/lib/utils/config'
import _config from './config'

const config = merge(MUIConfig, _config)

export default class EfpPortal extends Component {
    render() {
        return (
            <ErrorBoundary>
                <App config={config} />
            </ErrorBoundary>
        )
    }
}
