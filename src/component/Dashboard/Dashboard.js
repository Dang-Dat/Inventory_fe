import React, { useEffect, useState } from 'react';
import Users from '../ManageUsers/Users';
import Supplier from '../Supplier/Supplier'
import { NavLink, useLocation } from 'react-router-dom';
import Category from '../Category/Category';


const Dashboard = (props) => {

    const defaultComponent = {
        showUser: false,
        showSupplier: false,
        showCategory: false,
        showCustomers: false,
    }
    const [isShow, setIsShow] = useState(defaultComponent)
    const [isShowDashBroad, setIsShowDashBoard] = useState(false)
    let location = useLocation();
    useEffect(() => {
        if (location.pathname === '/login') {
            setIsShowDashBoard(false)
        }
        else {
            setIsShowDashBoard(true)
        }
    }, [])

    const handleShowUsers = (e) => {
        setIsShow({ ...defaultComponent, showUser: true })
        // setIsShowSupplier(false)
        // setIsShowUser(true);
    }
    const handleShowCategory = (e) => {
        setIsShow({ ...defaultComponent, showCategory: true })

    }
    const handleShowSupplier = () => {
        setIsShow({ ...defaultComponent, showSupplier: true })

        // setIsShowUser(false)
        // setIsShowSupplier(true)
    }
    const handleShowCustomers = () => {
        setIsShow({ ...defaultComponent, showCustomers: true })
    }
    return (
        <>{isShowDashBroad === true &&

            <div id="wrapper">

                {/* <!-- Sidebar --> */}
                <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

                    {/* <!-- Sidebar - Brand --> */}
                    <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fa-laugh-wink"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">ADMIN</div>

                    </a>

                    <hr className="sidebar-divider my-0" />

                    {/* <!-- Nav Item - Dashboard --> */}
                    <li className="nav-item active">
                        <a className="nav-link" href="#" id="userDropdown"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-white-600 small">Douglas McGee</span>
                            <img className="img-profile rounded-circle" src="img/undraw_profile.svg" />
                        </a>

                        <a className="nav-link" href="/">
                            <i className="fas fa-fw fa-tachometer-alt"></i>
                            Dashboard
                        </a>
                    </li>


                    <hr className="sidebar-divider" />


                    <div className="sidebar-heading">
                        Interface
                    </div>

                    {/* <!-- Nav Item - Pages Collapse Menu --> */}
                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/users" onClick={() => handleShowUsers()}>
                            <i className="fa-solid fa-user"></i>
                            User
                        </NavLink>
                        {/* <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">

                            <NavLink className="collapse-item" to="/users" onClick={() => handleShowUsers()}>List Users</NavLink>
                            <NavLink className="collapse-item" to="/supplier" onClick={() => handleShowSupplier()}>Supplier</NavLink>
                        </div>
                    </div> */}
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/customer" >
                            <i className="fas fa-fw fa-wrench"></i>
                            Khách hàng
                        </NavLink>

                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link collapse-item" to="/suppliers" >
                            <i className="fa-solid fa-warehouse"></i>
                            Nhà cung cấp
                        </NavLink>

                    </li>
                    {/* <!-- Nav Item - Utilities Collapse Menu --> */}
                    <hr className="sidebar-divider" />
                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/product" >
                            <i className="fa-brands fa-product-hunt"></i>
                            Sản phẩm
                        </NavLink>

                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/category" onClick={() => handleShowCategory()} >
                            <i className="fas fa-fw fa-wrench"></i>
                            Category
                        </NavLink>

                    </li>


                    {/* <!-- Divider --> */}
                    <hr className="sidebar-divider" />

                    {/* <!-- Heading --> */}
                    <div className="sidebar-heading">
                        Hoa Don
                    </div>
                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/receipt"  >
                            <i className="fa-solid fa-clipboard"></i>
                            Nhập kho
                        </NavLink>

                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link collapsed" to="/test"  >
                            <i className="fas fa-fw fa-wrench"></i>
                            TÉT
                        </NavLink>

                    </li>
                    {/* <!-- Nav Item - Pages Collapse Menu --> */}
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages"
                            aria-expanded="true" aria-controls="collapsePages">
                            <i className="fas fa-fw fa-folder"></i>
                            <span>Pages</span>
                        </a>
                        <div id="collapsePages" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                            <div className="bg-white py-2 collapse-inner rounded">
                                <h6 className="collapse-header">Login Screens:</h6>
                                <a className="collapse-item" href="login.html">Login</a>
                                <a className="collapse-item" href="register.html">Register</a>
                                <a className="collapse-item" href="forgot-password.html">Forgot Password</a>
                                <div className="collapse-divider"></div>
                                <h6 className="collapse-header">Other Pages:</h6>
                                <a className="collapse-item" href="404.html">404 Page</a>
                                <a className="collapse-item" href="blank.html">Blank Page</a>
                            </div>
                        </div>
                    </li>


                    <li className="nav-item">
                        <a className="dropdown-item nav-link" href="#" data-toggle="modal" data-target="#logoutModal">
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Logout
                        </a>
                    </li>


                    <hr className="sidebar-divider d-none d-md-block" />


                    <div className="text-center d-none d-md-inline">
                        <button className="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>

                </ul>
                {/* <!-- End of Sidebar --> */}


            </div>
        }
        </>


    )
}


export default Dashboard;