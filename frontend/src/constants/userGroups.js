// Enum para grupos de usuários
export const USER_GROUPS = {
    ADMINISTRADOR: 1,
    ATENDENTE: 2,
    CAIXA: 3,
}

// Configuração dos grupos (labels, cores, etc.)
export const GROUP_CONFIG = {
    [USER_GROUPS.ADMINISTRADOR]: {
        label: "Administrador",
        color: "error"
    },
    [USER_GROUPS.ATENDENTE]: {
        label: "Atendente",
        color: "primary"
    },
    [USER_GROUPS.CAIXA]: {
        label: "Caixa",
        color: "success"
    }
};

// Função utilitária para obter informações do grupo
export const getGrupoInfo = (grupo) => {
    return GROUP_CONFIG[grupo] || { label: "Não definido", color: "default" };
};

// Array de opções para selects/dropdowns
export const GROUP_OPTIONS = [
    { value: USER_GROUPS.ADMINISTRADOR, label: GROUP_CONFIG[USER_GROUPS.ADMINISTRADOR].label },
    { value: USER_GROUPS.ATENDENTE, label: GROUP_CONFIG[USER_GROUPS.ATENDENTE].label },
    { value: USER_GROUPS.CAIXA, label: GROUP_CONFIG[USER_GROUPS.CAIXA].label },
];

// Sobre o array, a minha abordagem dos labels é usar o GROUP_CONFIG para garantir consistência. Assim, se eu quiser mudar o label de um grupo, só preciso mudar no GROUP_CONFIG e isso vai refletir em toda a aplicação, inclusive nos selects que usam o GROUP_OPTIONS.
// Isso vem da boa prática DRY (Don't Repeat Yourself) para evitar duplicação de informações e facilitar a manutenção do código.
// Mas a forma que o professor fez também vale:
// export const GROUP_OPTIONS = [
//     { value: USER_GROUPS.ADMINISTRADOR, label: 'Administrador' },
//     { value: USER_GROUPS.ATENDENTE, label: 'Atendente' },
//     { value: USER_GROUPS.CAIXA, label: 'Caixa' }
// ];