import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Receipt.css'
import { createNewWarehouseReceipt, updateWarehouseReceipt, getAllSuppliers, getAllProduct } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalReceipt = (props) => {
    const { action, dataModalUpdate } = props;
    const [totalPrice, setTotalPrice] = useState(0);
    const defaultReceiptData = {
        code: '',
        supplierId: '',
        note: '',
        // totalPrice: 0,
        createWarehouseImportDetailDto: [{
            productId: '',
            quantity: '',
            price: ''
        }]
    }
    const validInputDefault = {
        code: true,
        supplierId: true,
        createWarehouseImportDetailDto: [{
            productId: true,
            quantity: true,
            price: true
        }]
    }

    const [receiptData, setReceiptData] = useState(defaultReceiptData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    const [supplierData, setSupplierData] = useState([]);
    const [productData, setProductData] = useState([]);
    useEffect(() => {
        fetchSuppliers();
        fetchAllProduct();
        calculateTotalPrice();
    }, [receiptData.createWarehouseImportDetailDto])
    useEffect(() => {
        if (action === 'UPDATE' && dataModalUpdate && dataModalUpdate.detailImport) {
            setReceiptData({
                ...dataModalUpdate,
                supplierId: dataModalUpdate.supplierId,
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
            setReceiptData(defaultReceiptData);
        }
    }, [action])

    const fetchSuppliers = async () => {
        let response = await getAllSuppliers();
        if (response && response.data) {
            setSupplierData(response.data.data)
        }
    }
    const fetchAllProduct = async () => {
        // let res = await getAllProduct();
        let response = await getAllProduct();
        if (response && response.data) {
            setProductData(response.data.data)
        }
    }

    //check 
    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInputs(validInputDefault);
        let arr = ['code', 'supplierId'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!receiptData[arr[i]]) {
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
        setReceiptData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Hàm xử lý khi thay đổi giá trị của chi tiết nhập kho
    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        if (!isNaN(value) && Number(value) >= 0) {

            setReceiptData(prevData => ({
                ...prevData,
                createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto.map((detail, i) =>
                    i === index ? { ...detail, [name]: value } : detail
                )
            }));
        }
        calculateTotalPrice();
    };
    const hadleConfirmReceipt = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewWarehouseReceipt({ ...receiptData }) : await updateWarehouseReceipt({ ...receiptData });
            // await createNewWarehouseReceipt({ ...receiptData })
            if (response) {
                props.onHide();
                setReceiptData({ ...defaultReceiptData });
                toast.success(action, "successful")
            } else {
                toast.error("Co loi trong khi tao");
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalReceipt = () => {
        props.onHide();
        setReceiptData((prevData) => ({
            ...defaultReceiptData,
            // createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto || []
        }));
        setValidInputs(validInputDefault);
    }

    // Hàm xử lý khi thêm chi tiết nhập kho
    const addDetail = () => {
        setReceiptData(prevData => ({
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
        setReceiptData(prevData => ({
            ...prevData,
            createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto.filter((detail, i) => i !== index)
        }));
    }
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        receiptData.createWarehouseImportDetailDto.forEach((detail) => {
            totalPrice += detail.quantity * detail.price;
        });
        setTotalPrice(totalPrice.toFixed(2));
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalReceipt()} >

                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Tạo mới hóa đơn nhập kho' : 'Chỉnh sửa hóa đơn nhập kho'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mã hóa đơn(<span className='red'>*</span>) :</label>
                            <input disabled={action === 'CREATE' ? false : true}
                                className={validInputs.code ? 'form-control' : 'form-control is-invalid'} type="text"
                                name="code" value={receiptData.code} onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Nhà cung cấp (<span className='red'>*</span>) :</label>


                            <select disabled={action === 'CREATE' ? false : true} className={validInputs.supplierId ? 'form-select' : 'form-select is-invalid'}
                                name="supplierId" onChange={handleChangeform}
                                value={receiptData.supplierId}

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
                                className={'form-control'} type="text" value={receiptData.note}
                                name="note" onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group '  >
                            <label><h6>Danh sách sản phẩm :</h6></label>
                        </div>
                        {receiptData.createWarehouseImportDetailDto && receiptData.createWarehouseImportDetailDto.map((detail, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <div className='col-4 col-sm-5 form-group' >
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
                                    <div className='col-4 col-sm-3 form-group' >
                                        <label>Giá nhập(<span className='red'>*</span>) :</label>
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
                        <div className='d-flex'>
                            <div className='col-12 col-sm-6 form-group  '>
                                <button className="btn btn-primary  form-group ml-3" onClick={() => addDetail()}
                                >
                                    <i className='fa fa-plus-circle'></i> Add
                                </button>
                            </div>
                            <div className='col-12 col-sm-6 form-group' >
                                <label>Tổng giá: {totalPrice} vnd</label>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalReceipt()}>Close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmReceipt()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalReceipt;