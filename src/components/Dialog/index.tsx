import { ReactNode } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, IconButton } from '@mui/material'
import { theme } from '@/theme'
import CloseIcon from '@mui/icons-material/Close'
import { useDialog } from '@/hooks/useDialog'

interface DialogBaseProps extends DialogProps {
    title: string
    children: ReactNode
    onConfirm?: () => void
    onDiscart?: () => void
    onConfirmTitle?: string
    onDiscartTitle?: string
    footer?: boolean
}

export function DialogBase({
    title,
    footer = false,
    onConfirm,
    onDiscart,
    onConfirmTitle,
    onDiscartTitle,
    children,
    ...rest
}: DialogBaseProps) {
    const { handleCloseDialog } = useDialog()

    return (
        <Dialog onClose={handleCloseDialog} {...rest}>
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                }}
                variant="h5"
            >
                {title}
                <IconButton onClick={handleCloseDialog}>
                    <CloseIcon sx={{ color: theme.palette.primary.main }} />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    '& .MuiDialogTitle-root+.css-3hbk90-MuiDialogContent-root': {
                        paddingTop: 10
                    }
                }}
                children={children}
            />

            {footer && (
                <DialogActions
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        padding: 3
                    }}
                >
                    <Button variant="outlined" onClick={onDiscart}>
                        {onDiscartTitle}
                    </Button>
                    <Button variant="contained" color="secondary" type='submit' onClick={onConfirm}>
                        {onConfirmTitle}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    )
}
