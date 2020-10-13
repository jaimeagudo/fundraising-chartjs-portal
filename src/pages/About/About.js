import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { makeStyles, } from '@material-ui/core/styles';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Paper from '@material-ui/core/Paper';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import { injectIntl } from 'react-intl'
import logo from '../../logo.svg';
import api from '../../config/api'
import pkg from '../../../package.json'
import Changelog from '../../Changelog.md'

// require('github-markdown-css') //it breaks dark theme


const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
    },
    title: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
    changelog: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));


const AboutPage = ({ intl }) => {
    const [text, setText] = useState('')

    useEffect(() => {
        fetch(Changelog)
            .then(response => response.text())
            .then(setText)
    }, []);

    const classes = useStyles();
    const title = intl.formatMessage({ id: 'changelog' })

    return (
        <Page pageTitle={title}>
            <Scrollbar className={classes.root}>
                <Paper className={classes.title}>
                    <img src={logo} className="App-logo" alt="logo" />
                    <h3>Equity For Punks. Brewdog PLC (C) 2020</h3>
                    <h4>v{pkg.version} Pointing at <a href={api.server} >{api.server}</a></h4>
                </Paper>
                <h1>{title}</h1>
                <Paper className={classes.changelog}>
                    <ReactMarkdown className="markdown-body" source={text} />
                </Paper>
            </Scrollbar>
        </Page>)
}
export default injectIntl(AboutPage)
