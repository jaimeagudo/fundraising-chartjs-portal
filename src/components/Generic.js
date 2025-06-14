import React, { useMemo, memo } from 'react';
import { Parser } from 'json2csv';
import { pretiffyKey, prettifyKV, } from '../utils'

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
import { makeStyles, } from '@material-ui/core/styles';
import { CSVLink, } from "react-csv";

const EXTENSION = '.csv'
const fixLineEnds = s => s // s.replace(/[\n]/gm, '\r\n\r\n')
const excelParsingOptions = { excelStrings: true, delimiter: ';', withBom: true, } //encoding: 'utf8-bom', eol: '\r\n'



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
        padding: theme.spacing(2),
        marginBottom: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
}));

const defaultCellMapper = (row, key, classes) => prettifyKV(key, row[key])

const ArrayRenderer = memo(({ columnNames, rows, title, classes, cellMapper = defaultCellMapper, error = null, showLength = false, stickyHeader = false }) => {
    const helper = error || (rows && rows.length ? '' : 'No data')
    const startIcon = <CopyIcon />

    const genericClasses = useStyles()
    const data = rows && rows.length ? rows : null; //[rows]
    const filename = title + EXTENSION
    const linkStyle = { color: '#00AFDB' };
    return (
        <Paper className={genericClasses.paper} key={title}>
            <h2 className={classes.title}>{title}</h2>
            {data ?
                (<CSVLink
                    separator={";"}
                    data={data}
                    style={linkStyle}
                    filename={filename}
                    target="_blank">
                    <Button color="primary" startIcon={startIcon}>DOWNLOAD AS CSV</Button>
                </CSVLink>)
                : null}
            <TableContainer >
                <Table stickyHeader className={classes.table} aria-label="customized table">
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
        </Paper >)
})


const ObjectRenderer = memo(({ obj, classes, name }) => {

    const genericClasses = useStyles()
    /*Non empty/null values are listed first */
    const fields = useMemo(() => obj ? Object.keys(obj).sort((a, b) => !!obj[a] && !obj[b] ? -1 : 0) : [], [obj])
    const title = pretiffyKey(name)
    const text = useMemo(() => fixLineEnds(new Parser({ fields, ...excelParsingOptions }).parse(obj)), [obj, fields])

    const filename = title + EXTENSION
    const linkStyle = { color: '#00AFDB' };
    const startIcon = <CopyIcon />

    if (!obj) {
        return null
    }


    return (
        <Paper className={genericClasses.paper} key={title}>
            <h2 className={classes.title}>{title}</h2>
            {text ?
                (<CSVLink
                    separator={";"}
                    data={text}
                    style={linkStyle}
                    filename={filename}
                    target="_blank">
                    <Button color="primary" startIcon={startIcon}>DOWNLOAD AS CSV</Button>
                </CSVLink>)
                : null}
            <TableContainer >
                <Table className={classes.table} aria-label="simple table">
                    <TableBody>
                        {fields.map((key, i) =>
                            <StyledTableRow key={i}>
                                <TableCell component="th" scope="row" ><b>{pretiffyKey(key)}</b></TableCell>
                                <TableCell align="right">{prettifyKV(key, obj[key])}</TableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>)

})
export { ObjectRenderer, ArrayRenderer }
