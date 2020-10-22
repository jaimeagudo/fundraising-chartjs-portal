import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'
import { useParams, Link } from 'react-router-dom';


import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { ArrayRenderer } from 'components/Generic'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';

import { prettifyKV, } from '../../utils'
import efpApiClient from '../../services/efpApiClient';
import useSessionTimeoutHandler from 'hooks/useSessionTimeoutHandler'
import { useSnackbar } from 'notistack'



const useStyles = makeStyles((theme) => ({

    title: {
        paddingLeft: theme.spacing(1),
    },
    status: {
        flexGrow: 1,
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(4),
        color: theme.palette.text.secondary,
    },
}));



const NONE = -1;

export function Reward() {
    const intl = useIntl()
    const classes = useStyles();
    const { rewardId, rewardName } = useParams();
    console.log("Reward -> title", rewardName)

    const [error, setError] = useState(null);
    const [rewardStock, setRewardStock] = useState([]);
    const [selectedRewardId, selectRewardId] = React.useState(NONE);
    const [selectedAmount, selectAmount] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar()
    useSessionTimeoutHandler(error)

    const handleChangeAmount = useCallback((event) => {
        selectAmount(event.target.value);
    }, []);

    const handleCloseDialog = useCallback(() => {
        selectAmount(0)
        selectRewardId(NONE);
    }, []);

    const fetchRewards = useCallback(async () => {
        const resultS = await efpApiClient.requestEfpApi(
            `/rewards/${rewardId}/topUps`)
            .catch(setError);
        setRewardStock(resultS);
    }, [rewardId]);

    useEffect(() => {
        fetchRewards()
    }, [fetchRewards])

    const onTopUpClick = useCallback(() => {
        async function topUpReward() {
            const result = await efpApiClient.requestEfpApi(
                `/admin/rewards/${selectedRewardId}/topup/${selectedAmount}`,
                { method: 'POST', })
                .catch(setError);
            handleCloseDialog()
            if (result && result.id) {
                enqueueSnackbar(intl.formatMessage({ id: 'topUpSuccess' }), { variant: 'success' })
                fetchRewards()
            }
        }
        topUpReward()
    }, [selectedRewardId, selectedAmount, enqueueSnackbar, intl, fetchRewards, handleCloseDialog]);



    const cellMapper = (row, key, classes) => {
        switch (key) {
            case 'customerId':
                return <Link to={`/customer/${row[key]}`}><Tooltip title='Go to customer file'><p>{row[key]}</p></Tooltip></Link>;
            default:
                return prettifyKV(key, row[key])
        }

    }
    const visibleSubSet = rewardStock.map(({ amount, customerId, createdAt }) => ({ amount, customerId, createdAt }))

    const columns = visibleSubSet && visibleSubSet.length ? Object.keys(visibleSubSet[0]) : []
    const helper = !visibleSubSet || !visibleSubSet.length ? 'No data' : '';
    const title = 'Reward Top ups'

    return (
        <Page pageTitle={title}>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                <Paper>
                    <Grid
                        container
                        spacing={2}
                        className={classes.status} >
                        <Grid item xs={8} >
                            <TextField
                                label="Reward name"
                                value={rewardName}
                                InputProps={{ readOnly: true, }}
                                variant="outlined"
                                fullWidth />
                        </Grid>
                        <Grid item xs={4} >
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={() => selectRewardId(rewardId)}
                                startIcon={<PlaylistAddIcon />}>
                                {intl.formatMessage({ id: 'topUp' })}
                            </Button>

                        </Grid>
                    </Grid>

                </Paper>
                {visibleSubSet && <ArrayRenderer
                    columnNames={columns}
                    rows={visibleSubSet}
                    classes={classes}
                    cellMapper={cellMapper} />}

                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
            <Dialog open={selectedRewardId !== NONE} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{intl.formatMessage({ id: 'topUpStock' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {visibleSubSet ? (visibleSubSet.find(r => r?.rewardId === selectedRewardId)?.title || '') : ''}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount to top up"
                        helperText="Negative amounts ARE valid"
                        type="number"
                        onChange={handleChangeAmount}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" >
                        {intl.formatMessage({ id: 'cancel' })}
                    </Button>
                    <Button onClick={onTopUpClick} variant="contained" color="secondary">
                        {intl.formatMessage({ id: 'topUp' })}
                    </Button>
                </DialogActions>
            </Dialog>

        </Page >
    )
}
export default memo(Reward);
