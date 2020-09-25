import React, { useState, useEffect, memo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'

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
import Button from '@material-ui/core/Button';
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

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
}));



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
                {method: 'POST',})
                .catch(setError);
            setRequestDate(new Date());
        }
        refundClick()
    }, []);

    const columnNames = result && result.length ? Object.keys(result[0]) : []
    const helper = (error && error.message) || ((!result || !result.length) && 'No data')

    const getColumnContent = (row, key) => {
        switch  (key) {
            case 'MagentoUserId':
                return <Link to={`/customerInformation/${row.MagentoUserId}`}>{row.MagentoUserId}</Link>;
            case 'RefundedAt':
                return row.RefundedAt ? row.RefundedAt :   <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => onRefundClick(row.PaymentReference) }
                startIcon={<MoneyOff />}
            >Refund
            </Button>
            default:
                return row[key];
        }
    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'sharesApplications' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'sharesApplications' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <Paper className={classes.paper}>

                    <form noValidate autoComplete="off">
                        <Grid container spacing={6}>
                            <Grid item >
                                <TextField id="email" label="Email" value={email} onChange={(event) => setEmail(event.target.value || '')} />
                            </Grid>
                            <Grid item >
                                <TextField id="magentoUserId" label="Magento User Id" value={magentoUserId} onChange={(event) => setMagentoUserId(event.target.value || '')} />
                            </Grid>
                            <Grid item >
                                <TextField id="paymentReference" label="Payment Reference" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value || '')} />
                            </Grid>

                        </Grid>
                    </form>
                </Paper>
                <Paper className={classes.root}>

                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow >
                                    {columnNames.map(key =>
                                        <StyledTableCell key={key} align="right">{key}</StyledTableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {result && result.map((row) => (
                                    <StyledTableRow key={row.ApplicationId}>
                                        {columnNames.map((key, i) =>
                                            <StyledTableCell align="right" key={row.ApplicationId + i}>
                                                {getColumnContent(row, key)}
                                            </StyledTableCell>)}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                        <FormHelperText>{helper}</FormHelperText>
                    </FormControl>
                </Paper>
            </Scrollbar>
        </Page >
    )
}
export default memo(SharesApplications);
