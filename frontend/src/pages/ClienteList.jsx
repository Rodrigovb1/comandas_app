import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';

function ClienteList() {
    const navigate = useNavigate();

    const clientes = [
        { id: 1, nome: 'Carlos Eduardo', cpf: '444.555.666-77', telefone: '(49) 9988-7766' },
        { id: 2, nome: 'Ana Beatriz', cpf: '111.222.333-44', telefone: '(49) 9911-2233' }
    ];

    const actions = (
        <Button variant="contained" color="primary" onClick={() => navigate('/cliente')} startIcon={<FiberNew />} sx={{ fontWeight: 600, px: 2, py: 1 }}>
            Novo
        </Button>
    );

    const handleView = (cliente) => console.log("Visualizar cliente:", cliente);
    const handleEdit = (cliente) => navigate(`/cliente/${cliente.id}`);
    const handleDelete = (cliente) => {
        showConfirm(
            'Excluir Cliente',
            `Tem certeza que deseja excluir o cliente "${cliente.nome}"?`,
            () => {
                console.log("Excluir cliente:", cliente);
                showSnackbar('Cliente excluído com sucesso!', 'success');
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
        <PageLayout title="Lista de Clientes" actions={actions}>
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de clientes">
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
                        {clientes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Nenhum cliente cadastrado.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            clientes.map((row) => (
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

export default ClienteList;