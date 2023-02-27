import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import axios from 'axios';
import { updateAdminInfo } from '../redux/adminSlice';
import "./AdminLoginPage.css"
import { toastError } from '../utils/toastMessages';

export interface IAdminLoginPageProps {
}

export default function AdminLoginPage(props: IAdminLoginPageProps) {

    const dispatch = useAppDispatch()

    interface FormDataType { username: string, password: string }
    const formData: FormDataType = { username: "", password: "" }
    const [requestBody, setRequestBody] = useState<FormDataType>(formData)

    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setRequestBody({ ...requestBody, [name]: value })
    }

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        axios.post('/api/v1/admin/login', {
            username: requestBody.username,
            password: requestBody.password
        })
            .then((response) => {
                dispatch(updateAdminInfo({
                    jwtToken: response.data.jwtToken,
                }))
            })
            .catch(function (error) {
                console.log(error);
                toastError(error.response.data)
            });
    }

    return (
        <div>
            <div className="admin-login-container">
                <div className="d-flex justify-content-center">
                    <div className="flex-content col-md-4">
                        <div className='text-center'>
                            <h2>ADMIN PANEL</h2>
                        </div>
                        <form id="loginform" onSubmit={submitForm}>
                            <div className="form-group">
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input id="username" className="form-control" name="username" type="username" onChange={(e) => inputChangeHandler(e)} autoComplete="username" required placeholder="Username" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input id="password" className="form-control" name="password" type="password" onChange={(e) => inputChangeHandler(e)} autoComplete="current-password" required placeholder="Password" />
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
