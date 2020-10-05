import { useEffect } from 'react';
import { useSnackbar } from 'notistack'
import { useAuth } from 'base-shell/lib/providers/Auth'
import { useIntl } from 'react-intl'

function useSessionTimeoutHandler(error) {
    const { enqueueSnackbar } = useSnackbar()
    const { setAuth } = useAuth()
    const intl = useIntl()

    useEffect(() => {
        console.warn("useSessionTimeoutHandler -> status", error)
        if (error && error.status === 401) {
            setAuth({ isAuthenticated: false })
            enqueueSnackbar(intl.formatMessage({ id: 'sessionTimeout' }))
        }
    }, [error, setAuth, enqueueSnackbar, intl])
}


export default useSessionTimeoutHandler
