import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const formatMessage = (message) => {
    if (typeof message === 'string') return message;
    if (message === null || message === undefined) return '';
    if (Array.isArray(message)) return message.map(formatMessage).join(' ');
    if (typeof message === 'object') {
        if (message.msg) return formatMessage(message.msg);
        if (message.message) return formatMessage(message.message);
        if (message.detail) return formatMessage(message.detail);
        try {
            return JSON.stringify(message);
        } catch {
            return 'Erro desconhecido';
        }
    }
    return String(message);
};

const SnackbarGlobal = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const [dialog, setDialog] = useState({ open: false, title: '', message: '', onConfirm: null });

    useEffect(() => {
        const handleShowSnackbar = (event) => {
            const { message, severity } = event.detail;
            setSnackbar({ open: true, message: formatMessage(message), severity });
        };

        const handleShowConfirm = (event) => {
            const { title, message, onConfirm } = event.detail;
            setDialog({ open: true, title: formatMessage(title), message: formatMessage(message), onConfirm });
        };

        window.addEventListener('showSnackbar', handleShowSnackbar);
        window.addEventListener('showConfirm', handleShowConfirm);

        return () => {
            window.removeEventListener('showSnackbar', handleShowSnackbar);
            window.removeEventListener('showConfirm', handleShowConfirm);
        };
    }, []);

    return (
        <>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
            >
                <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Dialog open={dialog.open} onClose={() => setDialog({ ...dialog, open: false })} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ color: 'error.main' }}>
                    {dialog.title}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {dialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialog({ ...dialog, open: false })} color="inherit">
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                        if (dialog.onConfirm) {
                            dialog.onConfirm();
                        }
                        setDialog({ ...dialog, open: false });
                    }} color="error" variant="contained">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SnackbarGlobal;
