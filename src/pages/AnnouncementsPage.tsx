import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Announcement from '../models/Announcement';
import axios from "axios"
import { updateAdminInfo } from '../redux/adminSlice';
import AnnouncementCard from '../components/AnnouncementCard';
import { Modal, Button } from 'react-bootstrap';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import MyDatePicker from '../components/MyDatePicker';
import { toastError, toastInfo, toastSuccess } from '../utils/toastMessages';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema } from '../utils/yupSchemas';
import AnnouncementSchema from '../utils/AnnouncementSchema';
import NavbarComponent from '../components/NavbarComponent';
import "./AnnouncementsPage.css";
import { over, Client, Message } from 'stompjs';
import SockJS from 'sockjs-client';

export interface IAnnouncementsPageProps {
}

var stompClient: Client;

export default function AnnouncementsPage(props: IAnnouncementsPageProps) {

  const admin = useAppSelector(state => state.admin);
  const dispatch = useAppDispatch();

  const [announcementList, setAnnouncementList] = useState<Announcement[]>([])

  const getAllAnnouncements = () => {
    axios.get(`/api/v1/announcement`)
      .then((res) => {
        setAnnouncementList(res.data)
      }).catch((e) => {
        if (e.response.status === 403) {
          dispatch(updateAdminInfo({
            jwtToken: null,
          }))
        }
      })
  }

  const [isAnnouncementsChanged, setIsAnnouncementsChanged] = useState(false)

  useEffect(() => {
    getAllAnnouncements();
    setIsAnnouncementsChanged(false)
  }, [isAnnouncementsChanged])

  useEffect(() => {
    if (typeof(stompClient) === 'undefined') {
      connect()
    }
  })

  //Modals
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement>();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInsertModal, setShowInsertModal] = useState(false);

  //Modal open-close control
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleCloseInsertModal = () => setShowInsertModal(false);

  const handleShowDeleteModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setShowDeleteModal(true);
  }

  const handleShowEditModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setShowEditModal(true);
  }

  const handleShowInserttModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowInsertModal(true);
  }

  const handleDeleteAnnouncement = (announcementId: string | undefined) => {
    if (announcementId) {
      axios.delete('/api/v1/announcement/' + announcementId, {
        headers: {
          'Authorization': `Bearer ${admin.jwtToken}`,
          "Content-Type": "multipart/form-data",
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
          setIsAnnouncementsChanged(true)
        })
    }
  }

  const initialValuesAnnouncementSave = {
    topic: "",
    content: "",
    expirationDate: new Date(),
    image: undefined
  };

  const saveAnnouncement = (values: AnnouncementSchema) => {
    axios.post('/api/v1/announcement',
      {
        topic: values.topic,
        content: values.content,
        expirationDate: values.expirationDate,
        image: values.image
      },
      {
        headers: {
          'Authorization': `Bearer ${admin.jwtToken}`,
          "Content-Type": "multipart/form-data",
        }
      })
      .then(function (response) {
        handleCloseInsertModal();
        setImagePreview("")
        toastSuccess("Announcement successfully added.");
        sendNotification(response.data.id)
      })
      .catch(function (error) {
        console.log(error)
        toastError(error.response.data);
        if (error.response.status === 401) {
          dispatch(updateAdminInfo({
            jwtToken: null,
          }))
        }
      })
      .finally(() => {
        setIsAnnouncementsChanged(true)
      })
  }

  const initialValuesAnnouncement = {
    topic: selectedAnnouncement?.topic,
    content: selectedAnnouncement?.content,
    expirationDate: selectedAnnouncement?.expirationDate ? new Date(selectedAnnouncement?.expirationDate) : new Date(),
    image: undefined // new File(selectedAnnouncement?.image)
  };

  const updateAnnouncement = (values: AnnouncementSchema) => {
    if (selectedAnnouncement) {
      axios.patch('/api/v1/announcement/' + selectedAnnouncement.id,
        {
          topic: values.topic,
          content: values.content,
          expirationDate: values.expirationDate,
          image: values.image
        },
        {
          headers: {
            'Authorization': `Bearer ${admin.jwtToken}`,
            "Content-Type": "multipart/form-data",
          }
        })
        .then(function (response) {
          handleCloseEditModal();
          setImagePreview("")
          toastSuccess("Announcement successfully updated.");
        })
        .catch(function (error) {
          toastError(error.response.data)
          console.log(error)
          if (error.response.status === 401) {
            dispatch(updateAdminInfo({
              jwtToken: null,
            }))
          }
        })
        .finally(() => {
          setIsAnnouncementsChanged(true)
        })
    }
  }

  const [imagePreview, setImagePreview] = useState<string>();

  const handleImagePreview = (image: Blob) => {
    setImagePreview(URL.createObjectURL(image))
  }

  //Websocket.
  const connect = () => {
    let socket = new SockJS('http://localhost:4000/notify');
    stompClient = over(socket);
    stompClient.debug = function () { };//do nothing
    stompClient.connect({}, function () {
      stompClient.subscribe('/topic/newNotifications', function (notificationResponse: Message) {
        showNotificationResponse(JSON.parse(notificationResponse.body));
      });
    });
  }

  function showNotificationResponse(newAnnouncement: Announcement) {
      setAnnouncementList(prev => [...prev, newAnnouncement]);
      if(admin.jwtToken === null) {
        toastInfo("New announcement published.");
      }
  }

  function sendNotification(announcementId: string) {
    stompClient.send("/app/notify", {}, announcementId);
  }

  return (
    <div>
      <NavbarComponent />
      <div className='announcement-container'>
        <div>
          {
            admin.jwtToken ?
              <button type="button" className="btn btn-primary" onClick={handleShowInserttModal}>
                Create Announcement
              </button>
              : null
          }

        </div>
        {
          announcementList?.map(announcement => {
            return (
              <div>
                <AnnouncementCard announcement={announcement} handleShowEditModal={handleShowEditModal} handleShowDeleteModal={handleShowDeleteModal}></AnnouncementCard>
              </div>
            )
          })
        }
      </div>
      <div>
        <Modal centered show={showInsertModal} onHide={handleCloseInsertModal}>
          <Modal.Header closeButton>
            <Modal.Title> New Announcement </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={initialValuesAnnouncementSave}
              validationSchema={CreateAnnouncementSchema}
              onSubmit={(values) => {
                saveAnnouncement(values)
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
                  <div className="">
                    <label htmlFor="file">Image</label>
                    <input id="file" name="file" type="file" onChange={(event) => {
                      if (event.currentTarget.files) {
                        setFieldValue("image", event.currentTarget.files[0])
                        handleImagePreview(event.currentTarget.files[0])
                      };
                    }} className="form-control image-input" />
                    {
                      imagePreview ?
                        <img className="image-preview" width={"400px"} src={imagePreview}></img>
                        : null
                    }
                  </div>
                  <div className="d-flex justify-content-around">
                    <Button variant="secondary" onClick={handleCloseInsertModal}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit">
                      Publish Announcement
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
            Remove announcement with topic {selectedAnnouncement?.topic}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => handleDeleteAnnouncement(selectedAnnouncement?.id)}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal centered show={showEditModal} onHide={handleCloseEditModal} className="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit announcement with topic {selectedAnnouncement?.topic}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={initialValuesAnnouncement}
              validationSchema={UpdateAnnouncementSchema}
              onSubmit={(values) => {
                updateAnnouncement(values)
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
                  <div className="">
                    <label htmlFor="file">Image</label>
                    <input id="file" name="file" type="file" onChange={(event) => {
                      if (event.currentTarget.files) {
                        setFieldValue("image", event.currentTarget.files[0])
                        handleImagePreview(event.currentTarget.files[0])
                      };
                    }} className="form-control" />
                    {
                      imagePreview ?
                        <img className="image-preview" width={"400px"} src={imagePreview}></img>
                        : null
                    }
                  </div>
                  <div className="d-flex justify-content-around">
                    <Button variant="secondary" onClick={handleCloseInsertModal}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit">
                      Update Announcement
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
