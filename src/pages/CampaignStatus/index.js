import React, { useState, useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Page from 'material-ui-shell/lib/containers/Page/Page'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import x from '../../services/efpApiClient';
import AgnosticTableMapper from 'components/AgnosticTableMapper'
import { useIntl, FormattedMessage } from 'react-intl'


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


export function CampaignStatus() {
  const intl = useIntl()

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // eslint-disable-next-line no-console
      const response = await x.requestEfpApi('/campaign/status/BDIPA').catch(setError);
      setStatus(response);
    }
    fetchData();
  }, []);

  const classes = useStyles();

  return (
    <Page pageTitle={intl.formatMessage({ id: 'campaignStatus' })}>
      <Helmet>
        <title>{intl.formatMessage({ id: 'campaignStatus' })}</title>
      </Helmet>
      <Scrollbar
        style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}
      >
        <AgnosticTableMapper obj={status} classes={classes} fieldsWithPences={x.FIELD_WITH_PENCES} />
        <FormControl component="fieldset" error={!!error} className={classes.formControl}>
          <FormHelperText>{(error && error.message) || ''}</FormHelperText>
        </FormControl>
      </Scrollbar>
    </Page>
  )
}


export default memo(CampaignStatus);


