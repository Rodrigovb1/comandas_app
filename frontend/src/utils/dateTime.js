export const getCurrentLocalDateTimeInputValue = () => {
    const date = new Date();
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export const toDateTimeInputValue = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value.replace(' ', 'T').slice(0, 16);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export const formatLocalDateTime = (value) => {
    const inputValue = toDateTimeInputValue(value);
    if (!inputValue) return '';

    const [datePart, timePart = ''] = inputValue.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour = '00', minute = '00'] = timePart.split(':');

    if (!year || !month || !day) return String(value);
    return `${day}/${month}/${year}, ${hour}:${minute}:00`;
};
