import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { format, parseISO } from 'date-fns'


const DATE_FORMAT_STRING = 'yyyy-MM-dd'
const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);
function pretiffyKey(name) {
    const words = name.match(/[A-Za-z][a-z]*/g) || [];
    return words.map(capitalize).join(" ");
}

// eslint-disable-next-line no-restricted-globals
const prettifyValue = (field, withPences) => {
    switch (typeof field) {
        case 'number':
            // eslint-disable-next-line radix
            return Number.parseFloat(withPences ? (field / 100) : field).toLocaleString(undefined, { maximumFractionDigits: 2 })
        case 'string':
            try {
                return format(parseISO(field), DATE_FORMAT_STRING)
            } catch (e) {
                return field
            }
        case 'object': return JSON.stringify(field)
        default: return field;
    }
}


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);


export default ({ obj, classes, fieldsWithPences }) =>
    (<TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
            <TableBody>
                {obj && Object.keys(obj).map(key =>
                    <StyledTableRow key={key}>
                        <TableCell component="th" scope="row" ><b>{pretiffyKey(key)}</b></TableCell>
                        <TableCell align="right">{prettifyValue(obj[key], fieldsWithPences.includes(key))}</TableCell>
                    </StyledTableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>)
