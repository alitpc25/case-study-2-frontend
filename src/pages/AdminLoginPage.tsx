import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import axios from 'axios';
import { updateAdminInfo } from '../redux/adminSlice';

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
                console.log(response)
                dispatch(updateAdminInfo({
                    jwtToken: response.data.jwtToken,
                }))
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="flex min-h-full items-center justify-center py-40 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submitForm} method="POST">
                    <input type="hidden" name="remember" value="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="sr-only">Email address</label>
                            <input id="username" name="username" type="username" onChange={(e) => inputChangeHandler(e)} autoComplete="username" required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Username" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" onChange={(e) => inputChangeHandler(e)} autoComplete="current-password" required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm" placeholder="Password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
