import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup'
import { useIntl, } from 'react-intl'

import { makeStyles, withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Group from '@material-ui/icons/Group';

import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { pretiffyKey } from '../../utils'
import { ObjectRenderer, ArrayRenderer } from 'components/Generic'

const useStyles = makeStyles((theme) => ({
    title: {
        paddingLeft: 10,
    },
    status: {
        padding: theme.spacing(1),
    },
}))


function CampaignStatus({ theme }) {
    const ipocode = useSelector(state => state.campaign.current)
    const intl = useIntl()

    const [stats, setStats] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)

    useEffect(() => {
        efpApiClient.requestEfpApi(`/campaign/status/${ipocode}`).then(setStatus).catch(setError);
        efpApiClient.requestEfpApi(`/admin/campaign/stats/${ipocode}`).then(setStats).catch(setError);
    }, [ipocode]);

    const classes = useStyles();

    const renderObj = (obj) => Object.keys(obj).map((key, index) =>
        Array.isArray(obj[key]) && obj[key].length ?
            <ArrayRenderer key={index} title={pretiffyKey(key)} rows={obj[key]} columnNames={Object.keys(obj[key][0])} classes={classes} /> :
            <ObjectRenderer key={index} name={key} obj={obj[key]} classes={classes} />
    )

    return (
        <Page pageTitle={intl.formatMessage({ id: 'campaignStatus' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'campaignStatus' })}</title>
            </Helmet>
            <Scrollbar >
                {status ?
                    (<div >
                        <Grid container spacing={1} >
                            <Grid item xs={12}  >
                                <div className={classes.status}>
                                    <CountUp
                                        style={theme.typography.h3}
                                        separator=','
                                        prefix="£"
                                        start={0}
                                        end={status && status.raisedAmountTomorrow && status.raisedAmountTomorrow / 100}
                                    />
                                    <AccountBalanceIcon color="primary" className="material-icons" style={{ ...theme.typography.h3, marginLeft: 8 }} />
                                </div>
                            </Grid>
                            <Grid item xs={12} >
                                <div className={classes.status}>
                                    <CountUp
                                        style={theme.typography.h3}
                                        separator=','
                                        start={0}
                                        end={status && status.investorsCountTomorrow}
                                    />
                                    <Group color="primary" className="material-icons" style={{ ...theme.typography.h3, marginLeft: 8, }} />
                                </div>
                            </Grid>
                        </Grid>
                        <ObjectRenderer key='status' name={'Status'} obj={status} classes={classes} />
                    </div>) :
                    null}
                {stats ? renderObj(stats) : null}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{(error && error.message) || ''}</FormHelperText>
                </FormControl>
            </Scrollbar >
        </Page >
    )
}

export default memo(withTheme(CampaignStatus));
