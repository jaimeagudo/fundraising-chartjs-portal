import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { useParams, Link } from 'react-router-dom';
import queryString from 'query-string';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MoneyOff from '@material-ui/icons/MoneyOff';
import { ArrayRenderer } from 'components/Generic'
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';
import { prettifyValue } from '../../utils'
import efpApiClient from '../../services/efpApiClient';
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

const getColumnNames = (obj, fieldName) => obj && obj[fieldName] && obj[fieldName].length ? Object.keys(obj[fieldName][0] || []) : [];

export function CustomerInformation() {
    const params = useParams();
    const intl = useIntl()
    const classes = useStyles();
    const [email, setEmail] = useState(params.email || '');
    const [magentoUserId, setMagentoUserId] = useState(params.magentoUserId || '');
    const [selectedMagentoUserId, setSelectedMagentoUserId] = useState(params.magentoUserId || '');

    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)

    const [customer, setCustomer] = useState(null);
    const [participants, setParticipants] = useState(null);
    const helper = (error && error.message) || (!customer && 'No data') || '';

    useEffect(() => {
        async function fetchCustomer() {
            const result = await efpApiClient.requestEfpApi(
                `/customers/${selectedMagentoUserId}/all-information/BDIPA`)
                .catch(setError);
            setCustomer(result);
        }
        selectedMagentoUserId && fetchCustomer()
        console.log("fetchAll -> selectedMagentoUserId", selectedMagentoUserId)

    }, [selectedMagentoUserId])



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function search() {
            const endpoint = queryString.stringifyUrl(
                { url: '/customers/search', query: { email, magentoUserId, limit: 5 } },
                { skipEmptyString: true, skipNull: true })

            const result = await efpApiClient.requestEfpApi(endpoint, { signal })
                .catch(e => e && !e.message.indexOf('aborted') && setError(e));
            setParticipants(result);
        }
        (magentoUserId || (email && email.length > 3)) && search()
        return function cleanup() {
            console.log(`#### cancelling /customers/search?email=${email}&magentoUserId=${magentoUserId}`)
            controller.abort()
        }
    }, [magentoUserId, email]);

    const onRefundClick = useCallback((paymentReference) => {
        console.log(paymentReference)
        async function refundClick() {
            await efpApiClient.requestEfpApi(
                `/admin/sharesApplications/${paymentReference}/refund`,
                { method: 'POST', })
                .catch(setError);
        }
        refundClick()
    }, []);

    const onUnlockClick = useCallback(() => {
        async function unlockAccount() {
            const unlockResult = await efpApiClient.requestEfpApi(
                `/admin/customers/${magentoUserId}/unlock/BDIPA`,
                { method: 'PUT', })
                .catch(setError);
            setCustomer(unlockResult);
        }
        unlockAccount()
    }, [magentoUserId])




    const participantsCellMapper = (row, key, classes) => {
        switch (key) {
            case 'Action':
                return (<Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => setSelectedMagentoUserId(row.magentoUserId)}
                >
                    select
                </Button>)
            default:
                return prettifyValue(row[key]);
        }
    }



    const customerDataCellMapper = (row, key, classes) => {
        switch (key) {
            case 'BuyerMagentoUserId':
                return <Link to={`/customers/${row.BuyerMagentoUserId}`}>{row.BuyerMagentoUserId}</Link>;
            case 'RedeemUserId':
                return <Link to={`/customers/${row.RedeemUserId}`}>{row.RedeemUserId}</Link>;
            case 'RefundDate':
                return row.RefundDate ?
                    row.RefundDate :
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={() => onRefundClick(row.Code)}
                        startIcon={<MoneyOff />}>
                        Refund
                    </Button>
            default:
                return prettifyValue(row[key]);
        }
    }
    const columnNames = {
        purchasedVouchers: getColumnNames(customer, 'purchasedVouchers'),
        claimedShareRewards: getColumnNames(customer, 'claimedShareRewards'),
        claimedReferralRewards: getColumnNames(customer, 'claimedReferralRewards'),
        referralLeagueEvents: getColumnNames(customer, 'referralLeagueEvents'),
        discountCards: getColumnNames(customer, 'discountCards'),
        participants: participants && participants.length ? ['Action', ...Object.keys(participants[0])] : [],
    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}</title>
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


                    </Grid>
                </form>

                <Paper className={classes.root}>
                    <ArrayRenderer title={participants && participants.length ? 'Customers' : ''}
                        dense
                        columnNames={columnNames.participants}
                        rows={participants}
                        classes={classes}
                        cellMapper={participantsCellMapper} />
                </Paper>

                {customer &&
                    <Paper className={classes.root}>
                        <h1>Basic details</h1>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Magento Id"
                                    value={customer.magentoUserId}
                                    InputProps={{ readOnly: true, }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label={customer.lockedAccountAt ? "Account locked on" : "Account"}
                                    error={!!customer.lockedAccountAt}
                                    value={customer.lockedAccountAt || "Unlocked"}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (customer.lockedAccountAt ?
                                            <InputAdornment position='start' >
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    className={classes.button}
                                                    onClick={onUnlockClick}
                                                    startIcon={<LockOpenIcon />}
                                                >Unlock
                                            </Button>
                                            </InputAdornment> : null
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id='NumberofShares'
                                    label='EFP-T Shares'
                                    variant="outlined"
                                    defaultValue={'  '}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position='start' >
                                                {customer.numberOfShares ?
                                                    (<Link to={`/sharesApplications/user/${customer.magentoUserId}`} color="inherit">
                                                        {customer.numberOfShares}
                                                    </Link>) : "0"}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Referral Code"
                                    value={customer.referralCode || ''}
                                    InputProps={{ readOnly: true, }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Number of Referrals"
                                    value={customer.numberOfReferrals || 0}
                                    InputProps={{ readOnly: true, }}
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={4}>
                                <TextField
                                    label="Referral 7 days position"
                                    value={customer.referralLastSevenDaysPosition || 'N/A'}
                                    InputProps={{ readOnly: true, }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Referral Position"
                                    value={customer.referralOverallPosition || 'N/A'}
                                    InputProps={{ readOnly: true, }}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                        <ArrayRenderer title={'Purchased Vouchers'}
                            columnNames={columnNames.purchasedVouchers}
                            rows={customer.purchasedVouchers}
                            classes={classes}
                            cellMapper={customerDataCellMapper} />
                        <ArrayRenderer title={'Claimed Share Rewards'}
                            columnNames={columnNames.claimedShareRewards}
                            rows={customer.claimedShareRewards}
                            classes={classes}
                            cellMapper={customerDataCellMapper} />
                        <ArrayRenderer title={'Claimed referral Rewards'}
                            columnNames={columnNames.claimedReferralRewards}
                            rows={customer.claimedReferralRewards}
                            classes={classes}
                            cellMapper={customerDataCellMapper} />
                        <ArrayRenderer title={'Referral League Events'}
                            columnNames={columnNames.referralLeagueEvents}
                            rows={customer.referralLeagueEvents}
                            classes={classes}
                            cellMapper={customerDataCellMapper} />
                        <ArrayRenderer title={'Discount Cards'}
                            columnNames={columnNames.discountCards}
                            rows={customer.discountCards}
                            classes={classes}
                            cellMapper={customerDataCellMapper} />
                    </Paper>}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(CustomerInformation);
