import React, { useState, useEffect, memo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import queryString from 'query-string';

import { ArrayRenderer } from 'components/Generic'
import efpApiClient from '../../services/efpApiClient';
import { prettifyKV, fixedColors } from '../../utils'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Search from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MoneyOff from '@material-ui/icons/MoneyOff';
import Tooltip from '@material-ui/core/Tooltip';

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
const VOUCHERS_CODE_LENGTH = 10
export function SharesApplications() {
    const intl = useIntl()
    const classes = useStyles();
    const params = useParams();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState(params.email || '');
    const [magentoUserId, setMagentoUserId] = useState(params.magentoUserId || '');
    const [paymentReference, setPaymentReference] = useState(params.paymentReference || '');
    const [applicationId, setApplicationId] = useState(params.applicationId || '');
    const [requestDate, setRequestDate] = useState(new Date());
    useSessionTimeoutHandler(error)

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const endpoint = queryString.stringifyUrl(
                {
                    url: '/sharesApplications/search',
                    query: { email, magentoUserId, paymentReference, applicationId }
                },
                { skipEmptyString: true, skipNull: true })

            const result = await efpApiClient.requestEfpApi(endpoint).catch(setError)
            if (!ignore) setResult(result);
        }
        fetchData()
        return () => { ignore = true; }
    }, [email, paymentReference, magentoUserId, applicationId, requestDate]);

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
                return <Link to={`/customer/${row[key]}`}>
                    <Tooltip title='Go to customer file'><p>{row[key]}</p></Tooltip>
                </Link>;
            case 'PaymentReference':
                const isVoucherCode = row[key].length === VOUCHERS_CODE_LENGTH
                return isVoucherCode ? <Link to={`/vouchers/${row[key]}`}>
                    <Tooltip title='Go to voucher code details'><p>{row[key]}</p></Tooltip>
                </Link> : prettifyKV(key, row[key]);

            case 'ReferralCode':
                return (
                    <Link to={`/customers/referralCode/${row[key]}`}>
                        <Tooltip title='Go to referrer customer file'><p>{row[key]}</p></Tooltip>
                    </Link>)
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
                return prettifyKV(key, row[key]);
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
                        <Grid item xs={12} md={2} >
                            <h2 className={classes.search} >Search<Search /></h2>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="email"
                                // label='Email address'
                                placeholder="gmail"
                                helperText="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2} >
                            <TextField id="magentoUserId"
                                placeholder="123456"
                                // label="Magento User Id"
                                helperText="Magento User Id"
                                value={magentoUserId}
                                onChange={(event) => setMagentoUserId(event.target.value || '')} />

                        </Grid>

                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="paymentReference"
                                placeholder="Ax1Gd424bc"
                                // label=""
                                helperText="Payment Ref/Voucher Code"
                                value={paymentReference}
                                onChange={(event) => setPaymentReference(event.target.value || '')} />
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="applicationId"
                                placeholder="iJyjIUqWmh0o"
                                // label=""
                                helperText="ApplicationId"
                                value={applicationId}
                                onChange={(event) => setApplicationId(event.target.value || '')} />
                        </Grid>
                    </Grid>
                </form>

                <ArrayRenderer
                    title={intl.formatMessage({ id: 'sharesApplications' })}
                    rows={result}
                    columnNames={columnNames}
                    classes={classes}
                    error={error && error.message}
                    cellMapper={getColumnContent} />

            </Scrollbar >
        </Page >
    )
}
export default memo(SharesApplications);
