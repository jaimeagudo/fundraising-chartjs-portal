import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom';

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
    const helper = (error && error.message) || ((!result || !result.length) && 'No data')

    useEffect(() => {
        console.log('Magento user id: ' + magentoUserId)
        async function fetchData() {
            const result = await efpApiClient.requestEfpApi(
                `/customers/${magentoUserId}/all-information/BDIPA`)
                .catch(setError);
                setResult(result);
        }
        fetchData()
    }, [magentoUserId]);

    const purchasedVouchersColumnNames = result && result.purchasedVouchers && result.purchasedVouchers.length ? Object.keys(result.purchasedVouchers[0]) : [];
    const shareRewardColumnNames = result && result.claimedShareRewards && result.claimedShareRewards.length ? Object.keys(result.claimedShareRewards[0]) : [];
    const referralRewardColumnNames = result && result.claimedReferralRewards && result.claimedReferralRewards.length ? Object.keys(result.claimedReferralRewards[0]) : [];
    const leagueEventsColumnNames = result && result.referralLeagueEvents && result.referralLeagueEvents.length ? Object.keys(result.referralLeagueEvents[0]) : [];
    const discountCardsColumnNames = result && result.discountCards && result.discountCards.length ? Object.keys(result.discountCards[0]) : [];

    return (
        <Page pageTitle={intl.formatMessage({ id: 'customerInformation'}, { magentoUserId })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <h1>Basic details</h1>
                { result &&  <div>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Magento User Id"
                                    defaultValue={result.magentoUserId}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Referral Code"
                                    defaultValue={result.referralCode}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Number of Referrals"
                                    defaultValue={result.numberOfReferrals}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Number of Shares"
                                    defaultValue={result.numberOfShares}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Referral - Last 7 days position"
                                    defaultValue={result.referralLastSevenDaysPosition || 'N/A'}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Referral - Overall position"
                                    defaultValue={result.referralOverallPosition || 'N/A'}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <h2>Purchased Vouchers</h2>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {purchasedVouchersColumnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result && result.purchasedVouchers && result.purchasedVouchers.map((row) => (
                                        <StyledTableRow key={row[purchasedVouchersColumnNames[0]]}>
                                            {purchasedVouchersColumnNames.map(key => <StyledTableCell align="right">
                                                {row[key] }
                                                </StyledTableCell>)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <h2>Claimed Share Rewards</h2>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {shareRewardColumnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result && result.claimedShareRewards && result.claimedShareRewards.map((row) => (
                                        <StyledTableRow key={row[shareRewardColumnNames[0]]}>
                                            {shareRewardColumnNames.map(key => <StyledTableCell align="right">
                                                {row[key] }
                                                </StyledTableCell>)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <h2>Claimed referral rewards</h2>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {referralRewardColumnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result && result.claimedReferralRewards && result.claimedReferralRewards.map((row) => (
                                        <StyledTableRow key={row[referralRewardColumnNames[0]]}>
                                            {referralRewardColumnNames.map(key => <StyledTableCell align="right">
                                                {row[key]}
                                                </StyledTableCell>)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <h2>Referral League Events</h2>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {leagueEventsColumnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result && result.referralLeagueEvents && result.referralLeagueEvents.map((row) => (
                                        <StyledTableRow key={row[leagueEventsColumnNames[0]]}>
                                            {leagueEventsColumnNames.map(key => <StyledTableCell align="right">
                                                {row[key]}
                                                </StyledTableCell>)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <h2>Discount Cards</h2>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {discountCardsColumnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result && result.discountCards && result.discountCards.map((row) => (
                                        <StyledTableRow key={row[discountCardsColumnNames[0]]}>
                                            {discountCardsColumnNames.map(key => <StyledTableCell align="right">
                                                {row[key]}
                                                </StyledTableCell>)}
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>}
                    <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                        <FormHelperText>{helper}</FormHelperText>
                    </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(CustomerInformation);
