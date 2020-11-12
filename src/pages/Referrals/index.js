import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'


import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { ArrayRenderer } from 'components/Generic'

import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { parseISO, format } from 'date-fns';


const useStyles = makeStyles({
    title: {
        paddingLeft: 10,
    },
});

export function Referrals() {
    const intl = useIntl()
    const classes = useStyles();
    const [error, setError] = useState(null);

    const [referralWinners, setReferralsWinners] = useState([]);
    useSessionTimeoutHandler(error)

    const fetchRewardsWinners = useCallback(() => {
        efpApiClient.requestEfpApi(
            `/referrals/statistics/BDIPA/weekly`)
            .then(setReferralsWinners)
            .catch(setError);
    }, []);

    useEffect(() => {
        fetchRewardsWinners()
    }, [fetchRewardsWinners])

    const helper = !referralWinners || !referralWinners.length ? 'No data' : '';

    return (
        <Page pageTitle={intl.formatMessage({ id: 'referralsRewardsWinners' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'referralsRewardsWinners' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <h1 className={classes.title} >Referrals Weekly league winners </h1>
                {referralWinners.map(week => {
                    const columnNames = Object.keys(week.topRanking[0]);
                    const from = format(parseISO(week.weekStargingOn), 'yyyy-MMM-dd')
                    const to = format(parseISO(week.weekEndingOn), 'yyyy-MMM-dd')
                    const title = `Week #${week.isoWeek} [${from} - ${to}]`
                    return (
                        <div>
                            <ArrayRenderer
                                title={title}
                                columnNames={columnNames}
                                rows={week.topRanking}
                                classes={classes} />
                        </div>)
                })}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(Referrals);
