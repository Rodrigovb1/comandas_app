import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Box, Typography, Divider, Chip } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import ActionButtons from '../components/common/ActionButtons';
import FuncionarioFilters from '../components/common/FuncionarioFilters';
import Pagination from '../components/common/Pagination';
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';
import { getGrupoInfo } from '../constants/userGroups';
import { useMasks } from '../hooks/useMasks';
import { funcionarioService } from '../services/funcionarioService';

function FuncionarioList() {
    const navigate = useNavigate();
    const { applyCpfMask, applyPhoneMask } = useMasks();
    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({ skip: 0, limit: 3, currentPage: 1 });
    const [hasItems, setHasItems] = useState(true);

    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Novo
        </Button>
    );

    const handleView = (funcionario) => navigate(`/funcionario/view/${funcionario.id}`);
    const handleEdit = (funcionario) => navigate(`/funcionario/edit/${funcionario.id}`);

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

    const handleDelete = (funcionario) => {
        showConfirm(
            'Excluir Funcionário',
            `Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?`,
            async () => {
                try {
                    await funcionarioService.delete(funcionario.id);
                    setFuncionarios(prev => prev.filter(item => item.id !== funcionario.id));
                    showSnackbar('Funcionário excluído com sucesso!', 'success');
                } catch (error) {
                    showSnackbar('Erro ao excluir funcionário', 'error');
                }
            }
        );
    };

    useEffect(() => {
        const loadFuncionarios = async () => {
            try {
                setLoading(true);
                const params = { skip: pagination.skip, limit: pagination.limit, ...filters };
                const response = await funcionarioService.list(params);
                const funcionariosData = response.data || response.items || response || [];
                setFuncionarios(funcionariosData);
                setHasItems(funcionariosData && funcionariosData.length > 0);
            } catch (error) {
                showSnackbar('Erro ao carregar funcionários', 'error');
            } finally {
                setLoading(false);
            }
        };

        loadFuncionarios();
    }, [pagination.skip, pagination.limit, filters]);

    const renderGrupo = (grupo) => {
        const grupoInfo = getGrupoInfo(grupo);
        return <Chip label={grupoInfo.label} color={grupoInfo.color} size="small" />;
    };

    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'matricula', headerName: 'Matrícula' },
        { field: 'telefone', headerName: 'Telefone' },
        { field: 'grupo', headerName: 'Grupo' },
        { field: 'actions', headerName: 'Ações' },
    ];

    const renderDesktopRow = (funcionario) => (
        <TableRow key={funcionario.id} hover>
            {columns.map((column, index) => {
                if (column.field === 'id') return <TableCell key={index}>{funcionario.id}</TableCell>;
                if (column.field === 'nome') return <TableCell key={index} sx={{ fontWeight: 500 }}>{funcionario.nome}</TableCell>;
                if (column.field === 'cpf') return <TableCell key={index}>{applyCpfMask(funcionario.cpf)}</TableCell>;
                if (column.field === 'matricula') return <TableCell key={index}>{funcionario.matricula}</TableCell>;
                if (column.field === 'telefone') return <TableCell key={index}>{applyPhoneMask(funcionario.telefone)}</TableCell>;
                if (column.field === 'grupo') return <TableCell key={index}>{renderGrupo(funcionario.grupo)}</TableCell>;
                if (column.field === 'actions') return (
                    <TableCell key={index} align="center">
                        <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={funcionario} />
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

    const renderMobileCard = (funcionario) => (
        <Card key={funcionario.id} sx={{ mb: 2, elevation: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                            {funcionario.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ID: {funcionario.id}
                        </Typography>
                    </Box>
                    {renderGrupo(funcionario.grupo)}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    {renderMobileInfo('CPF', applyCpfMask(funcionario.cpf))}
                    {renderMobileInfo('Matrícula', funcionario.matricula)}
                    {renderMobileInfo('Telefone', applyPhoneMask(funcionario.telefone))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ActionButtons
                        item={funcionario}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <PageLayout title="Funcionários" actions={actions}>
            <FuncionarioFilters onFilter={handleFilter} onClear={handleClearFilters} filters={filters} />

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
                            {funcionarios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Nenhum registro encontrado.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                funcionarios.map((funcionario) => renderDesktopRow(funcionario))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {funcionarios.map((funcionario) => renderMobileCard(funcionario))}
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

export default FuncionarioList;
