import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Bar } from 'react-chartjs-2';
import { useIntl } from 'react-intl'
import queryString from 'query-string';

import { makeStyles, withTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import CircularProgress from '@material-ui/core/CircularProgress';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'


import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { format, parse } from 'date-fns'

import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { prettifyKV, } from '../../utils'
import { ArrayRenderer } from 'components/Generic'



const useStyles = makeStyles((theme) => ({
    title: {
        padding: theme.spacing(1),
    },
    status: {
        padding: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        minHeight: '90%',
    },
}))

const containsGbp = text => /value/i.test(text)


function TimeStats({ theme }) {

    const intl = useIntl()
    //TODO extract to campaign selector
    const DATE_FORMAT = "yyyy-MM-dd"
    const IPOCODE = 'BDIPA'
    const CAMPAIGN_START = "2020-09-09"

    const [stats, setStats] = useState(null);
    const [from, setFrom] = useState(parse(CAMPAIGN_START, DATE_FORMAT, new Date()))
    const [to, setTo] = useState()
    const [stacked, setStacked] = useState(true);
    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)

    useEffect(() => {
        const endpoint = queryString.stringifyUrl({
            url: `/admin/campaign/timestats/${IPOCODE}`,
            query: {
                from: from ? format(from, DATE_FORMAT) : null,
                to: to ? format(to, DATE_FORMAT) : null
            }
        }, {
            skipNull: true,
        })

        efpApiClient.requestEfpApi(endpoint).then(setStats).catch(setError);
    }, [from, to]);

    const classes = useStyles();

    const options = {
        scales: {
            yAxes: [{
                stacked,
                ticks: { beginAtZero: true }
            }],
            xAxes: [{
                stacked
            }],
        },
        maintainAspectRatio: true,
    }

    const gbpTooltips = {
        tooltips: {
            callbacks: {
                label: (tooltipItem) => prettifyKV('gbp', tooltipItem.yLabel)
            },
        },
    }

    const handleSwitch = (event) => setStacked(event.target.checked);

    const isMobile = window.innerWidth < 500
    const responsiveSizeHack = isMobile ? 200 : null

    const control = <Switch
        checked={stacked}
        onChange={handleSwitch}
        name="checkedB"
        color="primary"
    />

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <Page pageTitle={intl.formatMessage({ id: 'campaignTimeStats' })}>
                <Helmet>
                    <title>{intl.formatMessage({ id: 'campaignTimeStats' })}</title>
                </Helmet>
                <Scrollbar >
                    {stats ? stats.map(stat =>
                        (<Paper key={stat.title} className={classes.paper} >
                            {stat.title && <h2 className={classes.title}>{stat.title}</h2>}

                            <Grid container justify="space-around">
                                <Grid item xs={12} sm={3} md={3}  >
                                    <FormControlLabel
                                        control={control}
                                        label="Stacked"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3}  >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        id="date-from"
                                        format={DATE_FORMAT}
                                        label="From"
                                        autoOk
                                        minDate={CAMPAIGN_START}
                                        maxDate={to}
                                        value={from}
                                        onChange={(date) => setFrom(date)} />
                                </Grid>
                                <Grid item xs={12} sm={3} md={3}  >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        id="date-to"
                                        format={DATE_FORMAT}
                                        label="To"
                                        autoOk
                                        minDate={from}
                                        disableFuture
                                        value={to}
                                        onChange={(date) => setTo(date)} />

                                </Grid>
                            </Grid>

                            <Bar data={stat}
                                width={responsiveSizeHack}
                                height={responsiveSizeHack}
                                options={{ ...options, ...containsGbp(stat.title) ? gbpTooltips : {} }} />
                            {stat.datasets.map(dataset =>
                                <ArrayRenderer
                                    key={dataset.label}
                                    rows={[stat.labels.reduce((acc, label, i) => ({ ...acc, [label]: dataset.data[i] }), {})]}
                                    columnNames={stat.labels}
                                    title={dataset.label}
                                    classes={classes}
                                    cellMapper={(row, key) => prettifyKV(containsGbp(stat.title) ? 'gbp' : key, row[key])}
                                    error={error && error.message}
                                />)
                            }
                        </Paper>
                        )) : null

                    }
                </Scrollbar>
            </Page >
        </MuiPickersUtilsProvider >

    )

}

export default memo(withTheme(TimeStats));

