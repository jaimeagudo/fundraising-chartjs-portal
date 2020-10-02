import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { useParams, Link } from 'react-router-dom';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Table from '@material-ui/core/Table';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MoneyOff from '@material-ui/icons/MoneyOff';

import efpApiClient from '../../services/efpApiClient';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


export function CustomerInformation() {
    const intl = useIntl()
    const classes = useStyles();
    const { magentoUserId } = useParams();
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const helper = (error && error.message) || (!result && 'No data') || '';
    const [requestDate, setRequestDate] = useState(new Date());

    useEffect(() => {
        console.log('Magento user id: ' + magentoUserId)
        async function fetchData() {
            const result = await efpApiClient.requestEfpApi(
                `/customers/${magentoUserId}/all-information/BDIPA`)
                .catch(setError);
            setResult(result);
        }
        fetchData()
    }, [magentoUserId, requestDate]);

    const onRefundClick = useCallback((paymentReference) => {
        console.log(paymentReference)
        async function refundClick() {
            await efpApiClient.requestEfpApi(
                `/admin/sharesApplications/${paymentReference}/refund`,
                { method: 'POST', })
                .catch(setError);
            setRequestDate(new Date());
        }
        refundClick()
    }, []);

    const onUnlockClick = useCallback(() => {
        async function unlockAccount() {
            const result = await efpApiClient.requestEfpApi(
                `/admin/customers/${magentoUserId}/unlock/BDIPA`,
                { method: 'PUT', })
                .catch(setError);
            setResult(result);
            setRequestDate(new Date());
        }
        unlockAccount()
    }, [magentoUserId])

    const getColumnContent = (row, key) => {
        switch (key) {
            case 'BuyerMagentoUserId':
                return <Link to={`/customerInformation/${row.BuyerMagentoUserId}`}>{row.BuyerMagentoUserId}</Link>;
            case 'RedeemUserId':
                return <Link to={`/customerInformation/${row.RedeemUserId}`}>{row.RedeemUserId}</Link>;
            case 'RefundDate':
                return row.RefundDate ? row.RefundDate : <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => onRefundClick(row.Code)}
                    startIcon={<MoneyOff />}
                >Refund
            </Button>
            default:
                return row[key];
        }
    }

    const tableRenderer = (columnNames, rows, title, classes) => {
        return (
            <div>
                <h2>{title}</h2>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {columnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length ? rows.map((row) => (
                                <StyledTableRow key={row[columnNames[0]]}>
                                    {columnNames.map(key => <StyledTableCell align="right">
                                        {getColumnContent(row, key)}
                                    </StyledTableCell>)}
                                </StyledTableRow>
                            )) : <FormHelperText>No data</FormHelperText>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>)
    }

    const purchasedVouchersColumnNames = result && result.purchasedVouchers && result.purchasedVouchers.length ? Object.keys(result.purchasedVouchers[0]) : [];
    const shareRewardColumnNames = result && result.claimedShareRewards && result.claimedShareRewards.length ? Object.keys(result.claimedShareRewards[0]) : [];
    const referralRewardColumnNames = result && result.claimedReferralRewards && result.claimedReferralRewards.length ? Object.keys(result.claimedReferralRewards[0]) : [];
    const leagueEventsColumnNames = result && result.referralLeagueEvents && result.referralLeagueEvents.length ? Object.keys(result.referralLeagueEvents[0]) : [];
    const discountCardsColumnNames = result && result.discountCards && result.discountCards.length ? Object.keys(result.discountCards[0]) : [];

    return (
        <Page pageTitle={intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <h1>Basic details</h1>
                {result && <div>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Magento User Id"
                                defaultValue={result.magentoUserId}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Account locked on date"
                                error={!!result.lockedAccountAt}
                                defaultValue={result.lockedAccountAt || "UNLOCKED"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (result.lockedAccountAt ?
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

                        <Grid item xs={3}>


                            <TextField
                                required
                                id='NumberofShares'
                                label='Number of Shares'
                                variant="outlined"
                                defaultValue={'  '}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='start' >
                                            <Link to={`/sharesApplications/user/${result.magentoUserId}`} color="inherit">
                                                {result.numberOfShares}
                                            </Link>
                                        </InputAdornment>
                                    ),
                                }}
                            />


                        </Grid>


                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Referral Code"
                                defaultValue={result.referralCode}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Number of Referrals"
                                defaultValue={result.numberOfReferrals}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Referral - Last 7 days position"
                                defaultValue={result.referralLastSevenDaysPosition || 'N/A'}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Referral - Overall position"
                                defaultValue={result.referralOverallPosition || 'N/A'}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    {tableRenderer(purchasedVouchersColumnNames, (result && result.purchasedVouchers) || [], 'Purchased Vouchers', classes)}
                    {tableRenderer(shareRewardColumnNames, (result && result.claimedShareRewards) || [], 'Claimed Share Rewards', classes)}
                    {tableRenderer(referralRewardColumnNames, (result && result.claimedReferralRewards) || [], 'Claimed referral Rewards', classes)}
                    {tableRenderer(leagueEventsColumnNames, (result && result.referralLeagueEvents) || [], 'Referral League Events', classes)}
                    {tableRenderer(discountCardsColumnNames, (result && result.discountCards) || [], 'Discount Cards', classes)}

                </div>}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(CustomerInformation);
