import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux';
import { useMenu } from 'material-ui-shell/lib/providers/Menu'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress';

import efpApiClient from 'services/efpApiClient'
import { changeCampaign, loadCampaigns } from 'state/campaign/actions'

const useStyles = makeStyles((theme) => ({
    paper: {
        width: 'auto',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(620 + theme.spacing(6))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        width: 192,
        height: 192,
        color: theme.palette.secondary.main,
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: `100%`,
    },
}))
const snackBarErrorOptions = {
    variant: 'error',
    anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
    },
};

const SignIn = () => {
    const classes = useStyles()
    const intl = useIntl()
    const history = useHistory()
    const dispatch = useDispatch()
    const { current, campaigns, loading } = useSelector(state => state.campaign)

    const [ipocode, setIpocode] = React.useState(current);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { setAuthMenuOpen } = useMenu()
    const { setAuth } = useAuth()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        dispatch(loadCampaigns())
    }, [dispatch])

    const handleIpoCodeChange = useCallback((event) => {
        const code = event.target.value
        setIpocode(code)
        dispatch(changeCampaign(code))
    }, [dispatch])


    const onSubmit = useCallback((event) => {

        async function handleSubmit() {
            const response = await efpApiClient.authenticate(username, password).catch(e =>
                enqueueSnackbar(e.status === 401 ? 'Unauthorized' : e.message, snackBarErrorOptions)
            )

            if (response && response.accessToken) {
                const user = {
                    accessToken: response.accessToken,
                    displayName: response.displayName,
                    email: username,
                }
                setAuth({ isAuthenticated: true, ...user })
                setAuthMenuOpen(false)
                history.replace('/home')
            }
        }
        event.preventDefault()
        handleSubmit()
    }, [setAuth, setAuthMenuOpen, history, username, password, enqueueSnackbar])

    return (
        <Page pageTitle={intl.formatMessage({ id: 'signIn' })}>
            <Paper className={classes.paper} elevation={6}>
                <div className={classes.container}>
                    <Typography component="h1" variant="h5">
                        {intl.formatMessage({ id: 'signIn' })}
                    </Typography>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <TextField
                            value={username}
                            onInput={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label={intl.formatMessage({ id: 'username' })}
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            value={password}
                            onInput={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={intl.formatMessage({ id: 'password' })}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <InputLabel id="campaignLabel">Campaign</InputLabel>
                        {loading ? <CircularProgress /> :
                            <div>
                                <Select
                                    labelId="ipoCode"
                                    id="ipoCode"
                                    label='Campaign'
                                    fullWidth
                                    variant="outlined"
                                    value={ipocode}
                                    onChange={handleIpoCodeChange} >
                                    {campaigns.map(campaign =>
                                        <MenuItem key={campaign.id} value={campaign.id}>{campaign.id}</MenuItem>
                                    )}
                                </Select>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    {intl.formatMessage({ id: 'signIn' })}
                                </Button>
                            </div>
                        }
                    </form>
                </div>
            </Paper>
        </Page>
    )
}

export default SignIn
