import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UniqueValidator, { useFieldValidation } from '../components/common/UniqueValidator';
import PageLayout from '../components/common/PageLayout';
import { useValidationRules } from '../hooks/useValidationRules';
import { useMasks } from '../hooks/useMasks';
import { clienteService } from '../services/clienteService';
import showSnackbar from '../utils/snackbar';

const ClienteForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors, dirtyFields }, reset, setValue } = useForm();
    const validationRules = useValidationRules();
    const { applyCpfMask, cleanCpf, applyPhoneMask, cleanPhone } = useMasks();
    const { dialog: cpfDialog, validateField: validateCpf, closeDialog } = useFieldValidation(clienteService, id, 'checkCpfExists');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const isReadOnly = opr === 'view';
    const title = opr === 'view' ? `Visualizar Cliente: ${id}` : id ? `Editar Cliente: ${id}` : 'Novo Cliente';

    const handleCancel = () => {
        navigate('/clientes');
    };

    const handleDialogCancel = () => {
        closeDialog();
        setValue('cpf', '', { shouldDirty: true });
    };

    const handleDialogView = (cliente) => {
        closeDialog();
        navigate(`/cliente/view/${cliente.id}`);
    };

    const handleDialogEdit = (cliente) => {
        closeDialog();
        navigate(`/cliente/edit/${cliente.id}`);
    };

    const getChangedData = (data) => {
        const changedData = {};
        Object.keys(dirtyFields).forEach(key => {
            if (dirtyFields[key]) {
                changedData[key] = data[key];
            }
        });
        return changedData;
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            let retorno;
            if (id) {
                const changedData = getChangedData(data);

                if (Object.keys(changedData).length === 0) {
                    showSnackbar('Nenhuma alteração detectada', 'info');
                    return;
                }

                retorno = await clienteService.update(id, changedData);
                showSnackbar('Cliente atualizado com sucesso!', 'success');
            } else {
                retorno = await clienteService.create(data);
                showSnackbar('Cliente criado com sucesso!', 'success');
            }

            if (retorno?.detail) {
                throw new Error(retorno.detail);
            }

            navigate('/clientes');
        } catch (error) {
            const mensagem = error.apiMessage || error.message || 'Erro ao salvar cliente';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadCliente = async () => {
            if (id) {
                try {
                    setLoadingData(true);
                    const data = await clienteService.getById(id);
                    reset({
                        ...data,
                        cpf: cleanCpf(data.cpf),
                        telefone: cleanPhone(data.telefone),
                    });
                } catch (error) {
                    showSnackbar('Erro ao carregar cliente', 'error');
                    navigate('/clientes');
                } finally {
                    setLoadingData(false);
                }
            } else {
                reset({ nome: '', cpf: '', telefone: '' });
                setLoadingData(false);
            }
        };

        loadCliente();
    }, [id, navigate, reset]);

    return (
        <PageLayout title={title}>
            {loadingData ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    {isReadOnly && (
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            Todos os campos estão em modo somente leitura.
                        </Typography>
                    )}

                    <Controller
                        name="nome"
                        control={control}
                        defaultValue=""
                        rules={validationRules.nome}
                        render={({ field }) => (
                            <TextField id="cliente-nome" {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
                        )}
                    />

                    <Controller
                        name="cpf"
                        control={control}
                        defaultValue=""
                        rules={validationRules.cpf}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="cliente-cpf"
                                disabled={isReadOnly}
                                label="CPF"
                                fullWidth
                                margin="normal"
                                error={!!errors.cpf}
                                helperText={errors.cpf?.message}
                                onChange={(e) => {
                                    const value = cleanCpf(e.target.value);
                                    field.onChange(value);
                                }}
                                onBlur={() => {
                                    field.onBlur();
                                    if (!isReadOnly && field.value?.length === 11) {
                                        validateCpf(field.value);
                                    }
                                }}
                                value={field.value ? applyCpfMask(field.value) : ''}
                                inputProps={{ maxLength: 14 }}
                            />
                        )}
                    />

                    <Controller
                        name="telefone"
                        control={control}
                        defaultValue=""
                        rules={validationRules.telefone}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="cliente-telefone"
                                disabled={isReadOnly}
                                label="Telefone"
                                fullWidth
                                margin="normal"
                                error={!!errors.telefone}
                                helperText={errors.telefone?.message}
                                onChange={(e) => {
                                    const value = cleanPhone(e.target.value);
                                    field.onChange(value);
                                }}
                                value={field.value ? applyPhoneMask(field.value) : ''}
                                inputProps={{ maxLength: 15 }}
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button sx={{ mr: 1 }} onClick={handleCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        {!isReadOnly && (
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
                            </Button>
                        )}
                    </Box>
                </Box>
            )}
            <UniqueValidator
                open={cpfDialog.open}
                onClose={handleDialogCancel}
                existingRecord={cpfDialog.record}
                recordType="cliente"
                onView={handleDialogView}
                onEdit={handleDialogEdit}
            />
        </PageLayout>
    );
};

export default ClienteForm;
