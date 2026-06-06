import { Box, Button, Typography, TextField } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const Pagination = ({
    currentPage = 1, itemsPerPage = 3, onPageChange, onItemsPerPageChange, loading = false, hasItems = true
}) => {
    const handlePrevious = () => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!loading) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        const newItemsPerPage = parseInt(event.target.value);
        if (newItemsPerPage > 0 && newItemsPerPage <= 1000) {
            onItemsPerPageChange(newItemsPerPage);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button size="small" onClick={handlePrevious} disabled={currentPage === 1 || loading} startIcon={<KeyboardArrowLeft />}>
                    Anterior
                </Button>
                <Typography variant="body2" sx={{ mx: 1 }}>
                    Página {currentPage}
                </Typography>
                <Button size="small" onClick={handleNext} disabled={loading || !hasItems} endIcon={<KeyboardArrowRight />}>
                    Próxima
                </Button>
            </Box>

            <TextField
                id="pagination-items-per-page"
                label="Itens por página"
                size="small"
                type="number"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                sx={{ width: '150px' }}
                disabled={loading}
            />
        </Box>
    );
};

export default Pagination;
