import { createTheme } from '@mui/material/styles'
import { ptBR } from '@mui/material/locale'
import palette from './palette'
import components from './components'
import breakpoints from './breakpoints'

export const theme = createTheme(
    {
        palette,
        components,
        breakpoints
    },
    ptBR
)
