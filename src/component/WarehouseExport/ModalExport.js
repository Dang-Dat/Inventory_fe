import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { createNewWarehouseExport, updateWarehouseExport, getAllCustomer, getAllProduct } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalExport = (props) => {
    const { action, dataModalUpdate } = props;
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
        calculateTotalPrice();
    }, [exportData.createWarehouseExportDetailDtos])

    useEffect(() => {
        if (action === 'UPDATE' && dataModalUpdate && dataModalUpdate.detailExport) {
            setExportData({
                ...dataModalUpdate,
                customerId: dataModalUpdate.customer,
                // customer: dataModalUpdate.customer{
                //     address: customer.address,
                //     email: customer.email,
                //     fullName: customer.fullName,
                //     id: customer.id,
                //     note: customer.note,
                //     phone: customer.phone,
                // },
                createWarehouseExportDetailDtos: dataModalUpdate.detailExport.map(detailExport => ({
                    productId: detailExport.id, // Cần cập nhật với giá trị thích hợp từ dữ liệu sản phẩm
                    quantity: detailExport.quantity,
                    price: detailExport.price
                }))
            });


        }

    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {
            setExportData({ ...exportData });
        }
    }, [action])

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
                createWarehouseExportDetailDtos: prevData.createWarehouseExportDetailDtos.map((detailExport, i) =>
                    i === index ? { ...detailExport, [name]: value } : detailExport
                )
            }));
        }
        calculateTotalPrice();
    };
    const hadleConfirmExport = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewWarehouseExport({ ...exportData }) : await updateWarehouseExport({ ...exportData });
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
            // createWarehouseExportDetailDtos: prevData.createWarehouseExportDetailDtos || []
        }));
        setValidInputs(validInputDefault);
    }
    // Hàm xử lý khi thêm chi tiết nhập kho
    const addDetail = () => {
        setExportData(prevData => ({
            ...prevData,
            createWarehouseExportDetailDtos: [
                ...prevData.createWarehouseExportDetailDtos,
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
            createWarehouseExportDetailDtos: prevData.createWarehouseExportDetailDtos.filter((detailExport, i) => i !== index)
        }));
    }
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        exportData.createWarehouseExportDetailDtos.forEach((detailExport) => {
            totalPrice += detailExport.quantity * detailExport.price;
        });
        setTotalPrice(totalPrice.toFixed(2));
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
                                value={exportData.customerId.id}
                                defaultValue={'DEFAULT'}
                            >
                                <option value="DEFAULT"  >Chọn</option>
                                {customerData.length > 0 &&
                                    customerData.map((item, index) => {
                                        return (
                                            <option key={`customerData-${index}`} value={item.id}>{item.fullName}</option>
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
                        {exportData.createWarehouseExportDetailDtos && exportData.createWarehouseExportDetailDtos.map((detailExport, index) => (
                            <div key={index}>
                                <div className='d-flex'>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Tên thuốc(<span className='red'>*</span>) :</label>
                                        <select className={'form-select'} id={`productId${index}`}
                                            name="productId" value={detailExport.productId}
                                            onChange={(e) => handleDetailChange(index, e)}
                                            defaultValue={'DEFAULT'}
                                        >
                                            <option value="DEFAULT" >Chọn</option>
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
                                            id={`quantity${index}`} name="quantity" value={detailExport.quantity} onChange={(e) => handleDetailChange(index, e)} min={0}
                                        />
                                    </div>
                                    <div className='col-4 col-sm-4 form-group' >
                                        <label>Giá bán(<span className='red'>*</span>) :</label>
                                        <input
                                            className={'form-control'} type="number"
                                            id={`price${index}`} name="price" value={detailExport.price} onChange={(e) => handleDetailChange(index, e)} min={0}
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
                                <label>Tổng giá: {totalPrice}</label>
                            </div>
                        </div>
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