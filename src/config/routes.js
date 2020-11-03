/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-key */
import React, { lazy } from 'react'
import PrivateRoute from 'base-shell/lib/components/PrivateRoute/PrivateRoute'
import PublicRoute from 'base-shell/lib/components/PublicRoute/PublicRoute'
import { Route } from 'react-router-dom'

const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
const SignUp = lazy(() => import('../pages/SignUp/SignUp'))
const About = lazy(() => import('../pages/About/About'))
const CampaignStatus = lazy(() => import('../pages/CampaignStatus'))
const CampaignTimeStats = lazy(() => import('../pages/CampaignStatus/timeStats'))
const CampaignGeoStats = lazy(() => import('../pages/CampaignStatus/geoStats'))
const SharesApplications = lazy(() => import('../pages/SharesApplications'))
const Customer = lazy(() => import('../pages/Customers/customer'))
const Customers = lazy(() => import('../pages/Customers/search'))
const LockedAccounts = lazy(() => import('../pages/LockedAccounts'))
const Rewards = lazy(() => import('../pages/Rewards/rewards'))
const Reward = lazy(() => import('../pages/Rewards/reward'))
const Vouchers = lazy(() => import('../pages/Vouchers'))

const routes = [
    <Route path="/" redirectTo="/signin" exact component={SignIn} />,
    <Route path="/changelog" exact component={About} />,
    <PublicRoute path="/signin" redirectTo="/" exact component={SignIn} />,
    <PublicRoute path="/signup" redirectTo="/" exact component={SignUp} />,
    <PrivateRoute path="/home" exact component={CampaignStatus} />,
    <PrivateRoute path="/campaign/status" exact component={CampaignStatus} />,
    <PrivateRoute path="/campaign/timestats" exact component={CampaignTimeStats} />,
    <PrivateRoute path="/campaign/geostats" exact component={CampaignGeoStats} />,
    <PrivateRoute path="/sharesApplications" exact component={SharesApplications} />,
    <PrivateRoute path="/sharesApplications/email/:email" exact component={SharesApplications} />,
    <PrivateRoute path="/sharesApplications/user/:magentoUserId" exact component={SharesApplications} />,
    <PrivateRoute path="/sharesApplications/paymentReference/:paymentReference" exact component={SharesApplications} />,
    <PrivateRoute path="/sharesApplications/application/:applicationId" exact component={SharesApplications} />,
    <PrivateRoute path="/customers/:magentoUserId?/email/:email?/referralCode/:referralCode?" exact component={Customers} />,
    <PrivateRoute path="/customers/referralCode/:referralCode" exact component={Customers} />,
    <PrivateRoute path="/customers" exact component={Customers} />,
    <PrivateRoute path="/customer/:magentoUserId" exact component={Customer} />,
    <PrivateRoute path="/lockedAccounts" exact component={LockedAccounts} />,
    <PrivateRoute path="/rewards" exact component={Rewards} />,
    <PrivateRoute path="/rewards/:rewardId/:rewardName?" exact component={Reward} />,
    <PrivateRoute path="/vouchers" exact component={Vouchers} />,
    <PrivateRoute path="/vouchers/:code" exact component={Vouchers} />,
]

export default routes
