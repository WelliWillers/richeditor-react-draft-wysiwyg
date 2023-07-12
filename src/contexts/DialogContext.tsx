import { createContext, ReactNode, useState } from 'react'

type DialogContextProps = {
    children: ReactNode
}

type DialogContextData = {
    handleOpenDialog: (ref: any) => void
    handleCloseDialog: () => void
    dialogRef: any
    isOpen: boolean
}

export const DialogContext = createContext({} as DialogContextData)

export function DialogContextProvider({ children }: DialogContextProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [dialogRef, setDialogRef] = useState<any>()

    const handleOpenDialog = (ref: any) => {
        setDialogRef(ref)
        setIsOpen(true)
    }
    const handleCloseDialog = () => {
        setDialogRef({})
        setIsOpen(false)
    }

    return (
        <DialogContext.Provider value={{ isOpen, handleOpenDialog, handleCloseDialog, dialogRef }}>
            {children}
        </DialogContext.Provider>
    )
}
