import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import ModalExport from './ModalExport';
import ModalDeleteWarehouseExport from './ModalDeleteExport';
import ModalDetailExport from './ModalDetailExport';
import _ from "lodash";
import { getListWarehouseExport, deleteWarehouseExport, getWarehouseExport } from '../../service/dataService'
const Export = (props) => {
    const location = useLocation();
    const [pageNumber, setpageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyWord] = useState("");

    useEffect(() => {
        fetchExport();
    }, [keyWord])
    useEffect(() => {
        fetchExport();
    }, [pageNumber])

    const [listExport, setListExport] = useState([]);
    const fetchExport = async () => {
        let response = await getListWarehouseExport(keyWord, pageNumber, pageSize);
        if (response && response.data) {
            // setTotalPages(response.data.data.totalPageNumber);
            setListExport(response.data.data.list)
        }
    }
    //modal update/create user
    const [isShowModalExport, setIsShowModalExport] = useState(false);
    const [actionModalExport, setActionModalExport] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});

    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete

    const [isShowModalDetail, setIsShowModalDetail] = useState(false);
    const [dataModalDetail, setDataModalDetail] = useState({})

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }

    const onHideModalExport = async () => {
        setIsShowModalExport(false);
        setDataModalUpdate({});
        await fetchExport();
    }
    const confirmDeleteExport = async () => {
        let response = await deleteWarehouseExport(dataModalDelete);
        if (response) {
            toast.success(response.data.message)
            await fetchExport();
        } else {
            toast.error("LOI")
        }
        setIsShowModalDelete(false);
    }
    const hanldeDeleteExport = (code) => {
        setDataModalDelete(code);
        setIsShowModalDelete(true);
    }
    const hanldeUpdateExport = async (dataExport) => {
        let response = await getWarehouseExport(dataExport);
        console.log("dataUpdate", response.data.data)
        setActionModalExport('UPDATE')
        setIsShowModalExport(true);
        setDataModalUpdate(response.data.data);
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
    const onHideModalDetailExport = async () => {
        setIsShowModalDetail(false);
        setDataModalDetail({});
        await fetchExport();
    }
    const handleDetailReceipt = async (data) => {
        let response = await getWarehouseExport(data);
        setIsShowModalDetail(true);
        setDataModalDetail(response.data.data);
    }
    return (
        <>
            <div className="" id="content">
                <div className="container"  >
                    <div className="manage-users-container">
                        <div className="user-head">
                            <div className="title mt-3">
                                <h3>Xuất kho</h3>
                            </div>
                            <div className="actions">

                                <button className="btn btn-primary"
                                    onClick={() => { setIsShowModalExport(true); setActionModalExport("CREATE") }}
                                >
                                    <i className='fa fa-plus-circle'></i>Thêm mới</button>
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
                                        <th style={{ width: '20%' }} scope="col">Mã hóa đơn</th>
                                        <th style={{ width: '20%' }} scope="col">Khách hàng</th>
                                        <th style={{ width: '30%' }} scope="col">Ghi chú</th>
                                        <th style={{ width: '16%' }}>Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listExport && listExport.length > 0 ?
                                        <>
                                            {listExport.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{(pageNumber - 1) * pageSize + index + 1}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.customer.fullName}</td>
                                                        <td>{item.note}</td>
                                                        <td>
                                                            <button className="btn btn-info "
                                                                onClick={() => handleDetailReceipt(item)}
                                                            ><i className="fa-solid fa-eye"></i></button>
                                                            <button className="btn btn-warning mx-2"
                                                                onClick={() => hanldeUpdateExport(item)}
                                                            ><i className="fa-regular fa-pen-to-square"></i></button>
                                                            <button className="btn btn-danger"
                                                                onClick={() => hanldeDeleteExport(item)}
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
                                    previousLabel="< "
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
                <ModalDeleteWarehouseExport
                    show={isShowModalDelete}
                    handleClose={handleClose}
                    confirmDeleteExport={confirmDeleteExport}
                    dataModal={dataModalDelete}
                />
                <ModalDetailExport
                    handleClose={handleClose}
                    show={isShowModalDetail}
                    onHide={onHideModalDetailExport}
                    dataModalDetail={dataModalDetail}
                />
                <ModalExport
                    handleClose={handleClose}
                    show={isShowModalExport}
                    onHide={onHideModalExport}
                    action={actionModalExport}
                    dataModalUpdate={dataModalUpdate}
                />
            </div>
        </>
    )
}

export default Export