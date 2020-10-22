
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom';
import { ArrayRenderer } from 'components/Generic'
import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { prettifyKV } from '../../utils'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Tooltip from '@material-ui/core/Tooltip';


const useStyles = makeStyles({
    title: {
        paddingLeft: 10,
    },
    p: {
        padding: 10,
        margin: 10
    }
});

export function LockedAccounts() {
    const intl = useIntl()
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const helper = (error && error.message) || (!result && 'No data') || '';
    const [requestDate, setRequestDate] = useState(new Date());
    useSessionTimeoutHandler(error)

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


    const lockedAccountsCellMapper = (row, key, classes) => {
        switch (key) {
            case 'magentoUserId':
                return <Link to={`/customer/${row[key]}`}><Tooltip title='Go to customer file'><p>{row[key]}</p></Tooltip></Link>;
            case 'Action': return (<Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => onUnlockClick(row['magentoUserId'])}
                startIcon={<LockOpenIcon />}
            >Unlock  </Button>)
            default: return prettifyKV(key, row[key])
        }

    }

    return (
        <Page pageTitle={intl.formatMessage({ id: 'lockedAccounts' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'lockedAccounts' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <p className={classes.p}>{intl.formatMessage({ id: 'lockedCustomerExplanation' })}
                    {result && result.length && <Button
                        className={classes.p}
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        style={{ float: 'right' }}
                        onClick={onUnlockAllClick}
                        startIcon={<LockOpenIcon />}
                    >Unlock All
                    </Button>}
                </p>
                <ArrayRenderer
                    rows={result}
                    columnNames={lockedAccountsColumnNames}
                    classes={classes}
                    error={error && error.message}
                    cellMapper={lockedAccountsCellMapper} />
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(LockedAccounts);
