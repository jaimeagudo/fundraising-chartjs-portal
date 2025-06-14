import Button from '@material-ui/core/Button'
import Page from 'material-ui-shell/lib/containers/Page/Page'
import React, { useContext } from 'react'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { useIntl } from 'react-intl'
import { useSimpleValues } from 'base-shell/lib/providers/SimpleValues'
import { useQuestions } from 'material-ui-shell/lib/providers/Dialogs/Question'

const HomePage = () => {
  const intl = useIntl()
  const { setValue } = useSimpleValues()
  const { openDialog, setProcessing } = useQuestions()

  return (
    <Page
      pageTitle={intl.formatMessage({
        id: 'dialog_demo',
        defaultMessage: 'Dialog demo',
      })}
    >
      <br />
      <Button
        onClick={() => {
          openDialog({
            title: intl.formatMessage({
              id: 'dialog_title',
              defaultMessage: 'Dialog title',
            }),
            message: intl.formatMessage({
              id: 'dialog_message',
              defaultMessage:
                'Dialog message. You can put as much text as you want here. Ask a question or show a warning befor deleting something. You can also set the action text to somerhing like "YES, Delete" and run that action by passing a "handleAction" prop. This receives a "handleClose" callback with wich you can close the dialog when your action is done.',
            }),
            action: intl.formatMessage({
              id: 'dialog_action',
              defaultMessage: 'YES, Delete',
            }),
            handleAction: (handleClose) => {
              setProcessing(true)
              console.log('Doing some async stuff')

              setTimeout(() => {
                console.log('finished async stuff')
                //Do some stuff and then
                handleClose()
              }, 3000)
            },
          })
        }}
      >
        OPEN DIALOG
      </Button>
    </Page>
  )
}
export default HomePage
