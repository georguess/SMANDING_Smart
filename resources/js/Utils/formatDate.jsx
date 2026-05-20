export const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

export const formatDateTime = (dateTime) => {
    if (!dateTime) return "-";

    return new Date(dateTime).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatTime = (dateTime) => {
    if (!dateTime) return "-";

    return new Date(dateTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatDateForInput = (date) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
};