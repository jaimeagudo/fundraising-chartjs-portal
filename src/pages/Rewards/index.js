import React, { useState, useEffect, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl'


import { withStyles, makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import TextField from '@material-ui/core/TextField';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { ArrayRenderer } from 'components/Generic'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import efpApiClient from '../../services/efpApiClient';
import { useSnackbar } from 'notistack'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

const NONE = -1;

export function Benefits() {
    const intl = useIntl()
    const classes = useStyles();
    const [error, setError] = useState(null);
    const [sharesRewards, setSharesRewards] = useState([]);
    const [referralRewards, setReferralRewards] = useState([]);
    const [selectedRewardId, selectRewardId] = React.useState(NONE);
    const [selectedAmount, selectAmount] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar()

    const handleChangeAmount = useCallback((event) => {
        selectAmount(event.target.value);
    }, []);

    const handleCloseDialog = useCallback(() => {
        selectAmount(0)
        selectRewardId(NONE);
    }, []);

    const fetchRewards = useCallback(async () => {
        const resultS = await efpApiClient.requestEfpApi(
            `/rewards/shares/BDIPA`)
            .catch(setError);
        setSharesRewards(resultS);
        const resultR = await efpApiClient.requestEfpApi(
            `/rewards/referrals/BDIPA`)
            .catch(setError);
        setReferralRewards(resultR);
    }, []);

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
            case 'Action': return (
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => selectRewardId(row['rewardId'])}
                    startIcon={<PlaylistAddIcon />}>
                    {intl.formatMessage({ id: 'topUp' })}
                </Button>)
            default: return row[key]
        }

    }


    const sharesRewardsColumns = sharesRewards.length ? ['Action', ...Object.keys(sharesRewards[0])] : []
    const referralRewardsColumns = referralRewards.length ? ['Action', ...Object.keys(referralRewards[0])] : []

    const helper = !referralRewards.length && !sharesRewards.length ? 'No data' : '';


    return (
        <Page pageTitle={intl.formatMessage({ id: 'investorsRewards' })}>
            <Helmet>
                <title>{intl.formatMessage({ id: 'investorsRewards' })}</title>
            </Helmet>
            <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }} >
                {sharesRewards && <ArrayRenderer
                    columnNames={sharesRewardsColumns}
                    rows={sharesRewards}
                    title={intl.formatMessage({ id: 'sharesRewards' })}
                    classes={classes}
                    cellMapper={cellMapper} />}
                {referralRewards && <ArrayRenderer
                    columnNames={referralRewardsColumns}
                    rows={referralRewards}
                    title={intl.formatMessage({ id: 'referralsRewards' })}
                    classes={classes} cellMapper={cellMapper} />}
                <FormControl component="fieldset" error={!!error} className={classes.formControl}>
                    <FormHelperText>{helper}</FormHelperText>
                </FormControl>
            </Scrollbar>
            <Dialog open={selectedRewardId !== NONE} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{intl.formatMessage({ id: 'topUpStock' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {referralRewards.concat(sharesRewards).find(r => r.rewardId === selectedRewardId)?.title || ''}
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
export default memo(Benefits);
