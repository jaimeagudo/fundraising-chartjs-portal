import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom';

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
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';

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

export function LockedAccounts() {
    const intl = useIntl()
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const helper = (error && error.message) || (!result && 'No data') || '';
    const [requestDate, setRequestDate] = useState(new Date());

    useEffect(() => {
        async function fetchData() {
            const result = await efpApiClient.requestEfpApi(
                `/admin/customers/locked`)
                .catch(setError);
            setResult(result);
        }
        fetchData()
    }, [requestDate]);

    const onUnlockClick = useCallback((magentoUserId) => {
        async function unlockAccount() {
            const result = await efpApiClient.requestEfpApi(
                `/admin/customers/${magentoUserId}/unlock/BDIPA`,
                { method: 'PUT', })
                .catch(setError);
            setResult(result);
            setRequestDate(new Date());
        }
        unlockAccount()
    }, []);

    const onUnlockAllClick = useCallback(() => {
        async function unlockAccount() {
            const result = await efpApiClient.requestEfpApi(
                `/admin/customers/all/unlock`,
                { method: 'PUT', })
                .catch(setError);
            setResult(result);
            setRequestDate(new Date());
        }
        unlockAccount()
    }, [])

    const lockedAccountsColumnNames = result && result && result.length ? [...Object.keys(result[0]), 'Action'] : [];




    const cellMapper = (key, row, classes) => {
        switch (key) {
            case 'magentoUserId': return (<Link to={`/customerInformation/${row.magentoUserId}`}>{row.magentoUserId}</Link>)
            case 'Action': return (<Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => onUnlockClick(row['magentoUserId'])}
                startIcon={<LockOpenIcon />}
            >Unlock  </Button>)
            default: return row[key]
        }

    }
    const lockedAccountsTableRenderer = (columnNames, rows, title, classes) => {
        return (
            <div>
                <h2>
                    {title}
                    {result && result.length && <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        style={{ float: 'right' }}
                        onClick={onUnlockAllClick}
                        startIcon={<LockOpenIcon />}
                    >Unlock All
                    </Button>}
                </h2>
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
                                    {columnNames.map(key =>
                                        <StyledTableCell align="right">
                                            {cellMapper(key, row, classes)}
                                        </StyledTableCell>)}
                                </StyledTableRow>
                            )) : <FormHelperText>No data</FormHelperText>}
                        </TableBody>
                    </Table>
                </TableContainer >
            </div >)
    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'lockedAccounts' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'lockedAccounts' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                {lockedAccountsTableRenderer(lockedAccountsColumnNames, (result) || [], 'Locked Accounts', classes)}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(LockedAccounts);
