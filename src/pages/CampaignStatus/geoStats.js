import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Line, Bar, Doughnut } from 'react-chartjs-2'
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


import { prettifyKV, fixedColors } from '../../utils'
import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import codesMap from '../../isoCountryCodesMap'
import namesMap from '../../isoCountryNamesMap'
import { ArrayRenderer } from 'components/Generic'

const getIso2CC = (iso3CC) => codesMap[iso3CC]
const getCountryName = (iso3CC) => namesMap[getIso2CC(iso3CC)]

const isMobile = window.innerWidth < 500
const responsiveSizeHack = isMobile ? window.innerWidth + 400 : window.innerWidth

const renderPies = (stat, classes) => stat && stat.labels ?
    <div>
        {stat.datasets.map(dataset => {
            const gbpTooltips = {
                tooltips: {
                    callbacks: {
                        label: (tooltipItem) => getCountryName(stat.labels[tooltipItem.index]) + ': ' + prettifyKV('gbp', dataset.data[tooltipItem.index])
                    },
                },
            };

            const rows = [stat.labels.reduce((acc, label, i) => ({ ...acc, [getCountryName(label)]: dataset.data[i] }), {})]
            const columnNames = stat.labels.map(getCountryName)
            const cellMapper = (row, key) => prettifyKV(containsGbp(stat.title) ? 'gbp' : key, row[key])

            return (<div key={dataset.label}>
                <h2>{dataset.label}</h2>
                {/* <img alt={stat.labels[0]} style={{ width: '32px' }} src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${codesMap[stat.labels[0]]}.svg`} /> */}
                <div >
                    <Doughnut
                        options={{
                            ...gbpTooltips, maintainAspectRatio: !isMobile, responsive: true, legend: { position: 'bottom' }
                        }}

                        height={responsiveSizeHack}
                        width={responsiveSizeHack}
                        data={{
                            labels: stat.labels,
                            datasets: [{
                                data: dataset.data,
                                backgroundColor: fixedColors(stat.labels.length)
                            }]
                        }} />
                </div>
                <ArrayRenderer
                    key={dataset.label}
                    rows={rows}
                    columnNames={columnNames}
                    classes={classes}
                    title={dataset.label}
                    cellMapper={cellMapper}
                />
            </div>
            )
        })}
    </div>
    : <CircularProgress />


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

function GeoStats({ theme }) {

    const intl = useIntl()
    //TODO extract to campaign selector
    const IPOCODE = 'BDIPA'

    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)

    useEffect(() => {
        const endpoint = queryString.stringifyUrl({
            url: `/admin/campaign/geostats/${IPOCODE}`,
            // query: {
            //     from: from ? format(from, DATE_FORMAT) : null,
            //     to: to ? format(to, DATE_FORMAT) : null
            // }
        }, {
            skipNull: true,
        })

        efpApiClient.requestEfpApi(endpoint).then(setStats).catch(setError);
    }, []);

    const classes = useStyles();

    // const options = {
    //     scales: {
    //         yAxes: [{
    //             stacked,
    //             ticks: { beginAtZero: true }
    //         }],
    //         xAxes: [{
    //             stacked
    //         }],
    //     },
    //     maintainAspectRatio: true,
    // }



    return (

        <Page pageTitle={intl.formatMessage({ id: 'campaignGeoStats' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'campaignGeoStats' })}</title>
            </Helmet>
            <Scrollbar >
                {stats ? stats.map(stat =>
                    (<Paper key={stat.title} className={classes.paper} >
                        {/* {stat.title && <h2 className={classes.title}>{stat.title}</h2>} */}
                        {renderPies(stat, classes)}
                        {/* <Bar data={stat}
                                width={responsiveSizeHack}
                                height={responsiveSizeHack}
                                options={{ ...options, ...containsGbp(stat.title) ? gbpTooltips : {} }} /> */}
                    </Paper>
                    )) : null

                }
            </Scrollbar>
        </Page >

    )

}

export default memo(withTheme(GeoStats));

