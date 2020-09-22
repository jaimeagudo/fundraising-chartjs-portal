/* eslint-disable react/jsx-key */
import React, { lazy } from 'react'
import PrivateRoute from 'base-shell/lib/components/PrivateRoute/PrivateRoute'
import PublicRoute from 'base-shell/lib/components/PublicRoute/PublicRoute'
import { Route } from 'react-router-dom'

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp/SignUp'))
const About = lazy(() => import('../pages/About/About'))
const Home = lazy(() => import('../pages/Home/Home'))
const CampaignStatus = lazy(() => import('../pages/CampaignStatus'))
const SharesApplications = lazy(() => import('../pages/SharesApplications'))
const DialogDemo = lazy(() => import('../pages/DialogDemo/DialogDemo'))
const ToastDemo = lazy(() => import('../pages/ToastDemo/ToastDemo'))

const routes = [
    <PublicRoute path="/signin" redirectTo="/" exact component={SignIn} />,
    <PublicRoute path="/signup" redirectTo="/" exact component={SignUp} />,
    <Route
        path="/"
        redirectTo="/signin"
        exact
        component={SignIn}
    />,

    <Route path="/about" exact component={About} />,
    // <PrivateRoute path="/home" exact component={Home} />,
    <PrivateRoute path="/home" exact component={CampaignStatus} />,
    <PrivateRoute path="/campaign/status" exact component={CampaignStatus} />,
    <PrivateRoute path="/sharesApplications" exact component={SharesApplications} />,
    // <PrivateRoute path="/dialog_demo" exact component={DialogDemo} />,
    // <PrivateRoute path="/toast_demo" exact component={ToastDemo} />,
]

export default routes
