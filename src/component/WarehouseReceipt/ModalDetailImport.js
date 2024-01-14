import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewWarehouseReceipt, updateSupplier, getAllSuppliers, getAllProduct, } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalDetailImport = (props) => {
    const { action, dataModalDetail } = props;

    const defaultReceiptData = {
        code: '',
        supplierId: '',
        note: '',
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
    }, [])
    useEffect(() => {
        if ( dataModalDetail && dataModalDetail.detailImport) {
            setReceiptData({
                ...dataModalDetail,
                supplierId: dataModalDetail.supplierId,
                createWarehouseImportDetailDto: dataModalDetail.detailImport.map(detail => ({
                    productId: detail.id, // Cần cập nhật với giá trị thích hợp từ dữ liệu sản phẩm
                    quantity: detail.quantity,
                    price: detail.price
                }))


            });
        }
    }, [dataModalDetail])

    const fetchSuppliers = async () => {
        let response = await getAllSuppliers();
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
        console.log("check", receiptData)
    };


    // Hàm xử lý khi thay đổi giá trị của chi tiết nhập kho
    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        setReceiptData(prevData => ({
            ...prevData,
            createWarehouseImportDetailDto: prevData.createWarehouseImportDetailDto.map((detail, i) =>
                i === index ? { ...detail, [name]: value } : detail
            )
        }));
    };
    const handleCloseModalReceipt = () => {
        props.onHide();
        setReceiptData(defaultReceiptData)
        setValidInputs(validInputDefault);
    }

    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalReceipt()} >

                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{'Hóa đơn nhập kho'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mã hóa đơn(<span className='red'>*</span>) :</label>
                            <input disabled={true}
                                className={validInputs.code ? 'form-control' : 'form-control is-invalid'} type="text"
                                name="code" value={receiptData.code} onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Nhà cung cấp (<span className='red'>*</span>) :</label>
                            <select disabled={true} className={validInputs.supplierId ? 'form-select' : 'form-select is-invalid'}
                                name="supplierId" onChange={handleChangeform}
                                value={receiptData.supplierId}
                            >
                                <option selected>Chọn</option>
                                {supplierData.length > 0 &&
                                    supplierData.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.fullName}</option>
                                        )

                                    })
                                }
                            </select>
                        </div>


                        <div className='col-12 col-sm-12 form-group' >
                            <label>Ghi chú :</label>
                            <input disabled={true}
                                className={'form-control'} type="text" value={receiptData.note}
                                name="note" onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group '  >
                            <label><h6>Danh sách sản phẩm :</h6></label>
                        </div>
                        {receiptData.createWarehouseImportDetailDto.map((detail, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Tên thuốc(<span className='red'>*</span>) :</label>
                                        {/* <input
                                            className={'form-control'} type="text"
                                            id={`productId${index}`} name="productId" value={detail.productId} onChange={(e) => handleDetailChange(index, e)}
                                        /> */}
                                        <select disabled={true} className={'form-select'} id={`productId${index}`}
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
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Số lượng(<span className='red'>*</span>) :</label>
                                        <input disabled={true}
                                            className={'form-control'} type="number"
                                            id={`quantity${index}`} name="quantity" value={detail.quantity} onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Giá nhập(<span className='red'>*</span>) :</label>
                                        <input disabled={true}
                                            className={'form-control'} type="number"
                                            id={`price${index}`} name="price" value={detail.price} onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalReceipt()}>Close</Button>

                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalDetailImport;