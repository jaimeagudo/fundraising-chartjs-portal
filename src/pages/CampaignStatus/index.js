import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import CircularProgress from '@material-ui/core/CircularProgress';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import efpApiClient from '../../services/efpApiClient';
import { ObjectRenderer, ArrayRenderer } from 'components/Generic'
import api from '../../config/api'

import { useIntl, FormattedMessage } from 'react-intl'
import { pretiffyKey, fixedColors } from '../../utils'


const renderPie = (array, labelKey, dataKey) => {

    const pieData = array && array.length ? {
        labels: array.map(r => r[labelKey]),
        datasets: [{
            data: array.map(r => r[dataKey]),
            backgroundColor: fixedColors(array.length),
            // hoverBackgroundColor: rainbow(array.length)
        }]
    } : {}

    return pieData ? <Doughnut data={pieData} /> : <CircularProgress />
}


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export function CampaignStatus() {
    const intl = useIntl()

    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        efpApiClient.requestEfpApi('/campaign/status/BDIPA').then(setStatus).catch(setError);
        efpApiClient.requestEfpApi('/admin/campaign/stats/BDIPA').then(setStats).catch(setError);
    }, []);

    const classes = useStyles();

    const renderObj = (obj) => Object.keys(obj).map((key, index) =>
        Array.isArray(obj[key]) && obj[key].length ?
            <ArrayRenderer key={index} title={pretiffyKey(key)} rows={obj[key]} columnNames={Object.keys(obj[key][0])} classes={classes} /> :
            <ObjectRenderer key={index} name={key} obj={obj[key]} fieldsWithPences={api.fieldsWithPences} classes={classes} />
    )


    return (
        <Page pageTitle={intl.formatMessage({ id: 'campaignStatus' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'campaignStatus' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                {status ? <ObjectRenderer key='status' name={'Status'} obj={status} fieldsWithPences={api.fieldsWithPences} classes={classes} /> : null}
                {stats ? renderObj(stats) : null}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{(error && error.message) || ''}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page>
    )
}

export default memo(CampaignStatus);
