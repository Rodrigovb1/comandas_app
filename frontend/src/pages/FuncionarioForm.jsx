import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/common/PageLayout";
import useValidationRules from "../hooks/useValidationRules";
import { useMasks } from "../hooks/useMasks";
import showSnackbar from "../utils/snackbar";

const FuncionarioForm = () => {
    const navigate = useNavigate();
    const validationRules = useValidationRules();
    const { applyCpfMask, cleanCpf, applyPhoneMask, cleanPhone } = useMasks();
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log("Dados salvos:", data);
        showSnackbar('Funcionário salvo com sucesso!', 'success');
        navigate('/funcionarios');
    };

    return (
        <PageLayout title="Cadastro de Funcionário">
            <Paper elevation={2} sx={{ p: 3, width: '100%' }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="nome" control={control} defaultValue=""
                                rules={validationRules.nome}
                                render={({ field }) => (
                                    <TextField {...field} fullWidth label="Nome Completo (Digite o SEU NOME aqui no vídeo!)" error={!!errors.nome} helperText={errors.nome?.message} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="cpf" control={control} defaultValue=""
                                rules={validationRules.cpf}
                                render={({ field }) => (
                                    <TextField
                                        {...field} fullWidth label="CPF"
                                        error={!!errors.cpf} helperText={errors.cpf?.message}
                                        onChange={(e) => {
                                            const value = cleanCpf(e.target.value);
                                            field.onChange(value);
                                        }}
                                        value={field.value ? applyCpfMask(field.value) : ''}
                                        inputProps={{ maxLength: 14 }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="telefone" control={control} defaultValue=""
                                rules={validationRules.telefone}
                                render={({ field }) => (
                                    <TextField
                                        {...field} fullWidth label="Telefone"
                                        error={!!errors.telefone} helperText={errors.telefone?.message}
                                        onChange={(e) => {
                                            const value = cleanPhone(e.target.value);
                                            field.onChange(value);
                                        }}
                                        value={field.value ? applyPhoneMask(field.value) : ''}
                                        inputProps={{ maxLength: 15 }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button variant="outlined" onClick={() => navigate('/funcionarios')}>Cancelar</Button>
                                <Button type="submit" variant="contained">Salvar</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </PageLayout>
    );
};

export default FuncionarioForm;