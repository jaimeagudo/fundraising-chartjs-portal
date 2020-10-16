import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { useParams, useHistory, Link } from 'react-router-dom';
import queryString from 'query-string';

import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { ArrayRenderer } from 'components/Generic'
import Paper from '@material-ui/core/Paper';
import Search from '@material-ui/icons/Search';
import { prettifyValue } from '../../utils'
import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'


const flex = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-evenly'
}

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
        ...flex,
        padding: theme.spacing(8),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


function CustomersSearch() {
    const params = useParams();
    const intl = useIntl()
    const classes = useStyles();
    const [email, setEmail] = useState(params.email || '');
    const [magentoUserId, setMagentoUserId] = useState(params.magentoUserId || '');
    const [referralCode, setReferralCode] = useState(params.referralCode || '');
    const [error, setError] = useState(null);
    useSessionTimeoutHandler(error)
    const history = useHistory()

    const [participants, setParticipants] = useState(null);
    const helper = (error && error.message) || '';

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function search() {
            const endpoint = queryString.stringifyUrl(
                { url: '/customers/search', query: { email, magentoUserId, referralCode, limit: 20 } },
                { skipEmptyString: true, skipNull: true })

            const result = await efpApiClient.requestEfpApi(endpoint, { signal })
                .catch(e => e && !e.message.indexOf('aborted') && setError(e));

            if (params.referralCode && result && result.length === 1) {
                history.push(`/customer/${result[0].magentoUserId}`)
            } else {
                setParticipants(result);
            }
        }
        (referralCode || magentoUserId || (email && email.length > 3)) && search()
        return function cleanup() {
            // console.log(`#### cancelling /customers/search?email=${email}&magentoUserId=${magentoUserId}`)
            controller.abort()
        }
    }, [magentoUserId, email, referralCode]);

    const participantsCellMapper = (row, key, classes) => {
        switch (key) {
            case 'magentoUserId':
                return <Link to={`/customer/${row[key]}`}><Tooltip title='Go to customer file'><p>{row[key]}</p></Tooltip></Link>;
            default:
                return prettifyValue(row[key]);
        }
    }

    const columnNames = participants && participants.length ? Object.keys(participants[0]) : [];

    return (
        <Page pageTitle={intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'customerInformation' }, { magentoUserId })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12} md={3}  >
                            <h2 className={classes.search} >Search<Search /></h2>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}   >
                            <TextField id="email"
                                // label='Email address'
                                placeholder="gmail"
                                helperText="Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={12} sm={4} md={3}  >
                            <TextField id="magentoUserId"
                                placeholder="123456"
                                // label="Magento User Id"
                                helperText="Magento User Id"
                                value={magentoUserId}
                                onChange={(event) => setMagentoUserId(event.target.value || '')} />

                        </Grid>
                        <Grid item xs={12} sm={4} md={3}  >
                            <TextField id="referralCode"
                                placeholder="R123456"
                                // label="Magento User Id"
                                helperText="Referral code"
                                value={referralCode}
                                onChange={(event) => setReferralCode(event.target.value || '')} />
                        </Grid>
                    </Grid>
                </form>
                <Paper className={classes.root}>
                    <ArrayRenderer title={participants && participants.length ? 'Customers' : ''}
                        dense
                        columnNames={columnNames}
                        rows={participants}
                        classes={classes}
                        cellMapper={participantsCellMapper} />
                </Paper>
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
        </Page >
    )
}
export default memo(CustomersSearch);
