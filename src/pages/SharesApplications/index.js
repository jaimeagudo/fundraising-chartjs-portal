import React, { useState, useEffect, memo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import { ArrayRenderer } from 'components/Generic'
import efpApiClient from '../../services/efpApiClient';
import { prettifyValue, fixedColors } from '../../utils'
import Typography from '@material-ui/core/Typography'


import { withStyles, makeStyles } from '@material-ui/core/styles';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MoneyOff from '@material-ui/icons/MoneyOff';

import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'

const flex = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-evenly'
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    search: {
        padding: 0,
        margin: theme.spacing(1),
        alignItems: 'baseline',
        color: theme.palette.primary,

    },
    title: {
        paddingLeft: theme.spacing(1),
    },
    paper: {
        ...flex,
        padding: theme.spacing(8),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

// https://codesandbox.io/s/k2kqwpvnn3?file=/src/App.js:423-761

export function SharesApplications() {
    const intl = useIntl()
    const classes = useStyles();
    const params = useParams();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(params.email || '');
    const [magentoUserId, setMagentoUserId] = useState(params.magentoUserId || '');
    const [paymentReference, setPaymentReference] = useState(params.paymentReference || '');
    const [requestDate, setRequestDate] = useState(new Date());
    useSessionTimeoutHandler(error)

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const result = await efpApiClient.requestEfpApi(
                `/sharesApplications/search?email=${email}&magentoUserId=${magentoUserId}&paymentReference=${paymentReference}`)
                .catch(setError)
            if (!ignore) setResult(result);
        }
        fetchData()
        return () => { ignore = true; }
    }, [email, paymentReference, magentoUserId, requestDate]);

    const onRefundClick = useCallback((paymentReference) => {
        async function refundClick() {
            await efpApiClient.requestEfpApi(
                `/admin/sharesApplications/${paymentReference}/refund`,
                { method: 'POST', })
                .catch(setError);
            setRequestDate(new Date());
        }
        refundClick()
    }, []);

    const columnNames = result && result.length ? Object.keys(result[0]) : []

    const getColumnContent = (row, key, classes) => {
        switch (key) {
            case 'MagentoUserId':
                return <Link to={`/customers/${row.MagentoUserId}`}>{row.MagentoUserId}</Link>;
            case 'RefundedAt':
                return row.RefundedAt ||
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={() => onRefundClick(row.PaymentReference)}
                        startIcon={<MoneyOff />}>
                        Refund
                    </Button>
            default:
                return prettifyValue(row[key]);
        }
    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'sharesApplications' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'sharesApplications' })}</title>
            </Helmet>


            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={3}  >
                            <h2 className={classes.search} >Search<Search /></h2>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}   >
                            <TextField id="email"
                                // label='Email address'
                                placeholder="gmail"
                                helperText="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={12} sm={4} md={3}  >
                            <TextField id="magentoUserId"
                                placeholder="123456"
                                // label="Magento User Id"
                                helperText="Magento User Id"
                                value={magentoUserId}
                                onChange={(event) => setMagentoUserId(event.target.value || '')} />

                        </Grid>

                        <Grid item xs={12} sm={4} md={3}   >
                            <TextField id="paymentReference"
                                placeholder="Ax1Gd424bc"
                                // label=""
                                helperText="Payment Ref/Voucher Code"
                                value={paymentReference}
                                onChange={(event) => setPaymentReference(event.target.value || '')} />

                        </Grid>
                    </Grid>
                </form>
                <Paper className={classes.root}>
                    <ArrayRenderer
                        title={intl.formatMessage({ id: 'sharesApplications' })}
                        rows={result}
                        columnNames={columnNames}
                        classes={classes}
                        error={error && error.message}
                        cellMapper={getColumnContent} />
                </Paper>
            </Scrollbar >
        </Page >
    )
}
export default memo(SharesApplications);
