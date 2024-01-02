import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ModalSupplier from './ModalSupplier'
import ModalDeleteSuppliers from './ModalDeleteSuppliers';
import _ from "lodash";
import { getListSuppliers, deleteSupplier } from '../../service/dataService'
const Supplier = (props) => {
    const location = useLocation();
    const [pageNumber, setpageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyWord] = useState("");

    useEffect(() => {
        fetchSuppliers();
    }, [keyWord])
    useEffect(() => {
        fetchSuppliers();
    }, [pageNumber])


    const [listSuppliers, setListSuppliers] = useState([]);
    const fetchSuppliers = async () => {
        let response = await getListSuppliers(keyWord, pageNumber, pageSize);

        if (response && response.data) {
            setTotalPages(response.data.data.totalPageNumber);
            setListSuppliers(response.data.data.list)
        }
    }
    //modal update/create user
    const [isShowModalSupplier, setIsShowModalSupplier] = useState(false);
    const [actionModalSupplier, setActionModalSuppliers] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});



    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete
    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }
    const onHideModalSupplier = async () => {
        setIsShowModalSupplier(false);
        setDataModalUpdate({});
        await fetchSuppliers();
    }
    const confirmDeleteSuppliers = async () => {
        console.log("delete", dataModalDelete)
        let response = await deleteSupplier(dataModalDelete);
        console.log('check respon: ', response)
        if (response) {
            toast.success(response.data.message)
            await fetchSuppliers();
        } else {
            toast.error("LOI")
        }
        setIsShowModalDelete(false);



        //{props.show === true && location.pathname === '/category' ? true : 'd-none'}
    }
    const hanldeDeleteSupplier = (supplier) => {
        setDataModalDelete(supplier);
        setIsShowModalDelete(true);
    }
    const hanldeUpdateSupplier = (user) => {
        setActionModalSuppliers('UPDATE')
        setIsShowModalSupplier(true);
        setDataModalUpdate(user);
    }

    const hanldeRefresh = async () => {
        await fetchSuppliers();
    }
    const handlePageClick = async (event) => {
        await setpageNumber(+event.selected + 1);
    };
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
                                <h3>Supplier</h3>

                            </div>
                            <div className="actions">
                                <button className="btn btn-success refresh"

                                ><i className='fa fa-refresh '></i> refresh</button>
                                <button className="btn btn-primary"
                                    onClick={() => { setIsShowModalSupplier(true); setActionModalSuppliers("CREATE") }}
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
                                        <th style={{ width: '5%' }} scope="col">id</th>
                                        <th style={{ width: '15%' }} scope="col">Nhà cung cấp</th>
                                        <th style={{ width: '15%' }} scope="col">Email</th>
                                        <th style={{ width: '10%' }} scope="col">Phone</th>
                                        <th style={{ width: '20%' }} scope="col">Address</th>
                                        <th style={{ width: '20%' }} scope="col">Note</th>
                                        <th style={{ width: '15%' }}>Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listSuppliers && listSuppliers.length > 0 ?
                                        <>
                                            {listSuppliers.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        {/* <td>{(currentPage - 1) * pageSize + index + 1}</td> */}
                                                        <td>{item.id}</td>
                                                        <td>{item.fullName}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.note}</td>
                                                        {/* <td>{item.products ? item.products.name : ''}</td> */}
                                                        <td>
                                                            <button className="btn btn-warning mx-3"
                                                                onClick={() => hanldeUpdateSupplier(item)}
                                                            ><i className="fa-regular fa-pen-to-square"></i></button>
                                                            <button className="btn btn-danger"
                                                                onClick={() => hanldeDeleteSupplier(item)}
                                                            ><i className="fa fa-trash" ></i></button>
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
                                    nextLabel=" >"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPages}
                                    previousLabel="<"
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
                <ModalDeleteSuppliers
                    show={isShowModalDelete}
                    handleClose={handleClose}
                    confirmDeleteSuppliers={confirmDeleteSuppliers}
                    dataModal={dataModalDelete}
                />

                <ModalSupplier
                    handleClose={handleClose}
                    show={isShowModalSupplier}
                    onHide={onHideModalSupplier}
                    action={actionModalSupplier}
                    dataModalUpdate={dataModalUpdate}
                />
            </div>
        </>
    )
}

export default Supplier