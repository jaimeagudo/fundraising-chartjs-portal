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

const IPOCODE = 'BDIPA'

export function Vouchers() {
    const intl = useIntl()
    const classes = useStyles();
    const params = useParams();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [Code, setCode] = useState(params.code || '');
    const [RedeemUserId, setRedeemUserId] = useState(params.email || '');
    const [BuyerMagentoUserId, setBuyerMagentoUserId] = useState(params.BuyerMagentoUserId || '');
    const [PaymentReference, setPaymentReference] = useState(params.PaymentReference || '');
    const [requestDate, setRequestDate] = useState(new Date());
    useSessionTimeoutHandler(error)

    useEffect(() => {
        let ignore = false;
        async function fetchData() {
            const endpoint = queryString.stringifyUrl(
                {
                    url: `/admin/vouchers/${IPOCODE}/search`,
                    query: { Code, RedeemUserId, BuyerMagentoUserId, PaymentReference, limit: 10 }
                },
                { skipEmptyString: true, skipNull: true })

            const result = await efpApiClient.requestEfpApi(endpoint).catch(setError)
            if (!ignore) setResult(result);
        }
        fetchData()
        return () => { ignore = true; }
    }, [Code, RedeemUserId, PaymentReference, BuyerMagentoUserId, requestDate]);

    // const onRefundClick = useCallback((PaymentReference) => {
    //     async function refundClick() {
    //         await efpApiClient.requestEfpApi(
    //             `/admin/vouchers/${PaymentReference}/refund`,
    //             { method: 'POST', })
    //             .catch(setError);
    //         setRequestDate(new Date());
    //     }
    //     refundClick()
    // }, []);

    const columnNames = result && result.length ? ['Action', ...Object.keys(result[0])] : []

    const getColumnContent = (row, key, classes) => {
        switch (key) {
            case 'BuyerMagentoUserId':
                return <Link to={`/customer/${row[key]}`}>
                    <Tooltip title='Go to buyer customer file'><p>{row[key]}</p></Tooltip>
                </Link>;
            case 'RedeemUserId':
                return <Link to={`/customer/${row[key]}`}>
                    <Tooltip title='Go to redeemer customer file'><p>{row[key]}</p></Tooltip>
                </Link>;
            case 'Action':
                return row.RedeemUserId ? <Link to={`/sharesApplications/paymentReference/${row.Code}`}>
                    <Tooltip title='Go to redeemer customer file'><p>Go to application</p></Tooltip>
                </Link> : ''
            // case 'RefundDate':
            //     return row.RefundDate ||
            //         <Button
            //             variant="contained"
            //             color="secondary"
            //             className={classes.button}
            //             onClick={() => onRefundClick(row.PaymentReference)}
            //             startIcon={<MoneyOff />}>
            //             Refund
            //         </Button>
            default:
                return prettifyKV(key, row[key]);
        }
    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'vouchers' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'vouchers' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={2} >
                            <h2 className={classes.search} >Search<Search /></h2>
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="Voucher Code"
                                // label='Email address'
                                placeholder="Ax1Gd424bc"
                                helperText="Voucher Code"
                                value={Code}
                                onChange={(event) => setCode(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="PaymentReference"
                                placeholder="159976854530000"
                                // label=""
                                helperText="Payment Ref"
                                value={PaymentReference}
                                onChange={(event) => setPaymentReference(event.target.value || '')} />
                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2}  >
                            <TextField id="RedeemUserId"
                                // label='Email address'
                                placeholder="1234"
                                helperText="Redeemer UserId"
                                value={RedeemUserId}
                                onChange={(event) => setRedeemUserId(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={6} sm={6} md={2} lg={2} >
                            <TextField id="magentoUserId"
                                placeholder="5678"
                                // label="Magento User Id"
                                helperText="Buyer User Id"
                                value={BuyerMagentoUserId}
                                onChange={(event) => setBuyerMagentoUserId(event.target.value || '')} />
                        </Grid>
                    </Grid>
                </form>

                <ArrayRenderer
                    title={intl.formatMessage({ id: 'vouchers' })}
                    rows={result}
                    columnNames={columnNames}
                    classes={classes}
                    error={error && error.message}
                    cellMapper={getColumnContent} />

            </Scrollbar >
        </Page >
    )
}
export default memo(Vouchers);
