import { toast } from "react-toastify";

export const toastSuccess = (message: string) => {
    return toast.success(message, {
        toastId: "successToastId",
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const toastError = (message: string) => {
    return toast.error(message, {
        toastId: "errorToastId",
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export const toastInfo = (message: string) => {
    return toast.info(message, {
        toastId: "errorToastId",
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}