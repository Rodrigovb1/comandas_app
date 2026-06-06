import { useState, useEffect } from 'react';
import { TextField, Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { GROUP_OPTIONS } from '../../constants/userGroups';
import { useMasks } from '../../hooks/useMasks';

const initialFilters = { id: '', nome: '', cpf: '', matricula: '', telefone: '', grupo: '' };

const FuncionarioFilters = ({ onFilter, onClear, filters: externalFilters = {} }) => {
    const [filters, setFilters] = useState(initialFilters);
    const { cleanCpf, cleanPhone } = useMasks();

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            ...externalFilters,
        }));
    }, [externalFilters]);

    const handleInputChange = (field) => (event) => {
        setFilters(prev => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleFilter = () => {
        const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
            const value = filters[key];
            if (value !== '' && value !== null && value !== undefined) {
                if (key === 'cpf') acc[key] = cleanCpf(value);
                else if (key === 'telefone') acc[key] = cleanPhone(value);
                else if (key === 'id' || key === 'matricula' || key === 'grupo') acc[key] = Number(value);
                else acc[key] = value;
            }
            return acc;
        }, {});

        onFilter(cleanedFilters);
    };

    const handleClear = () => {
        setFilters(initialFilters);
        onClear();
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <Accordion>
            <AccordionSummary expandIcon={<FilterList />}>
                <Typography variant="h6" component="div">
                    Opções de Filtros {hasActiveFilters && '(ativos)'}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                        <TextField fullWidth label="ID" value={filters.id} onChange={handleInputChange('id')} placeholder="Buscar por ID..." type="number" size="small" />
                        <TextField fullWidth label="Nome" value={filters.nome} onChange={handleInputChange('nome')} placeholder="Buscar por nome..." size="small" />
                        <TextField fullWidth label="CPF" value={filters.cpf} onChange={handleInputChange('cpf')} placeholder="Buscar por CPF..." size="small" />
                        <TextField fullWidth label="Matrícula" value={filters.matricula} onChange={handleInputChange('matricula')} placeholder="Buscar por matrícula..." type="number" size="small" />
                        <TextField fullWidth label="Telefone" value={filters.telefone} onChange={handleInputChange('telefone')} placeholder="Buscar por telefone..." size="small" />
                        <FormControl fullWidth size="small">
                            <InputLabel id="grupo-filter-label">Grupo</InputLabel>
                            <Select
                                labelId="grupo-filter-label"
                                label="Grupo"
                                value={filters.grupo}
                                onChange={handleInputChange('grupo')}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {GROUP_OPTIONS.map(option => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Button variant="outlined" startIcon={<Clear />} onClick={handleClear} disabled={!hasActiveFilters} size="small">
                                Limpar
                            </Button>
                            <Button variant="contained" onClick={handleFilter} size="small">
                                Filtrar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default FuncionarioFilters;
