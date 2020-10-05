import React from 'react';
import { Parser } from 'json2csv';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { pretiffyKey, prettifyValue } from '../utils'

import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CopyIcon from '@material-ui/icons/GetApp';


import Typography from '@material-ui/core/Typography'

import { useSnackbar } from 'notistack'
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

const defaultCellMapper = (row, key, classes) => prettifyValue(row[key])

const ArrayRenderer = ({ columnNames, rows, title, classes, cellMapper = defaultCellMapper, error = null }) => {
    const { enqueueSnackbar } = useSnackbar()
    const helper = error || (rows && rows.length ? '' : 'No data')

    return (
        <div key={title}>
            {/* <Typography variant="h2">{title}</Typography> */}
            <h2>{title}</h2>
            {rows && rows.length &&
                <CopyToClipboard text={new Parser().parse(rows)}
                    onCopy={() => enqueueSnackbar(`${title} copied`, { variant: 'success' })} >
                    <Button color="primary" startIcon={<CopyIcon />}>Copy to clipboard</Button>
                </CopyToClipboard>}
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    {rows && rows.length ?
                        (<TableHead>
                            <TableRow>
                                {columnNames.map((key, j) => <StyledTableCell key={j} align="right">{key}</StyledTableCell>)}
                            </TableRow>
                        </TableHead>) :
                        null}
                    <TableBody>
                        {rows && rows.length ?
                            rows.map((row, i) => (
                                <StyledTableRow key={i}>
                                    {columnNames.map((columnName, k) =>
                                        <StyledTableCell key={k} align="right">
                                            {cellMapper(row, columnName, classes)}
                                        </StyledTableCell>)}
                                </StyledTableRow>
                            )) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                <FormHelperText>{helper}</FormHelperText>
            </FormControl>
        </div >)
}


const ObjectRenderer = ({ obj, classes, fieldsWithPences, name }) => {
    const { enqueueSnackbar } = useSnackbar()

    if (!obj) {
        return null
    }

    /*Non empty/null values are listed first */
    const fields = Object.keys(obj).sort((a, b) => !!obj[a] && !obj[b] ? -1 : 0)
    const title = pretiffyKey(name)
    return (<div key={name} >
        <h2>{title}</h2>
        {<CopyToClipboard text={new Parser({ fields }).parse(obj)}
            onCopy={() => enqueueSnackbar(`${title} copied`, { variant: 'success' })} >
            <Button color="primary" startIcon={<CopyIcon />}>Copy to clipboard</Button>
        </CopyToClipboard>}
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableBody>
                    {fields.map((key, i) =>
                        <StyledTableRow key={i}>
                            <TableCell component="th" scope="row" ><b>{pretiffyKey(key)}</b></TableCell>
                            <TableCell align="right">{prettifyValue(obj[key], fieldsWithPences.includes(key))}</TableCell>
                        </StyledTableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}
export { ObjectRenderer, ArrayRenderer }
