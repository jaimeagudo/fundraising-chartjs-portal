import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { pretiffyKey, prettifyValue } from '../utils'

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
                {/*Non empty/null values are listed first */}
                {obj && Object.keys(obj).sort((a, b) => !!obj[a] && !obj[b] ? -1 : 0).map(key =>
                    <StyledTableRow key={key}>
                        <TableCell component="th" scope="row" ><b>{pretiffyKey(key)}</b></TableCell>
                        <TableCell align="right">{prettifyValue(obj[key], fieldsWithPences.includes(key))}</TableCell>
                    </StyledTableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>)
