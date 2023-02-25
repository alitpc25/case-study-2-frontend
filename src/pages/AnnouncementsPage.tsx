import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import Announcement from '../models/Announcement';
import axios from "axios"
import { updateAdminInfo } from '../redux/adminSlice';
import AnnouncementCard from '../components/AnnouncementCard';
import { Modal, Button } from 'react-bootstrap';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import MyDatePicker from '../components/MyDatePicker';
import { toastError, toastSuccess } from '../utils/toastMessages';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema } from '../utils/yupSchemas';
import AnnouncementSchema from '../utils/AnnouncementSchema';

export interface IAnnouncementsPageProps {
}

export default function AnnouncementsPage(props: IAnnouncementsPageProps) {

  const admin = useAppSelector(state => state.admin);
  const dispatch = useAppDispatch();

  const [announcementList, setAnnouncementList] = useState<Announcement[]>()

  const getAllAnnouncements = () => {
    axios.get(`/api/v1/announcement`)
      .then((res) => {
        console.log(res.data)
        setAnnouncementList(res.data)
      }).catch((e) => {
        console.log(e);
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

  const initialValuesAnnouncement = {
    topic: selectedAnnouncement?.topic,
    content: selectedAnnouncement?.content,
    expirationDate: selectedAnnouncement?.expirationDate ? new Date(selectedAnnouncement.expirationDate) : new Date(),
    image: undefined // new File(selectedAnnouncement?.image)
  };

  const initialValuesAnnouncementSave = {
    topic: "",
    content: "",
    expirationDate: new Date(),
    image: undefined
  };

  const handleDeleteAnnouncement = (announcementId: string | undefined) => {
    if (announcementId) {
      axios.delete('/api/v1/announcement/' + announcementId)
        .then(function (response) {
          toastSuccess(response.data);
          handleCloseDeleteModal()
        })
        .catch(function (error) {
          toastError(error.response.data);
        })
        .finally(() => {
          setIsAnnouncementsChanged(true)
        })
    }
  }

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
      })
      .catch(function (error) {
        console.log(error)
        toastError(error.response.data);
      })
      .finally(() => {
        setIsAnnouncementsChanged(true)
      })
  }

  const updateAnnouncement = (values: AnnouncementSchema) => {
    if (selectedAnnouncement) {
      axios.patch('/api/v1/announcement/' + selectedAnnouncement.id,
        values,
        {
          headers: {
            'Authorization': `Bearer ${admin.jwtToken}`,
          }
        })
        .then(function (response) {
          handleCloseEditModal();
          toastSuccess("Interaction info successfully updated.");
        })
        .catch(function (error) {
          toastError(error.response.data)
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

  return (
    <div>
      <div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleShowInserttModal}>
          Insert
        </button>
      </div>
      {
        announcementList?.map(announcement => {
          return (
            <div>
              <AnnouncementCard announcement={announcement}></AnnouncementCard>
              <div>
                <button onClick={(event) => handleShowEditModal(event, announcement)} type="button" className="btn btn-primary">Edit</button>
                <button onClick={(event) => handleShowDeleteModal(event, announcement)} type="button" className="btn btn-danger">Delete</button>
              </div>
            </div>
          )
        })
      }
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
                      <Field type="textarea" name="content" className='form-control' />
                      <ErrorMessage name="content" component="div" />
                    </div>
                  </div>
                  <div className=''>
                    <label htmlFor="date">Expiration Date</label>
                    <div className='p-2'>
                      <MyDatePicker name="date" />
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
                        <img width={"400px"} src={imagePreview}></img>
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
                    <Field type="textarea" name="content" className='form-control' />
                    <ErrorMessage name="content" component="div" />
                  </div>
                </div>
                <div className=''>
                  <label htmlFor="date">Expiration Date</label>
                  <div className='p-2'>
                    <MyDatePicker name="date" />
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
                      <img width={"400px"} src={imagePreview}></img>
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
