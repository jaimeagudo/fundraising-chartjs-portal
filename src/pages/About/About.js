import React from 'react'
import Page from 'material-ui-shell/lib/containers/Page/Page'
import { injectIntl } from 'react-intl'
import logo from '../../logo.svg';
import api from '../../config/api'

const AboutPage = ({ intl }) =>
    (<Page pageTitle={intl.formatMessage({ id: 'about' })}>
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <img src={logo} className="App-logo" alt="logo" />
            <h3>Equity For Punks. Brewdog PLC (C) 2020</h3>
            <h4>{`Pointing at `}<a href={api.server} >{api.server}</a></h4>

        </div>
    </Page>)

export default injectIntl(AboutPage)
