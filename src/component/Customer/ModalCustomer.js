import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewCustomer, updateCustomer } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalCustomer = (props) => {
    const { action, dataModalUpdate } = props;

    const defaultCustomerData = {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        note: '',

    }
    const validInputDefault = {
        fullName: true,
        email: true,
        phone: true,
        address: true,

    }


    const [customerData, setCustomerData] = useState(defaultCustomerData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    useEffect(() => {

    }, [])
    useEffect(() => {
        if (action === 'UPDATE') {
            console.log("update", dataModalUpdate)
            setCustomerData({ ...dataModalUpdate });
        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {

            setCustomerData({ ...customerData })

        }


    }, [action])

    const handleOnchangeInput = (value, name) => {
        let _Data = _.cloneDeep(customerData)
        _Data[name] = value;
        setCustomerData(_Data);

    }
    const checkValidateInputs = () => {
        // if (action === 'UPDATE') return true;
        // setValidInputs(validInputDefault);
        // let arr = ['fullName', 'email', 'phone', 'address'];
        // let check = true;
        // for (let i = 0; i < arr.length; i++) {
        //     if (!customerData[arr[i]]) {
        //         let _validInputs = _.cloneDeep(validInputDefault);
        //         _validInputs[arr[i]] = false;
        //         setValidInputs(_validInputs)
        //         toast.error(`Empty input ${arr[i]}`);
        //         check = false;
        //         break;
        //     }
        // }
        // return check;
        setValidInputs(validInputDefault);
        let checkPasswordWhitespace = /\s/;
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!customerData.fullName) {
            toast.error("err ");
            setValidInputs({ ...validInputDefault, fullName: false });
            return false
        }
        if (!customerData.email) {
            toast.error("Email is required!");
            setValidInputs({ ...validInputDefault, email: false });
            return false
        }

        if (!reg.test(customerData.email)) {
            setValidInputs({ ...validInputDefault, email: false });
            toast.error("email khong hop le");
            return false
        }

        if (!customerData.phone || checkPasswordWhitespace.test(customerData.phone)) {
            toast.error("err ");
            setValidInputs({ ...validInputDefault, phone: false });
            return false
        }
        return true
    }

    const hadleConfirmCustomer = async () => {
        let check = checkValidateInputs();
        if (check === true) {
            let response = action === 'CREATE' ?
                await createNewCustomer({ ...customerData }) : await updateCustomer({ ...customerData });
            //await updateCustomer({ ...customerData });
            if (response.data) {
                props.onHide();
                setCustomerData({ ...defaultCustomerData });
                toast.success(action, "successful")
            } else {
                toast.error("error");
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response.data.content] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalCustomer = () => {
        props.onHide();
        setCustomerData(defaultCustomerData)
        setValidInputs(validInputDefault);
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal-user'>
                <Modal.Header closeButton onHide={() => handleCloseModalCustomer()} >
                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Tạo mới khách hàng' : 'Chỉnh sửa thông tin khách hàng'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Tên khách hàng (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.fullName ? 'form-control' : 'form-control is-invalid'} type="text"
                                value={customerData.fullName} onChange={(event) => handleOnchangeInput(event.target.value, "fullName")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Email (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'} type="text" value={customerData.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Phone number (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'} type="text" value={customerData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group' >
                            <label>Địa chỉ :</label>
                            <input className='form-control' type="text" value={customerData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group' >
                            <label>Ghi chú :</label>
                            <input className='form-control' type="text" value={customerData.note}
                                onChange={(event) => handleOnchangeInput(event.target.value, "note")}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalCustomer()}>close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmCustomer()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default ModalCustomer;