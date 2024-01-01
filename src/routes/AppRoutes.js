import {
    BrowserRouter as Switch, Route,
} from "react-router-dom";
import "./AppRoutes.scss"
import Users from '../component/ManageUsers/Users.js';
import Login from '../component/Login/Login.js'
import Dashboard from "../component/Dashboard/Dashboard.js";
import Supplier from "../component/Supplier/Supplier.js";
import Customer from "../component/Customer/Customer.js";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min.js";
import Category from "../component/Category/Category.js";
import Suppliers from "../component/Supplier/Supplier.js";
import Product from "../component/Product/Product.js"
import Receipt from "../component/WarehouseReceipt/Receipt.js"
// import ImportForm from "../component/WarehouseReceipt/ModalDetail.js"
// import PrivateRoutes from "./PrivateRoutes.js";
const AppRoutes = (props) => {
    const Project = () => {
        return (
            <span></span>
        )
    }

    return (
        <>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <div id="content-wrapper" className="d-flex" >
                    <div>

                        <Dashboard />
                    </div>
                    <div className="content-left">

                        <Route path="/users">
                            <Users />
                        </Route>
                        <Route path="/suppliers">
                            <Suppliers />
                        </Route>
                        <Route path="/category">
                            <Category />
                        </Route>
                        <Route path="/product">
                            <Product />
                        </Route>
                        <Route path="/customer">
                            <Customer />
                        </Route>
                        <Route path="/receipt">
                            <Receipt />
                        </Route>
                        {/* <Route path="/detail-import">
                            <ImportForm />
                        </Route> */}


                        <Route path="/" >

                        </Route>
                        <Route path="/*">
                        </Route>
                    </div>
                </div>

            </Switch>
        </>
    )
}

export default AppRoutes;