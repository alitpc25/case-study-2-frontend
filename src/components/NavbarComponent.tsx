import React from 'react';
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import axios from "axios"
import { toastError, toastSuccess } from '../utils/toastMessages';
import { updateAdminInfo } from '../redux/adminSlice';

export interface INavbarComponentProps {
}

export default function NavbarComponent(props: INavbarComponentProps) {

    const admin = useAppSelector(state => state.admin);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        axios.post('/api/v1/admin/logout',
            {},
            {
                headers: {
                    'Authorization': `Bearer ${admin.jwtToken}`,
                }
            })
            .then(function (response) {
                toastSuccess(response.data);
                dispatch(updateAdminInfo({
                    jwtToken: null,
                }))
            })
            .catch(function (error) {
                console.log(error)
                toastError(error.response.data);
            })
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/announcements">React Dernegi</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/announcements">Announcements</Nav.Link>
                            <Nav.Link href="/news">News</Nav.Link>
                        </Nav>
                        {
                            admin.jwtToken ?
                                <Nav>
                                    <Nav.Link>
                                        <Button variant="danger" onClick={handleLogout}>Log out</Button></Nav.Link>
                                </Nav>
                                : null
                        }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
