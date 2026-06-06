import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import UniqueValidator, { useFieldValidation } from '../components/common/UniqueValidator';
import PageLayout from '../components/common/PageLayout';
import { useValidationRules } from '../hooks/useValidationRules';
import { useMasks } from '../hooks/useMasks';
import { GROUP_OPTIONS } from '../constants/userGroups';
import { funcionarioService } from '../services/funcionarioService';
import showSnackbar from '../utils/snackbar';

const FuncionarioForm = () => {
    const { id, opr } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors, dirtyFields }, reset, setValue } = useForm();
    const validationRules = useValidationRules();
    const { applyCpfMask, cleanCpf, applyPhoneMask, cleanPhone } = useMasks();
    const { dialog: cpfDialog, validateField: validateCpf, closeDialog } = useFieldValidation(funcionarioService, id, 'checkCpfExists');
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const isReadOnly = opr === 'view';
    const title = opr === 'view' ? `Visualizar Funcionário: ${id}` : id ? `Editar Funcionário: ${id}` : 'Novo Funcionário';

    const handleCancel = () => {
        navigate('/funcionarios');
    };

    const handleDialogCancel = () => {
        closeDialog();
        setValue('cpf', '', { shouldDirty: true });
    };

    const handleDialogView = (funcionario) => {
        closeDialog();
        navigate(`/funcionario/view/${funcionario.id}`);
    };

    const handleDialogEdit = (funcionario) => {
        closeDialog();
        navigate(`/funcionario/edit/${funcionario.id}`);
    };

    const getChangedData = (data) => {
        const changedData = {};
        Object.keys(dirtyFields).forEach(key => {
            if (dirtyFields[key]) {
                changedData[key] = data[key];
            }
        });

        if (changedData.senha === '') {
            delete changedData.senha;
        }

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

                retorno = await funcionarioService.update(id, changedData);
                showSnackbar('Funcionário atualizado com sucesso!', 'success');
            } else {
                retorno = await funcionarioService.create(data);
                showSnackbar('Funcionário criado com sucesso!', 'success');
            }

            if (retorno?.detail) {
                throw new Error(retorno.detail);
            }

            navigate('/funcionarios');
        } catch (error) {
            const mensagem = error.apiMessage || error.message || 'Erro ao salvar funcionário';
            showSnackbar(mensagem, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadFuncionario = async () => {
            if (id) {
                try {
                    setLoadingData(true);
                    const data = await funcionarioService.getById(id);
                    reset({
                        ...data,
                        cpf: cleanCpf(data.cpf),
                        telefone: cleanPhone(data.telefone),
                        grupo: data.grupo ?? '',
                        senha: '',
                    });
                } catch (error) {
                    showSnackbar('Erro ao carregar funcionário', 'error');
                    navigate('/funcionarios');
                } finally {
                    setLoadingData(false);
                }
            } else {
                reset({ nome: '', cpf: '', matricula: '', telefone: '', grupo: '', senha: '' });
                setLoadingData(false);
            }
        };

        loadFuncionario();
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
                            <TextField id="funcionario-nome" {...field} disabled={isReadOnly} label="Nome" fullWidth margin="normal" error={!!errors.nome} helperText={errors.nome?.message} />
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
                                id="funcionario-cpf"
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
                                    if (!isReadOnly) {
                                        validateCpf(field.value);
                                    }
                                }}
                                value={field.value ? applyCpfMask(field.value) : ''}
                                inputProps={{ maxLength: 14 }}
                            />
                        )}
                    />

                    <Controller
                        name="matricula"
                        control={control}
                        defaultValue=""
                        rules={validationRules.matricula}
                        render={({ field }) => (
                            <TextField id="funcionario-matricula" {...field} disabled={isReadOnly} label="Matrícula" fullWidth margin="normal" type="number" error={!!errors.matricula} helperText={errors.matricula?.message} />
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
                                id="funcionario-telefone"
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

                    <Controller
                        name="grupo"
                        control={control}
                        defaultValue=""
                        rules={validationRules.grupo}
                        render={({ field }) => (
                            <FormControl fullWidth margin="normal" error={!!errors.grupo} disabled={isReadOnly}>
                                <InputLabel id="funcionario-grupo-label" htmlFor="funcionario-grupo-input">Grupo</InputLabel>
                                <Select
                                    {...field}
                                    labelId="funcionario-grupo-label"
                                    id="funcionario-grupo"
                                    label="Grupo"
                                    inputProps={{ id: 'funcionario-grupo-input' }}
                                >
                                    {GROUP_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                                {errors.grupo && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                                        {errors.grupo.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    {!isReadOnly && (
                        <Controller
                            name="senha"
                            control={control}
                            defaultValue=""
                            rules={id ? { minLength: validationRules.senha.minLength } : validationRules.senha}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    id="funcionario-senha"
                                    label={id ? 'Nova senha' : 'Senha'}
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    error={!!errors.senha}
                                    helperText={errors.senha?.message || (id ? 'Preencha apenas se quiser alterar a senha.' : '')}
                                />
                            )}
                        />
                    )}

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
                recordType="funcionário"
                onView={handleDialogView}
                onEdit={handleDialogEdit}
            />
        </PageLayout>
    );
};

export default FuncionarioForm;
