import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl, FormattedMessage } from 'react-intl'

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



export function SharesApplications() {
    const intl = useIntl()
    const classes = useStyles();

    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('@yahoo');
    const [magentoUserId, setMagentoUserId] = useState('');
    const [paymentReference, setPaymentReference] = useState('16000732383454638');

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
    }, [email, paymentReference, magentoUserId]);


    const columnNames = result && result.length ? Object.keys(result[0]) : []
    const helper = (error && error.message) || ((!result || !result.length) && 'No data')

    return (
        <Page pageTitle={intl.formatMessage({ id: 'sharesApplications' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'sharesApplications' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <form noValidate autoComplete="off">
                    <TextField id="email" label="Email" value={email} onChange={(event) => setEmail(event.target.value || '')} />
                    <TextField id="magentoUserId" label="Magento User Id" value={magentoUserId} onChange={(event) => setMagentoUserId(event.target.value || '')} />
                    <TextField id="paymentReference" label="Payment Reference" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value || '')} />
                </form>
                <Paper className={classes.root}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    {columnNames.map(key => <StyledTableCell align="right">{key}</StyledTableCell>)}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {result && result.map((row) => (
                                    <StyledTableRow key={row[columnNames[0]]}>
                                        {columnNames.map(key => <StyledTableCell align="right">{row[key]}</StyledTableCell>)}
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
