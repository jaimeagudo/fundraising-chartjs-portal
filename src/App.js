import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { render } from 'react-dom'
import App from 'base-shell/lib'
import MUIConfig from 'material-ui-shell/lib'
import ErrorBoundary from './components/ErrorBoundary'
import configureStore from './state/configureStore';

import merge from 'base-shell/lib/utils/config'
import _config from './config'

const config = merge(MUIConfig, _config)

const store = configureStore({});

export default class EfpPortal extends Component {

    render() {
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <App config={config} />
                </Provider>
            </ErrorBoundary>
        )
    }
}
