import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';

function FuncionarioList() {
    const navigate = useNavigate();

    const funcionarios = [
        { id: 1, nome: 'João da Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321' },
        { id: 2, nome: 'Maria Oliveira', cpf: '987.654.321-11', telefone: '(11) 91234-5678' }
    ];

    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Novo
        </Button>
    );

    const handleView = (funcionario) => console.log("Visualizar funcionário:", funcionario);
    const handleEdit = (funcionario) => navigate(`/funcionario/${funcionario.id}`);
    const handleDelete = (funcionario) => {
        showConfirm(
            'Excluir Funcionário',
            `Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?`,
            () => {
                console.log("Excluir funcionário:", funcionario);
                showSnackbar('Funcionário excluído com sucesso!', 'success');
            }
        );
    };
    
    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'telefone', headerName: 'Telefone' }
    ];

    return (
        <PageLayout title="Lista de Funcionários" actions={actions}>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de funcionários">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.field} sx={{ color: 'white', fontWeight: 600 }}>
                                    {column.headerName}
                                </TableCell>
                            ))}
                            <TableCell align="center" sx={{ color: 'white', fontWeight: 600, width: 140 }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {funcionarios.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nenhum funcionário cadastrado.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            funcionarios.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                        {row.id}
                                    </TableCell>
                                    <TableCell>{row.nome}</TableCell>
                                    <TableCell>{row.cpf}</TableCell>
                                    <TableCell>{row.telefone}</TableCell>
                                    <TableCell align="center">
                                        <ActionButtons 
                                            onView={() => handleView(row)} 
                                            onEdit={() => handleEdit(row)} 
                                            onDelete={() => handleDelete(row)} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </PageLayout>
    );
}

export default FuncionarioList;