import React, { useState, useEffect, memo } from 'react';
// import { Bar } from '@reactchartjs/react-chart.js'
import { Helmet } from 'react-helmet';
import { Bar } from 'react-chartjs-2';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';

import { useIntl, FormattedMessage } from 'react-intl'


import { makeStyles, withTheme } from '@material-ui/core/styles';

import Page from 'material-ui-shell/lib/containers/Page/Page'
import CircularProgress from '@material-ui/core/CircularProgress';
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'


import efpApiClient from '../../services/efpApiClient';

import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { pretiffyKey, fixedColors } from '../../utils'
import { ObjectRenderer, ArrayRenderer } from 'components/Generic'



const stacked = false





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



function TimeStats({ theme }) {

    const intl = useIntl()

    const [stats, setStats] = useState(null);
    const [stacked, setStacked] = useState(true);
    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)

    useEffect(() => {
        efpApiClient.requestEfpApi('/admin/campaign/timestats/BDIPA').then(setStats).catch(setError);
    }, []);

    const classes = useStyles();

    const options = {
        scales: {
            yAxes: [
                {
                    stacked,
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
            xAxes: [
                {
                    stacked,
                },
            ],
        },
        maintainAspectRatio: true


    }
    const handleSwitch = (event) => {
        setStacked(event.target.checked);
    };
    console.log("TimeStats -> window.innerHeight", window.innerHeight)

    const isMobile = window.innerWidth < 500


    const responsiveSizeHack = isMobile ? 200 : null

    return (
        <Page pageTitle={intl.formatMessage({ id: 'campaignTimeStats' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'campaignTimeStats' })}</title>
            </Helmet>
            <Scrollbar >

                {stats ? stats.map(stat =>
                    (<Paper key={stat.title} className={classes.paper} >
                        {stat.title && <h2 className={classes.title}>{stat.title}</h2>}
                        <FormControlLabel
                            control={<Switch
                                checked={stacked}
                                onChange={handleSwitch}
                                name="checkedB"
                                color="primary"
                            />
                            }
                            label="Stacked"
                        />
                        <Bar data={stat}
                            width={responsiveSizeHack}
                            height={responsiveSizeHack}
                            options={options} />
                        {stat.datasets.map(dataset =>
                            <ArrayRenderer
                                key={dataset.label}
                                rows={[stat.labels.reduce((acc, label, i) => ({ ...acc, [label]: dataset.data[i] }), {})]}
                                columnNames={stat.labels}
                                title={dataset.label}
                                classes={classes}
                                error={error && error.message}
                            />)
                        }
                    </Paper>
                    )) : null

                }
            </Scrollbar>
        </Page>)

}

export default memo(withTheme(TimeStats));

