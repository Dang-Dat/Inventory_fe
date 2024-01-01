import './login.scss';
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = (props) => {
    // let history = useHistory();

    // const [valueLogin, setValueLogin] = useState("");
    // const [password, setPassword] = useState("")

    // const defaultObjValidInput = {
    //     isValidValueLogin: true,
    //     isValidPassword: true,
    // }
    // const [objValidInput, setObjValidInput] = useState(defaultObjValidInput)
    // const handleLogin = async () => {
    //     setObjValidInput(defaultObjValidInput);

    //     if (!valueLogin) {
    //         setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false })
    //         toast.error("Nhap email or sdt")
    //         return
    //     }
    //     if (!password) {
    //         setObjValidInput({ ...defaultObjValidInput, isValidPassword: false })
    //         toast.error("Nhap mat khau")
    //         return
    //     }

    //     let response = await userLogin(valueLogin, password);
    //     if (response && response.data && +response.data.EC === 0) {
    //         //success
    //         let data = {
    //             isAuthenticated: true,
    //             token: 'fake token'
    //         }
    //         sessionStorage.setItem('account', JSON.stringify(data))
    //         history.push('/users');
    //         window.location.reload();

    //     }
    //     if (response && response.data && +response.data.EC !== 0) {
    //         toast.error(response.data.EM)
    //     }

    // }

    // const handleCreateNewAccount = () => {
    //     history.push("/register")
    // }
    // const handlePressEnter = (event) => {
    //     if (event.charCode === 13 && event.code === 'Enter') {
    //         handleLogin();
    //     }
    // }
    return (
        <>
            <body className="bg-gradient-primary ">

                <div className="container">

                    {/* <!-- Outer Row --> */}
                    <div className="row justify-content-center">

                        <div className="col-xl-10 col-lg-12 col-md-9">

                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">
                                    {/* <!-- Nested Row within Card Body --> */}
                                    <div className="row">
                                        <div className="col-lg-6 d-none d-lg-block ">
                                            cho anh vao
                                        </div>
                                        <div className="col-lg-6 ">
                                            <div className="p-5">
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                                </div>
                                                <form className="user">
                                                    <div className="form-group">
                                                        <input type="email" className="form-control form-control-user"
                                                            id="exampleInputEmail" aria-describedby="emailHelp"
                                                            placeholder="Enter Email Address..." />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="password" className="form-control form-control-user"
                                                            id="exampleInputPassword" placeholder="Password" />
                                                    </div>
                                                    <a href="index.html" className="btn btn-primary btn-user btn-block">
                                                        Login
                                                    </a>
                                                    {/* <hr> */}

                                                </form>
                                                {/* <hr> */}
                                                <div className="text-center">
                                                    <a className="small" href="forgot-password.html">Forgot Password?</a>
                                                </div>
                                                <div className="text-center">
                                                    <a className="small" href="register">Create an Account!</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </body>
        </>
    )
}
export default Login;

