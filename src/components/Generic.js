import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import FormHelperText from '@material-ui/core/FormHelperText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { pretiffyKey, prettifyValue } from '../utils'

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

const ArrayRenderer = (columnNames, rows, title, classes) => (
    <div key={title}>
        <h2>{title}</h2>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        {columnNames.map((key, j) => <StyledTableCell key={title + key + j} align="right">{key}</StyledTableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length ? rows.map((row, i) => (
                        <StyledTableRow key={i}>
                            {columnNames.map((columnName, k) =>
                                <StyledTableCell key={k} align="right">
                                    {row[columnName]}
                                </StyledTableCell>)}
                        </StyledTableRow>
                    )) : <FormHelperText>No data</FormHelperText>}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)


const ObjectRenderer = ({ obj, classes, fieldsWithPences, name }) =>
    (<TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableBody>
                {/*Non empty/null values are listed first */}
                {obj && Object.keys(obj).sort((a, b) => !!obj[a] && !obj[b] ? -1 : 0).map((key, i) =>
                    <StyledTableRow key={name + key + i}>
                        <TableCell component="th" scope="row" ><b>{pretiffyKey(key)}</b></TableCell>
                        <TableCell align="right">{prettifyValue(obj[key], fieldsWithPences.includes(key))}</TableCell>
                    </StyledTableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>)

export { ObjectRenderer, ArrayRenderer }
