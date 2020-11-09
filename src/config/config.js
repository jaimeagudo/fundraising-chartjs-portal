import { lazy } from 'react'
import api from './api'
import locales from './locales'
import routes from './routes'
import getMenuItems from './menuItems'
import themes from './themes'
import parseLanguages from 'base-shell/lib/utils/locale'

const config = {
    auth: {
        signInURL: '/signin',
    },
    routes,
    locale: {
        locales,
        defaultLocale: parseLanguages(['en', 'es'], 'en'),
        onError: (e) => {
            //console.warn(e)

            return
        },
    },
    menu: {
        getMenuItems,
    },
    theme: {
        themes,
        defaultThemeID: 'default',
        defaultType: 'light',
    },
    pages: {
        LandingPage: false, // lazy(() => import('../pages/LandingPage/LandingPage')),
        PageNotFound: lazy(() => import('../pages/PageNotFound/PageNotFound')),
    },
    api,
}

export default config
