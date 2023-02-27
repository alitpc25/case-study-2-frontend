import * as Yup from "yup"

export const CreateAnnouncementSchema = Yup.object().shape({
    topic: Yup.string().required("Topic is required"),
    content: Yup.string().required("Content is required"),
    expirationDate: Yup.date().required("Expiration date is required"),
    image: Yup.mixed().required("Image is required")
});

export const CreateNewsSchema = Yup.object().shape({
    topic: Yup.string().required("Topic is required"),
    content: Yup.string().required("Content is required"),
    expirationDate: Yup.date().required("Expiration date is required"),
    link: Yup.string().required("Link is required")
});

export const UpdateNewsSchema = Yup.object().shape({
    topic: Yup.string().required("Topic is required"),
    content: Yup.string().required("Content is required"),
    expirationDate: Yup.date().required("Expiration date is required"),
    link: Yup.string().required("Link is required")
});

export const UpdateAnnouncementSchema = Yup.object().shape({
    topic: Yup.string().required("Topic is required"),
    content: Yup.string().required("Content is required"),
    expirationDate: Yup.date().required("Expiration date is required"),
    image: Yup.mixed().required("Image is required")
});