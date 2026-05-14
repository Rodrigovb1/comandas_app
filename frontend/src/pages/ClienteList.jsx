import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Card, CardContent, Box, Typography, Divider } from '@mui/material';
import { FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import showConfirm from '../utils/confirm';
import showSnackbar from '../utils/snackbar';

function ClienteList() {
    const navigate = useNavigate();

    const clientes = [
        { id: 1, nome: 'João da Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321' },
        { id: 2, nome: 'Maria Oliveira', cpf: '987.654.321-11', telefone: '(11) 91234-5678' }
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
    
    // criação de array de colunas para a tabela, onde cada coluna tem um campo (field) e um nome de cabeçalho (headerName). O campo 'actions' é especial, pois tem uma função renderCell que renderiza os botões de ação para cada linha da tabela.
    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'nome', headerName: 'Nome' },
        { field: 'cpf', headerName: 'CPF' },
        { field: 'telefone', headerName: 'Telefone' },
        { field: 'actions', headerName: 'Ações', renderCell: (params) => <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={params.row}/>}
        // O renderCell é uma função que recebe os parâmetros da célula e retorna o componente ActionButtons com as funções de visualização, edição e exclusão associadas ao item correspondente da linha.
    ];

    // Função para renderizar uma linha da tabela em desktop
    // A função renderDesktopRow tem um card pra mobile, o que permite o responsivo
    const renderDesktopRow = (cliente) => (
        <TableRow key={cliente.id} hover>
            {columns.map((column, index) => {
                if (column.field === 'id') return <TableCell key={index}>{cliente.id}</TableCell>;
                if (column.field === 'nome') return <TableCell key={index} sx={{ fontWeight: 500 }}>{cliente.nome}</TableCell>;
                if (column.field === 'cpf') return <TableCell key={index}>{cliente.cpf}</TableCell>;
                if (column.field === 'telefone') return <TableCell key={index}>{cliente.telefone}</TableCell>;
                if (column.field === 'actions') return (
                    <TableCell key={index}>
                        <ActionButtons onView={handleView} onEdit={handleEdit} onDelete={handleDelete} item={cliente} />
                    </TableCell>
                );
                return null;
            })}
        </TableRow>
    );

    // Função para renderizar um card em mobile
    const renderMobileCard = (cliente) => (
        <Card key={cliente.id} sx={{ mb: 2, elevation: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', backgroundColor: 'grey.100' }}>
                            <img src={cliente.foto} alt={cliente.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                {cliente.nome}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ID: {cliente.id}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
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
    
    // Renderizar a tabela em desktop e os cards em mobile
    return (
        <PageLayout title="Clientes" actions={actions}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                {/* Adicionado o borderradius para arredondar os cantos igual ao box do título*/}
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    
                    {/* Adicionado o backgroundColor para ficar azul igual ao título*/}
                    <Table>
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>

                            <TableRow>
                                {columns.map((column, index) => (
                                <TableCell 
                                // Basicamente, isso deixa a coluna de ações mais centralizada e bonita
                                // o color: white é para deixar o texto branco, já que o background é azul,
                                // e o fontWeight: 600 é para deixar o texto mais negrito e destacado
                                    key={index} 
                                    align={column.field === 'actions' ? 'center' : 'left'} 
                                    sx={{ color: 'white', fontWeight: 600, width: column.field === 'actions' ? 140 : 'auto' }}
                                >
                                    {column.headerName || column.header}
                                </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Adicionado a verificação de registros vazios e aí sim vem o map */}
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
        </PageLayout>
    );
}

export default ClienteList;