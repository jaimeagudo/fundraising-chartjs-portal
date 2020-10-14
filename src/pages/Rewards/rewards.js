import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom';


import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'


import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { ArrayRenderer } from 'components/Generic'

import { prettifyValue, } from '../../utils'
import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'


const useStyles = makeStyles({
    title: {
        paddingLeft: 10,
    },
});

export function Benefits() {
    const intl = useIntl()
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [sharesRewards, setSharesRewards] = useState([]);
    const [referralRewards, setReferralRewards] = useState([]);
    useSessionTimeoutHandler(error)

    const fetchRewards = useCallback(async () => {
        const resultS = await efpApiClient.requestEfpApi(
            `/rewards/shares/BDIPA`)
            .catch(setError);
        setSharesRewards(resultS);
        const resultR = await efpApiClient.requestEfpApi(
            `/rewards/referrals/BDIPA`)
            .catch(setError);
        setReferralRewards(resultR);
    }, []);

    useEffect(() => {
        fetchRewards()
    }, [fetchRewards])

    const cellMapper = (row, key, classes) => {
        switch (key) {
            case 'Action': return (
                <Link to={`/rewards/${row.rewardId}/${row.title}`}>{intl.formatMessage({ id: 'manageStock' })}</Link>)
            default: return prettifyValue(row[key])
        }

    }

    const sharesRewardsColumns = sharesRewards && sharesRewards.length ? ['Action', ...Object.keys(sharesRewards[0])] : []
    const referralRewardsColumns = referralRewards && referralRewards.length ? ['Action', ...Object.keys(referralRewards[0])] : []
    const helper = !sharesRewards || !referralRewards || !referralRewards.length || !sharesRewards.length ? 'No data' : '';

    return (
        <Page pageTitle={intl.formatMessage({ id: 'investorsRewards' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'investorsRewards' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                {sharesRewards && <ArrayRenderer
                    columnNames={sharesRewardsColumns}
                    rows={sharesRewards}
                    title={intl.formatMessage({ id: 'sharesRewards' })}
                    classes={classes}
                    cellMapper={cellMapper} />}
                {referralRewards && <ArrayRenderer
                    columnNames={referralRewardsColumns}
                    rows={referralRewards}
                    title={intl.formatMessage({ id: 'referralsRewards' })}
                    classes={classes} cellMapper={cellMapper} />}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(Benefits);
