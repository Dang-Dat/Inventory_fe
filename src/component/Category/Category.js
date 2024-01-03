import React from 'react'
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import './Category.scss';
import ModalDeleteCategory from './ModalDeleteCategory';
import ModalCategory from './ModalCategory';
import _ from "lodash";
import { getListCategories, deleteCategory } from '../../service/dataService'
const Category = (props) => {

    const location = useLocation();

    const [pageNumber, setpageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(6); // so phan tu trong 1 page
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyWord] = useState("");

    useEffect(() => {
        fetchCategories();

    }, [pageNumber])
    useEffect(() => {
        fetchCategories();

    }, [keyWord])



    const [listCategories, setListCategories] = useState([]);

    const fetchCategories = async () => {
        let response = await getListCategories(pageNumber, keyWord, pageSize);
        if (response && response.data) {
            setTotalPages(response.data.data.totalPageNumber);
            setListCategories(response.data.data.list)

        }
    }
    //modal update/create user
    const [isShowModalCategory, setIsShowModalCategory] = useState(false);
    const [actionModalCategory, setActionModalCategory] = useState('');
    const [dataModalUpdate, setDataModalUpdate] = useState({});

    //modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModalDelete, setDataModalDelete] = useState({});// delete

    //page
    const handlePageClick = async (event) => {
        await setpageNumber(+event.selected + 1);

    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModalDelete({});
    }
    const onHideModalCategory = async () => {
        setIsShowModalCategory(false);
        setDataModalUpdate({});
        await fetchCategories();
    }
    const hanldeDeleteCategory = (category) => {
        setDataModalDelete(category);
        setIsShowModalDelete(true);
    }
    const confirmDeleteCategory = async () => {
        let response = await deleteCategory(dataModalDelete);
        if (response) {
            toast.success("Xoa thanh cong")
            await fetchCategories();
        } else {
            toast.error("Co loi trong khi xoa")
        }
        setIsShowModalDelete(false);
    }
    const hanldeUpdateCategory = (data) => {
        setActionModalCategory('UPDATE')
        setIsShowModalCategory(true);
        setDataModalUpdate(data);
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
                                <h3>Loại thuốc</h3>

                            </div>
                            <div className="actions" >

                                <button className="btn btn-primary"
                                    onClick={() => { setIsShowModalCategory(true); setActionModalCategory("CREATE") }}
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
                                        <th style={{ width: '5%' }} scope="col">#</th>

                                        <th scope="col">Loại Thuốc</th>
                                        <th scope="col">Mô tả</th>
                                        <th >Actions</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {listCategories && listCategories.length > 0 ?
                                        <>
                                            {listCategories.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{(pageNumber - 1) * pageSize + index + 1}</td>

                                                        <td>{item.name}</td>
                                                        <td>{item.description}</td>

                                                        <td>
                                                            <button className="btn btn-warning mx-3"
                                                                onClick={() => hanldeUpdateCategory(item)}
                                                            ><i className="fa-regular fa-pen-to-square"></i></button>
                                                            <button className="btn btn-danger"
                                                                onClick={() => hanldeDeleteCategory(item)}
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
                <ModalDeleteCategory
                    show={isShowModalDelete}
                    handleClose={handleClose}
                    confirmDeleteCategory={confirmDeleteCategory}
                    dataModal={dataModalDelete}
                />

                <ModalCategory
                    handleClose={handleClose}
                    show={isShowModalCategory}
                    onHide={onHideModalCategory}
                    action={actionModalCategory}
                    dataModalUpdate={dataModalUpdate}
                />
            </div>
        </>
    )
}

export default Category