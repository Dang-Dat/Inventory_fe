
import { useEffect, useState } from "react";
import { getListCustomers, deleteCustomer } from "../../service/dataService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalCustomer from './ModalCustomer'
import ModalDeleteCustomer from './ModalDeleteCustomer'
import { useLocation } from 'react-router-dom';
import _ from "lodash";
const Customer = (props) => {
    const location = useLocation();
    const [listCustomers, setListCustomers] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(8); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyWord] = useState("");
    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete

    //modal update/create user
    const [isShowModalCustomer, setIsShowModalCustomer] = useState(false);
    const [actionModalCustomer, setActionModalCustomer] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});

    useEffect(() => {
        fetchCustomers();

    }, [pageNumber])
    useEffect(() => {
        fetchCustomers();

    }, [keyWord])

    const fetchCustomers = async (page) => {
        let response = await getListCustomers(keyWord, pageNumber, pageSize);
        if (response && response.data) {
            setTotalPages(response.data.data.totalPageNumber);
            setListCustomers(response.data.data.list)
        }
    }
    const handlePageClick = async (event) => {
        await setPageNumber(+event.selected + 1);
        // await fetchCustomers(+event.selected + 1);
    };
    const hanldeDeleteCustomer = (customer) => {
        setDataModalDelete(customer);
        setIsShowModalDelete(true);
    }
    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }
    const onHideModalCustomer = async () => {
        setIsShowModalCustomer(false);
        setDataModalUpdate({});
        await fetchCustomers();
    }
    const confirmDeleteCustomer = async () => {
        let response = await deleteCustomer(dataModalDelete);
        if (response && response.data) {
            toast.success("Xoa thanh cong")
            await fetchCustomers();
        } else {
            toast.error("Loi trong khi xoa")
        }
        setIsShowModalDelete(false);
    }
    const hanldeUpdateCustomer = (customer) => {
        setActionModalCustomer('UPDATE')
        setIsShowModalCustomer(true);
        setDataModalUpdate(customer);
    }
    const hanldeRefresh = async () => {
        await fetchCustomers();
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
            <div className="">
                <div className="container "  >
                    <div className="manage-users-container">
                        <div className="user-head">
                            <div className="title mt-3">
                                <h3>Khach hang</h3>
                            </div>
                            <div className="actions">

                                <button className="btn btn-primary"
                                    onClick={() => { setIsShowModalCustomer(true); setActionModalCustomer("CREATE") }}
                                ><i className='fa fa-plus-circle'></i> Thêm mới</button>
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
                                        <th style={{ width: '4%' }} scope="col">STT</th>
                                        <th scope="col">name</th>
                                        <th scope="col">phone</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Adress</th>
                                        <th scope="col">Note</th>
                                        <th style={{ width: '16%' }}>Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listCustomers && listCustomers.length > 0 ?
                                        <>
                                            {listCustomers.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{(pageNumber - 1) * pageSize + index + 1}</td>
                                                        {/* <td>{item.id}</td> */}
                                                        <td>{item.fullName}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.note}</td>
                                                        <td>
                                                            <button className="btn btn-warning mx-3"
                                                                onClick={() => hanldeUpdateCustomer(item)}
                                                            ><i className="fa-regular fa-pen-to-square"></i></button>
                                                            <button className="btn btn-danger"
                                                                onClick={() => hanldeDeleteCustomer(item)}
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
                                    nextLabel=">"
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
                <ModalDeleteCustomer
                    show={isShowModalDelete}
                    handleClose={handleClose}
                    confirmDeleteCustomer={confirmDeleteCustomer}
                    dataModal={dataModalDelete}
                />
                <ModalCustomer
                    handleClose={handleClose}
                    show={isShowModalCustomer}
                    onHide={onHideModalCustomer}
                    action={actionModalCustomer}
                    dataModalUpdate={dataModalUpdate}
                />
            </div>
        </>
    )
}


export default Customer;