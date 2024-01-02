import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewProduct, updateProduct, getAllCategory } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalProduct = (props) => {
    const { action, dataModalUpdate } = props;
    const defaultProductData = {
        name: '',
        quantity: '',
        description: '',
        categoryId: '',
    }
    const validInputDefault = {
        name: true,
        categoryId: true,
    }


    const [productData, setProductData] = useState(defaultProductData);
    const [validInputs, setValidInputs] = useState(validInputDefault);
    const [categoryData, setCategoryData] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, [])
    useEffect(() => {
        if (action === 'UPDATE') {
            console.log("update", dataModalUpdate)
            setProductData({ ...dataModalUpdate, categoryId: dataModalUpdate.category ? dataModalUpdate.category.id : '' });

        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {

            setProductData({ ...productData })

            // setProductData({ ...productData })
        }


    }, [action])
    const fetchCategories = async () => {
        let response = await getAllCategory();
        if (response && response.data) {
            setCategoryData(response.data)
            // setProductData(...productData, categoryId[0].id)
        }
    }
    const handleOnchangeInput = (value, name) => {
        let _Data = _.cloneDeep(productData)
        _Data[name] = value;
        setProductData(_Data);

    }
    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInputs(validInputDefault);
        let arr = ['name', 'categoryId'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!productData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs)
                toast.error(`Empty input ${arr[i]} `);
                check = false;
                break;
            }
        }
        return check;
        // setValidInputs(validInputDefault);
        // if (!productData.email) {
        //     toast.error("Email is required!");
        //     setValidInputs({ ...validInputDefault, email: false });
        //     return false
        // }
        // let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!reg.test(productData.email)) {
        //     setValidInputs({ ...validInputDefault, email: false });
        //     toast.error("email khong hop le");
        //     return false
        // }
        // let checkPasswordWhitespace = /\s/;

        // if (!productData.phone || checkPasswordWhitespace.test(productData.phone)) {
        //     toast.error("err ");
        //     setValidInputs({ ...validInputDefault, phone: false });
        //     return false
        // }
        // if (!productData.address || checkPasswordWhitespace.test(productData.address)) {
        //     toast.error("err ");
        //     setValidInputs({ ...validInputDefault, address: false });
        //     return false
        // }

        // return true
    }

    const hadleConfirmSupplier = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewProduct({ ...productData }) : await updateProduct({ ...productData });

            //await createNewProduct({ ...productData })
            if (response.data) {
                props.onHide();
                setProductData({ ...defaultProductData });
                toast.success(action, "successful")
            } else {
                toast.error(response.message);
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response.data.content] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalSupplier = () => {
        props.onHide();
        setProductData(defaultProductData)
        setValidInputs(validInputDefault);

    }

    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalSupplier()} >

                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Tạo mới sản phẩm' : 'Chỉnh sửa sản phẩm'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Tên thuốc (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.name ? 'form-control' : 'form-control is-invalid'} type="text"
                                value={productData.name} onChange={(event) => handleOnchangeInput(event.target.value, "name")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group d-none' >
                            <label>Số lượng(<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.quantity ? 'form-control' : 'form-control is-invalid'} type="text" value={productData.quantity = 0}
                                onChange={(event) => handleOnchangeInput(event.target.value, "quantity")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Loại thuốc (<span className='red'>*</span>) :</label>
                            <select className={validInputs.categoryId ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnchangeInput(event.target.value, "categoryId")}
                                value={productData.categoryId}
                            >
                                <option selected>Chọn</option>
                                {categoryData.length > 0 &&
                                    categoryData.map((item, index) => {
                                        return (

                                            <option key={`group-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mô tả (<span className='red'>*</span>) :</label>
                            <input
                                className={'form-control'} type="text" value={productData.description}
                                onChange={(event) => handleOnchangeInput(event.target.value, "description")}
                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalSupplier()}>close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmSupplier()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalProduct;