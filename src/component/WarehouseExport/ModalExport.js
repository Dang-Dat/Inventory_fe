import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { createNewWarehouseExport, updateSupplier, getAllCustomer, getAllProduct } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalExport = (props) => {
    const { action, dataModalUpdate } = props;

    const defaultExportData = {
        code: '',
        customerId: '',
        note: '',
        createWarehouseImportDetailDto: [{
            productId: '',
            quantity: '',
            price: ''
        }]
    }
    const validInputDefault = {
        code: true,
        customerId: true,
        createWarehouseImportDetailDto: [{
            productId: true,
            quantity: true,
            price: true
        }]
    }

    const [exportData, setExportData] = useState(defaultExportData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    const [supplierData, setSupplierData] = useState([]);
    const [productData, setProductData] = useState([]);
    useEffect(() => {
        fetchSuppliers();
        fetchAllProduct();
    }, [])
    useEffect(() => {
        if (action === 'UPDATE' && dataModalUpdate && dataModalUpdate.detailImport) {
            console.log("update", dataModalUpdate)
            setExportData({
                ...dataModalUpdate,
                customerId: dataModalUpdate.customerId,
                createWarehouseImportDetailDto: dataModalUpdate.detailImport.map(detail => ({
                    productId: detail.id, // Cần cập nhật với giá trị thích hợp từ dữ liệu sản phẩm
                    quantity: detail.quantity,
                    price: detail.price
                }))


            });
        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {

            setExportData({ ...exportData });

        }
    }, [action])

    const fetchSuppliers = async () => {
        let response = await getAllCustomer();
        if (response && response.data) {
            setSupplierData(response.data.data)
        }
    }
    const fetchAllProduct = async () => {
        let res = await getAllProduct();
        let response = await getAllProduct();
        if (response && response.data) {
            setProductData(response.data.data)
        }
    }

    //check 
    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInputs(validInputDefault);
        let arr = ['code', 'customerId'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!exportData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs)
                toast.error(`Empty input ${arr[i]} `);
                check = false;
                break;
            }
        }
        return check;
    }
    // Hàm xử lý khi thay đổi giá trị trong form
    const handleChangeform = (e) => {
        const { name, value } = e.target;
        setExportData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Hàm xử lý khi thay đổi giá trị của chi tiết nhập kho
    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        if (!isNaN(value) && Number(value) >= 0) {

            setExportData(prevData => ({
                ...prevData,
                createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto.map((detail, i) =>
                    i === index ? { ...detail, [name]: value } : detail
                )
            }));
        }
    };
    const hadleConfirmExport = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewWarehouseExport({ ...exportData }) : await updateSupplier({ ...exportData });
            // await createNewWarehouseExport({ ...exportData })
            if (response.data) {
                props.onHide();
                setExportData({ ...defaultExportData });
                toast.success(action, "successful")
            } else {
                toast.error(response.message);
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response.data.content] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalExport = () => {
        props.onHide();
        setExportData((prevData) => ({
            ...defaultExportData,
            createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto || []
        }));
        setValidInputs(validInputDefault);
    }
    // Hàm xử lý khi thêm chi tiết nhập kho
    const addDetail = () => {
        setExportData(prevData => ({
            ...prevData,
            createWarehouseImportDetailDto: [
                ...prevData.createWarehouseImportDetailDto,
                {
                    productId: '',
                    quantity: '',
                    price: ''
                }
            ]
        }));
    };
    const handleDelete = (index) => {
        // const deleteProduct = []
        // deleteProduct.splice(index)
        setExportData(prevData => ({
            ...prevData,
            createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto.filter((detail, i) => i !== index)
        }));
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalExport()} >
                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Tạo mới hóa đơn xuất kho' : 'Chỉnh sửa hóa đơn xuất kho'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mã hóa đơn(<span className='red'>*</span>) :</label>
                            <input disabled={action === 'CREATE' ? false : true}
                                className={validInputs.code ? 'form-control' : 'form-control is-invalid'} type="text"
                                name="code" value={exportData.code} onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Khách hàng(<span className='red'>*</span>) :</label>
                            <select disabled={action === 'CREATE' ? false : true} className={validInputs.customerId ? 'form-select' : 'form-select is-invalid'}
                                name="customerId" onChange={handleChangeform}
                                value={exportData.customerId}
                            >
                                <option selected >Chọn</option>
                                {supplierData.length > 0 &&
                                    supplierData.map((item, index) => {
                                        return (
                                            <option key={`supplierData-${index}`} value={item.id}>{item.fullName}</option>
                                        )

                                    })
                                }
                            </select>

                        </div>


                        <div className='col-12 col-sm-12 form-group' >
                            <label>Ghi chú :</label>
                            <input
                                className={'form-control'} type="text" value={exportData.note}
                                name="note" onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group '  >
                            <label><h6>Danh sách sản phẩm :</h6></label>
                        </div>
                        {exportData.createWarehouseImportDetailDto && exportData.createWarehouseImportDetailDto.map((detail, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Tên thuốc(<span className='red'>*</span>) :</label>
                                        <select className={'form-select'} id={`productId${index}`}
                                            name="productId" value={detail.productId}
                                            onChange={(e) => handleDetailChange(index, e)}

                                        >
                                            <option selected>Chọn</option>
                                            {productData.length > 0 &&
                                                productData.map((item, index) => {
                                                    return (
                                                        <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='col-4 col-sm-3 form-group' >
                                        <label>Số lượng(<span className='red'>*</span>) :</label>
                                        <input
                                            className={'form-control'} type="number"
                                            id={`quantity${index}`} name="quantity" value={detail.quantity} onChange={(e) => handleDetailChange(index, e)} min={0}
                                        />
                                    </div>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Giá bán(<span className='red'>*</span>) :</label>
                                        <input
                                            className={'form-control'} type="number"
                                            id={`price${index}`} name="price" value={detail.price} onChange={(e) => handleDetailChange(index, e)} min={0}
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <button style={{
                                            backgroundColor: '#aaa',
                                            marginTop: '33px',
                                            border: 'none',
                                            padding: '5px 20px',
                                            cursor: 'pointer',
                                            borderRadius: '5px',
                                            height: '35px'
                                        }}
                                            onClick={() => handleDelete(index)}>x</button>
                                    </div>
                                </div>

                            </div>
                        ))}
                        <button className="btn btn-primary col-2 col-sm-2 form-group" onClick={() => addDetail()}
                            style={{
                                marginLeft: '30px'
                            }}
                        >
                            <i className='fa fa-plus-circle'></i> Add
                        </button>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalExport()}>Close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmExport()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalExport;