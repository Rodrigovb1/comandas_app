import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, InputLabel } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import UniqueValidator, { useFieldValidation } from '../components/common/UniqueValidator';
import PageLayout from '../components/common/PageLayout';
import { useValidationRules } from '../hooks/useValidationRules';
import { useMasks } from '../hooks/useMasks';
import { funcionarioService } from '../services/funcionarioService';

const FuncionarioForm = () => {
    const { id } = useParams();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();
    const validationRules = useValidationRules();
    const { applyCpfMask, cleanCpf, applyPhoneMask, cleanPhone } = useMasks();
    const navigate = useNavigate();
    const { dialog: cpfDialog, validateField: validateCpf, closeDialog } = useFieldValidation(funcionarioService, id, 'checkCpfExists');

    const onSubmit = (data) => {
        console.log('Dados do funcionário:', data);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Arquivo selecionado:', file);
        }
    };

    const handleCancel = () => {
        navigate('/funcionarios');
    };

    const handleDialogCancel = () => {
        closeDialog();
        setValue('cpf', '');
    };

    const handleDialogView = (funcionario) => {
        closeDialog();
        navigate(`/funcionario/view/${funcionario.id}`);
    };

    const handleDialogEdit = (funcionario) => {
        closeDialog();
        navigate(`/funcionario/edit/${funcionario.id}`);
    };

    return (
        <PageLayout title="Dados Funcionário">
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="nome"
                    control={control}
                    defaultValue=""
                    rules={validationRules.nome}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Nome"
                            fullWidth
                            margin="normal"
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                        />
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
                                validateCpf(field.value);
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

                <Box sx={{ mt: 2, mb: 2 }}>
                    <InputLabel htmlFor="foto-upload" sx={{ mb: 1 }}>
                        Foto do Funcionário
                    </InputLabel>
                    <input
                        id="foto-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="foto-upload">
                        <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} fullWidth>
                            Selecionar Foto
                        </Button>
                    </label>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button sx={{ mr: 1 }} onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Cadastrar
                    </Button>
                </Box>
            </Box>

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
