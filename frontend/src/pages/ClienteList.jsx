import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Box, Typography, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import ActionButtons from '../components/common/ActionButtons';
import ClienteFilters from '../components/common/ClienteFilters';
import Pagination from '../components/common/Pagination';
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';
import { useMasks } from '../hooks/useMasks';
import { clienteService } from '../services/clienteService';

function ClienteList() {
    const navigate = useNavigate();
    const { applyCpfMask, applyPhoneMask } = useMasks();
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({ skip: 0, limit: 3, currentPage: 1 });
    const [hasItems, setHasItems] = useState(true);

    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/cliente')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Novo
        </Button>
    );

    const handleView = (cliente) => navigate(`/cliente/view/${cliente.id}`);
    const handleEdit = (cliente) => navigate(`/cliente/edit/${cliente.id}`);

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, skip: 0, currentPage: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({});
        setPagination(prev => ({ ...prev, skip: 0, currentPage: 1 }));
    };

    const handlePageChange = (newPage) => {
        const newSkip = (newPage - 1) * pagination.limit;
        setPagination(prev => ({ ...prev, skip: newSkip, currentPage: newPage }));
    };

    const handleItemsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, skip: 0, currentPage: 1 }));
    };

    const handleDelete = (cliente) => {
        showConfirm(
            'Excluir Cliente',
            `Tem certeza que deseja excluir o cliente "${cliente.nome}"?`,
            async () => {
                try {
                    await clienteService.delete(cliente.id);
                    setClientes(prev => prev.filter(item => item.id !== cliente.id));
                    showSnackbar('Cliente excluído com sucesso!', 'success');
                } catch (error) {
                    showSnackbar('Erro ao excluir cliente', 'error');
                }
            }
        );
    };

    useEffect(() => {
        const loadClientes = async () => {
            try {
                setLoading(true);
                const params = { skip: pagination.skip, limit: pagination.limit, ...filters };
                const response = await clienteService.list(params);
                const clientesData = response.data || response.items || response || [];
                setClientes(clientesData);
                setHasItems(clientesData && clientesData.length > 0);
            } catch (error) {
                showSnackbar('Erro ao carregar clientes', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadClientes();
    }, [pagination.skip, pagination.limit, filters]);

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'telefone', headerName: 'Telefone' },
        { field: 'actions', headerName: 'Ações' },
    ];

    const renderDesktopRow = (cliente) => (
        <TableRow key={cliente.id} hover>
            {columns.map((column, index) => {
                if (column.field === 'id') return <TableCell key={index}>{cliente.id}</TableCell>;
                if (column.field === 'nome') return <TableCell key={index} sx={{ fontWeight: 500 }}>{cliente.nome}</TableCell>;
                if (column.field === 'cpf') return <TableCell key={index}>{applyCpfMask(cliente.cpf)}</TableCell>;
                if (column.field === 'telefone') return <TableCell key={index}>{applyPhoneMask(cliente.telefone)}</TableCell>;
                if (column.field === 'actions') return (
                    <TableCell key={index} align="center">
                        <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={cliente} />
                    </TableCell>
                );
                return null;
            })}
        </TableRow>
    );

    const renderMobileInfo = (label, value) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">{label}:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>{value}</Typography>
        </Box>
    );

    const renderMobileCard = (cliente) => (
        <Card key={cliente.id} sx={{ mb: 2, elevation: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {cliente.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ID: {cliente.id}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    {renderMobileInfo('CPF', applyCpfMask(cliente.cpf))}
                    {renderMobileInfo('Telefone', applyPhoneMask(cliente.telefone))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionButtons
                        item={cliente}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <PageLayout title="Clientes" actions={actions}>
            <ClienteFilters onFilter={handleFilter} onClear={handleClearFilters} filters={filters} />

            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell
                                        key={index}
                                        align={column.field === 'actions' ? 'center' : 'left'}
                                        sx={{ color: 'white', fontWeight: 600, width: column.field === 'actions' ? 140 : 'auto' }}
                                    >
                                        {column.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Nenhum registro encontrado.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clientes.map((cliente) => renderDesktopRow(cliente))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {clientes.map((cliente) => renderMobileCard(cliente))}
            </Box>

            <Pagination
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                loading={loading}
                hasItems={hasItems}
            />
        </PageLayout>
    );
}

export default ClienteList;
