import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ModalProduct from "./ModalProduct";
import ModalDeleteProduct from "./ModalDeleteProduct";
import { getListProduct, deleteProduct, getProductByID } from '../../service/dataService';
import _ from "lodash";
import ReactPaginate from 'react-paginate';
const Product = (props) => {
    const location = useLocation();

    const [pageNumber, setpageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyWord] = useState("");
    useEffect(() => {
        fetchProduct();

    }, [pageNumber])
    useEffect(() => {
        fetchProduct();

    }, [keyWord])


    const [listProduct, setListProduct] = useState([]);
    // const [getCategory,setGetCategory] = useState([]);
    const fetchProduct = async () => {
        let response = await getListProduct(keyWord, pageNumber, pageSize);

        if (response && response.data) {
            setTotalPages(response.data.data.totalPageNumber);
            setListProduct(response.data.data.list)

        }
    }
    //modal update/create user
    const [isShowModalProduct, setIsShowModalProduct] = useState(false);
    const [actionModalProduct, setActionModalProduct] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});



    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete
    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }
    const onHideModalProduct = async () => {
        setIsShowModalProduct(false);
        setDataModalUpdate({});
        await fetchProduct();
    }
    const confirmDeleteProduct = async () => {
        let response = await deleteProduct(dataModalDelete);
        if (response) {
            toast.success(response.data.message)
            await fetchProduct();
        } else {
            toast.error("LOI")
        }
        setIsShowModalDelete(false);

    }
    const hanldeDeleteProduct = (supplier) => {
        setDataModalDelete(supplier);
        setIsShowModalDelete(true);
    }
    const hanldeUpdateProduct = async (product) => {
        let res = await getProductByID(product)
        setActionModalProduct('UPDATE')
        setIsShowModalProduct(true);
        setDataModalUpdate(res.data.data);
    }
    const handlePageClick = async (event) => {
        await setpageNumber(+event.selected + 1);
    };
    const hanldeRefresh = async () => {
        await fetchProduct();
    }
    const handleOnchangeInput = (value) => {
        let _Data = _.cloneDeep(keyWord)
        _Data = value;
        setKeyWord(_Data);
    }
    const handleSearch = async (value) => {
        // setKeyWord(value);
    }
    return (
        <>
            <div className="" id="content">
                <div className="container"  >
                    <div className="manage-users-container">
                        <div className="user-head">
                            <div className="title mt-3">
                                <h3>Product</h3>

                            </div>
                            <div className="actions">
                                <button className="btn btn-success refresh" onClick={() => hanldeRefresh()}>

                                    <i class="fa-regular fa-arrows-rotate"></i> Refresh</button>
                                <button className="btn btn-primary"
                                    onClick={() => { setIsShowModalProduct(true); setActionModalProduct("CREATE") }}
                                >
                                    <i className='fa fa-plus-circle'></i> Add new</button>
                                <form
                                    className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search search-for  ">
                                    <div className="input-group" style={{ marginLeft: "900px" }}>
                                        <input type="text" className="form-control bg-light border-0 small" placeholder="Tìm kiếm"
                                            aria-label="Search" aria-describedby="basic-addon2" value={keyWord}
                                            onChange={(event) => handleOnchangeInput(event.target.value, "keyWord")}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button"
                                                onClick={() => handleSearch()}
                                            ><i className="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                        <div className="user-body">

                            <table className="table table-borderred table-hover">
                                <thead>
                                    <tr>
                                        {/* <th scope="col">#</th> */}
                                        <th scope="col">id</th>
                                        <th scope="col">Tên thuốc</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Loại Thuốc</th>
                                        <th scope="col">Mô tả</th>
                                        <th >Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listProduct && listProduct.length > 0 ?
                                        <>
                                            {listProduct.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        {/* <td>{(currentPage - 1) * currentLimit + index + 1}</td> */}
                                                        <td>{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.category.name}</td>
                                                        <td>{item.description}</td>

                                                        <td>
                                                            <button className="btn btn-warning mx-3"
                                                                onClick={() => hanldeUpdateProduct(item)}
                                                            ><i className="fa fa-pencil-square-o"></i>Edit</button>
                                                            <button className="btn btn-danger"
                                                                onClick={() => hanldeDeleteProduct(item)}
                                                            ><i className="fa fa-trash" ></i>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </>
                                        :
                                        <>
                                            <tr><td>not found</td></tr>
                                        </>
                                    }

                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 &&
                            <div className="user-footer">
                                <ReactPaginate
                                    nextLabel="next >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPages}
                                    previousLabel="< previous"
                                    pageClassName="page-item"
                                    pageLinkClassName="page-link"
                                    previousClassName="page-item"
                                    previousLinkClassName="page-link"
                                    nextClassName="page-item"
                                    nextLinkClassName="page-link"
                                    breakLabel="..."
                                    breakClassName="page-item"
                                    breakLinkClassName="page-link"
                                    containerClassName="pagination"
                                    activeClassName="active"
                                    renderOnZeroPageCount={null}
                                />
                            </div>
                        }
                    </div>
                </div>
                <ModalDeleteProduct
                    show={isShowModalDelete}
                    handleClose={handleClose}
                    confirmDeleteProduct={confirmDeleteProduct}
                    dataModal={dataModalDelete}
                />

                <ModalProduct
                    handleClose={handleClose}
                    show={isShowModalProduct}
                    onHide={onHideModalProduct}
                    action={actionModalProduct}
                    dataModalUpdate={dataModalUpdate}
                />
            </div>
        </>
    )
}

export default Product