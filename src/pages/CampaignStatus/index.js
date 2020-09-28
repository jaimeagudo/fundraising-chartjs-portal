import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import efpApiClient from '../../services/efpApiClient';
import AgnosticTableMapper from 'components/AgnosticTableMapper'
import api from '../../config/api'

import { useIntl, FormattedMessage } from 'react-intl'


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);
function pretiffyKey(name) {
    const words = name.match(/[A-Za-z][a-z]*/g) || [];
    return words.map(capitalize).join(" ");
}

export function CampaignStatus() {
    const intl = useIntl()

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            // eslint-disable-next-line no-console
            // const response = await efpApiClient.requestEfpApi('/campaign/status/BDIPA').catch(setError);
            const response = await efpApiClient.requestEfpApi('/admin/campaign/stats/BDIPA').catch(setError);
            setStatus(response);
        }
        fetchData();
    }, []);

    const classes = useStyles();

    return (
        <Page pageTitle={intl.formatMessage({ id: 'campaignStatus' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'campaignStatus' })}</title>
            </Helmet>
            <Scrollbar
                style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
            >
                {status && Object.keys(status).map((key, index) =>
                    <div id={key} >
                        <h1>{pretiffyKey(key)}</h1>
                        <AgnosticTableMapper obj={status[key]} classes={classes} fieldsWithPences={api.fieldsWithPences} />
                    </div>
                )}


                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{(error && error.message) || ''}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page>
    )
}


export default memo(CampaignStatus);


