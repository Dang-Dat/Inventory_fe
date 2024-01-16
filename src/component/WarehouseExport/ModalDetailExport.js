import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewWarehouseReceipt, updateSupplier, getAllCustomer, getAllProduct, } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalDetailExport = (props) => {
    const { action, dataModalDetail } = props;
    const [totalPrice, setTotalPrice] = useState(0);
    const defaultExportData = {
        code: '',
        customerId: '',
        note: '',
        createWarehouseExportDetailDtos: [{
            productId: '',
            quantity: '',
            price: ''
        }]
    }
    const validInputDefault = {
        code: true,
        customerId: true,

        createWarehouseExportDetailDtos: [{
            productId: true,
            quantity: true,
            price: true
        }]


    }

    const [exportData, setExportData] = useState(defaultExportData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    const [customerData, setCustomerData] = useState([]);
    const [productData, setProductData] = useState([]);
    useEffect(() => {
        fetchCustomer();
        fetchAllProduct();
    }, [])
    useEffect(() => {
        if (dataModalDetail && dataModalDetail.detailExport) {

            setExportData({
                ...dataModalDetail,
                customerId: dataModalDetail.customerId,
                createWarehouseExportDetailDtos: dataModalDetail.detailExport.map(detail => ({
                    productId: detail.id, // Cần cập nhật với giá trị thích hợp từ dữ liệu sản phẩm
                    quantity: detail.quantity,
                    price: detail.price
                }))
            });
        }
    }, [dataModalDetail])
    useEffect(() => {
        calculateTotalPrice();
    })
    const fetchCustomer = async () => {
        let response = await getAllCustomer();
        if (response && response.data) {
            setCustomerData(response.data.data)
        }
    }
    const fetchAllProduct = async () => {
        let response = await getAllProduct();
        if (response && response.data) {
            setProductData(response.data.data)

        }
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
        setExportData(prevData => ({
            ...prevData,
            createWarehouseExportDetailDtos: prevData.createWarehouseExportDetailDtos.map((detail, i) =>
                i === index ? { ...detail, [name]: value } : detail
            )
        }));
    };
    const handleCloseModalReceipt = () => {
        props.onHide();
        setExportData(defaultExportData)
        setValidInputs(validInputDefault);
    }
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        exportData.createWarehouseExportDetailDtos.forEach((detail) => {
            totalPrice += detail.quantity * detail.price;
        });

        setTotalPrice(totalPrice.toFixed(2));
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalReceipt()} >

                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{'Hóa đơn xuất kho'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mã hóa đơn(<span className='red'>*</span>) :</label>
                            <input disabled={true}
                                className={validInputs.code ? 'form-control' : 'form-control is-invalid'} type="text"
                                name="code" value={exportData.code} onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Khách hàng (<span className='red'>*</span>) :</label>
                            <select disabled={true} className={validInputs.customer ? 'form-select' : 'form-select is-invalid'}
                                name="customerId" onChange={handleChangeform}
                                value={exportData.customerId}
                            >
                                <option selected>Chọn</option>
                                {customerData.length > 0 &&
                                    customerData.map((item, index) => {
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
                                className={'form-control'} type="text" value={exportData.note}
                                name="note" onChange={handleChangeform}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group '  >
                            <label><h6>Danh sách sản phẩm :</h6></label>
                        </div>
                        {exportData.createWarehouseExportDetailDtos.map((detail, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <div className='col-4 col-sm-6 form-group' >
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
                                    <div className='col-4 col-sm-3 form-group' >
                                        <label>Số lượng(<span className='red'>*</span>) :</label>
                                        <input disabled={true}
                                            className={'form-control'} type="number"
                                            id={`quantity${index}`} name="quantity" value={detail.quantity} onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className='col-4 col-sm-3 form-group' >
                                        <label>Giá xuất(<span className='red'>*</span>) :</label>
                                        <input disabled={true}
                                            className={'form-control'} type="number"
                                            id={`price${index}`} name="price" value={detail.price} onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}
                        <div className='d-flex'>
                            <div className='col-12 col-sm-6 form-group' >
                                <label>Tổng giá: {totalPrice} vnd</label>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalReceipt()}>Close</Button>

                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalDetailExport;