import React, { useEffect, useState } from 'react';
import News from '../models/News';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import axios from "axios"
import { updateAdminInfo } from '../redux/adminSlice';
import NewsCard from '../components/NewsCard';
import { toastError, toastSuccess } from '../utils/toastMessages';
import NewsSchema from '../utils/NewsSchema';
import { Modal, Button } from 'react-bootstrap';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import MyDatePicker from '../components/MyDatePicker';
import { CreateNewsSchema, UpdateNewsSchema } from '../utils/yupSchemas';
import NavbarComponent from '../components/NavbarComponent';
import "./NewsPage.css"

export interface INewsPageProps {
}

export default function NewsPage(props: INewsPageProps) {
    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    const [newsList, setNewsList] = useState<News[]>()

    const getAllNews = () => {
        axios.get(`/api/v1/news`)
            .then((res) => {
                setNewsList(res.data)
            }).catch((e) => {
                if (e.response.status === 401 && admin.jwtToken) {
                    dispatch(updateAdminInfo({
                      jwtToken: null,
                    }))
                    toastSuccess("Logged out.")
                  }
            })
    }

    const [isNewsChanged, setIsNewsChanged] = useState(false)

    useEffect(() => {
        getAllNews();
        setIsNewsChanged(false)
    }, [isNewsChanged])

    //Modals
    const [selectedNews, setSelectedNews] = useState<News>();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    //Modal open-close control
    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleCloseInsertModal = () => setShowInsertModal(false);
    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const handleShowDeleteModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => {
        setSelectedNews(news)
        setShowDeleteModal(true);
    }

    const handleShowEditModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, news: News) => {
        setSelectedNews(news)
        setShowEditModal(true);
    }

    const handleShowInserttModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setShowInsertModal(true);
    }

    const handleShowDetailsModal = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, news: News) => {
        setSelectedNews(news)
        setShowDetailsModal(true)
    }

    const handleDeleteNews = (newsId: string | undefined) => {
        if (newsId) {
            axios.delete('/api/v1/news/' + newsId, {
                headers: {
                    'Authorization': `Bearer ${admin.jwtToken}`,
                }
            })
                .then(function (response) {
                    toastSuccess(response.data);
                    handleCloseDeleteModal()
                })
                .catch(function (e) {
                    toastError(e.response.data);
                    console.log(e)
                    if (e.response.status === 401) {
                        dispatch(updateAdminInfo({
                            jwtToken: null,
                        }))
                    }
                })
                .finally(() => {
                    setIsNewsChanged(true)
                })
        }
    }

    const initialValuesNewsSave = {
        topic: "",
        content: "",
        expirationDate: new Date(),
        link: ""
    };

    const saveNews = (values: NewsSchema) => {
        axios.post('/api/v1/news',
            {
                topic: values.topic,
                content: values.content,
                expirationDate: values.expirationDate,
                link: values.link
            },
            {
                headers: {
                    'Authorization': `Bearer ${admin.jwtToken}`,
                }
            })
            .then(function (response) {
                handleCloseInsertModal();
                toastSuccess("News successfully added.");
            })
            .catch(function (error) {
                console.log(error)
                toastError(error.response.data);
                if (error.response.status === 401 && admin.jwtToken) {
                    dispatch(updateAdminInfo({
                      jwtToken: null,
                    }))
                    toastSuccess("Logged out.")
                  }
            })
            .finally(() => {
                setIsNewsChanged(true)
            })
    }

    const initialValuesNews = {
        topic: selectedNews?.topic,
        content: selectedNews?.content,
        expirationDate: selectedNews?.expirationDate ? new Date(selectedNews?.expirationDate + "Z") : new Date(),
        link: selectedNews?.link
    };

    const updateNews = (values: NewsSchema) => {
        if (selectedNews) {
            axios.patch('/api/v1/news/' + selectedNews.id,
                {
                    topic: values.topic,
                    content: values.content,
                    expirationDate: values.expirationDate,
                    link: values.link
                },
                {
                    headers: {
                        'Authorization': `Bearer ${admin.jwtToken}`,
                    }
                })
                .then(function (response) {
                    handleCloseEditModal();
                    toastSuccess("News successfully updated.");
                })
                .catch(function (error) {
                    toastError(error.response.data)
                    console.log(error)
                    if (error.response.status === 401 && admin.jwtToken) {
                        dispatch(updateAdminInfo({
                          jwtToken: null,
                        }))
                        toastSuccess("Logged out.")
                      }
                })
                .finally(() => {
                    setIsNewsChanged(true)
                })
        }
    }

    return (
        <div>
            <NavbarComponent />
            <div className='news-container'>
                <div>
                    {
                        admin.jwtToken ?
                            <button type="button" className="btn btn-primary" onClick={handleShowInserttModal}>
                                Create News
                            </button>
                            : null
                    }
                </div>
                {
                    newsList?.map((news, i) => {
                        return (
                            <div key={i}>
                                <NewsCard news={news} handleShowDeleteModal={handleShowDeleteModal} handleShowEditModal={handleShowEditModal} handleShowDetailsModal={handleShowDetailsModal} showContentDetail={false}></NewsCard>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <Modal centered show={showInsertModal} onHide={handleCloseInsertModal}>
                    <Modal.Header closeButton>
                        <Modal.Title> New News </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesNewsSave}
                            validationSchema={CreateNewsSchema}
                            onSubmit={(values) => {
                                saveNews(values)
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form className=''>
                                    <div className=''>
                                        <label htmlFor="topic">Topic</label>
                                        <div className='p-2'>
                                            <Field type="text" name="topic" className='form-control' />
                                            <ErrorMessage name="topic" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="content">Content</label>
                                        <div className='p-2'>
                                            <Field component="textarea" type="textarea" name="content" className='form-control' />
                                            <ErrorMessage name="content" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="expirationDate">Expiration Date</label>
                                        <div className='p-2'>
                                            <MyDatePicker name="expirationDate" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="link">Link</label>
                                        <div className='p-2'>
                                            <Field component="textarea" type="textarea" name="link" className='form-control' />
                                            <ErrorMessage name="link" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseInsertModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Publish News
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>

                <Modal centered show={showDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Remove news with topic {selectedNews?.topic}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleDeleteNews(selectedNews?.id)}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal centered show={showDetailsModal} onHide={handleCloseDetailsModal} className="modal-xl">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                    <NewsCard news={selectedNews!} handleShowDeleteModal={handleShowDeleteModal} handleShowEditModal={handleShowEditModal} handleShowDetailsModal={handleShowDetailsModal} showContentDetail={true}></NewsCard>
                    </Modal.Body>
                </Modal>

                <Modal centered show={showEditModal} onHide={handleCloseEditModal} className="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit news with topic {selectedNews?.topic}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={initialValuesNews}
                            validationSchema={UpdateNewsSchema}
                            onSubmit={(values) => {
                                updateNews(values)
                            }}
                        >
                            {() => (
                                <Form className=''>
                                    <div className=''>
                                        <label htmlFor="topic">Topic</label>
                                        <div className='p-2'>
                                            <Field type="text" name="topic" className='form-control' />
                                            <ErrorMessage name="topic" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="content">Content</label>
                                        <div className='p-2'>
                                            <Field component="textarea" type="textarea" name="content" className='form-control' />
                                            <ErrorMessage name="content" component="div" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="expirationDate">Expiration Date</label>
                                        <div className='p-2'>
                                            <MyDatePicker name="expirationDate" />
                                        </div>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="link">Link</label>
                                        <div className='p-2'>
                                            <Field component="textarea" type="textarea" name="link" className='form-control' />
                                            <ErrorMessage name="link" component="div" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                        <Button variant="secondary" onClick={handleCloseInsertModal}>
                                            Close
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Update News
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}
