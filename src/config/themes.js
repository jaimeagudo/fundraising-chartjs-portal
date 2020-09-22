import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import lime from '@material-ui/core/colors/lime'

const themes = [
  {
    id: 'default',
    source: {
      palette: {
        primary: { main: '#00AFDB' },
        secondary: lime,
        error: red,
      },
    },
  },
  {
    id: 'green',
    color: green[500],
    source: {
      palette: {
        primary: green,
        secondary: red,
        error: red,
      },
    },
  },
]

export default themes
