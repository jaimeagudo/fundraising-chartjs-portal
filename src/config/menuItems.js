import allLocales from './locales'
// import allThemes from './themes'
import React from 'react'
import PollIcon from '@material-ui/icons/Poll'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import LockIcon from '@material-ui/icons/Lock'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LanguageIcon from '@material-ui/icons/Language'
import SettingsIcon from '@material-ui/icons/SettingsApplications'
import MenuOpenIcon from '@material-ui/icons/MenuOpen'
import FindInPageIcon from '@material-ui/icons/FindInPage';
import RedeemIcon from '@material-ui/icons/Redeem';
import GetApp from '@material-ui/icons/GetApp'
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode'
import StyleIcon from '@material-ui/icons/Style'
import allThemes from './themes'

const getMenuItems = (props) => {
    const {
        appConfig,
        intl,
        updateLocale,
        locale,
        menuContext,
        themeContext,
        a2HSContext,
        auth: authData,
    } = props
    const { isDesktop, isAuthMenuOpen, useMiniMode, setMiniMode } = menuContext
    const { themeID, setThemeID } = themeContext
    const { auth, setAuth } = authData
    const { isAppInstallable, isAppInstalled, deferredPrompt } = a2HSContext

    const localeItems = allLocales.map((l) => {
        return {
            value: undefined,
            visible: true,
            primaryText: intl.formatMessage({ id: l.locale }),
            onClick: () => {
                updateLocale(l.locale)
            },
            leftIcon: <LanguageIcon />,
        }
    })

    const isAuthorised = auth.isAuthenticated

    const themeItems = allThemes.map((t) => {
        return {
            value: undefined,
            visible: true,
            primaryText: intl.formatMessage({ id: t.id }),
            onClick: () => {
                setThemeID(t.id)
            },
            leftIcon: <StyleIcon style={{ color: t.color }} />,
        }
    })

    if (isAuthMenuOpen || !isAuthorised) {
        return [
            {
                value: '/signin',
                onClick: isAuthorised
                    ? () => {
                        setAuth({ isAuthenticated: false })
                    }
                    : () => { },
                visible: true,
                primaryText: isAuthorised
                    ? intl.formatMessage({ id: 'sign_out' })
                    : intl.formatMessage({ id: 'sign_in' }),
                leftIcon: isAuthorised ? <ExitToAppIcon /> : <LockIcon />,
            },
        ]
    }
    return [
        {
            value: '/home',
            visible: isAuthorised,
            primaryText: intl.formatMessage({ id: 'campaignStatus' }),
            leftIcon: <PollIcon />,
        }, {
            value: '/sharesApplications',
            visible: isAuthorised,
            primaryText: intl.formatMessage({ id: 'sharesApplications' }),
            leftIcon: <FindInPageIcon />,
        },
        {
            value: '/lockedAccounts',
            visible: isAuthorised,
            primaryText: intl.formatMessage({ id: 'lockedAccounts' }),
            leftIcon: <LockIcon />,
        }, {
            value: '/rewards',
            visible: isAuthorised,
            primaryText: intl.formatMessage({ id: 'investorsRewards' }),
            leftIcon: <RedeemIcon />,
        },
        // {
        //   value: '/dialog_demo',
        //   visible: isAuthorised,
        //   primaryText: intl.formatMessage({
        //     id: 'dialog_demo',
        //     defaultMessage: 'Dialog demo',
        //   }),
        //   leftIcon: <ChatBubble />,
        // },
        // {
        //   value: '/toast_demo',
        //   visible: isAuthorised,
        //   primaryText: intl.formatMessage({
        //     id: 'toast_demo',
        //     defaultMessage: 'Toast demo',
        //   }),
        //   leftIcon: <ChatBubble />,
        // },
        {
            value: '/about',
            visible: true,
            primaryText: intl.formatMessage({ id: 'about' }),
            leftIcon: <InfoOutlined />,
        },
        { divider: true },
        {
            primaryText: intl.formatMessage({ id: 'settings' }),
            primaryTogglesNestedList: true,
            leftIcon: <SettingsIcon />,
            nestedItems: [
                {
                    primaryText: intl.formatMessage({ id: 'theme' }),
                    secondaryText: intl.formatMessage({ id: themeID }),
                    primaryTogglesNestedList: true,
                    leftIcon: <StyleIcon />,
                    nestedItems: themeItems,
                },
                {
                    primaryText: intl.formatMessage({ id: 'language' }),
                    secondaryText: intl.formatMessage({ id: locale }),
                    primaryTogglesNestedList: true,
                    leftIcon: <LanguageIcon />,
                    nestedItems: localeItems,
                },
                {
                    visible: isDesktop ? true : false,
                    onClick: () => {
                        setMiniMode(!useMiniMode)
                    },
                    primaryText: intl.formatMessage({
                        id: 'menu_mini_mode',
                    }),
                    leftIcon: useMiniMode ? <MenuOpenIcon /> : <ChromeReaderMode />,
                },
            ],
        },
        {
            value: null,
            visible: isAppInstallable && !isAppInstalled,
            onClick: () => {
                deferredPrompt.prompt()
            },
            primaryText: intl.formatMessage({
                id: 'install',
                defaultMessage: 'Install',
            }),
            leftIcon: <GetApp />,
        },
    ]
}
export default getMenuItems
