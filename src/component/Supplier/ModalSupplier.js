import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createNewSupplier, updateSupplier } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalSupplier = (props) => {
    const { action, dataModalUpdate } = props;

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");

    const defaultSupplierData = {
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
        note: true,
    }


    const [supplierData, setSupplierData] = useState(defaultSupplierData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    useEffect(() => {

    }, [])
    useEffect(() => {
        if (action === 'UPDATE') {
            setSupplierData({ ...dataModalUpdate });
        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {

            setSupplierData({ ...supplierData })

        }


    }, [action])

    const handleOnchangeInput = (value, name) => {
        let _Data = _.cloneDeep(supplierData)
        _Data[name] = value;
        setSupplierData(_Data);
    }
    const checkValidateInputs = () => {
        // if (action === 'UPDATE') return true;
        // setValidInputs(validInputDefault);
        // let arr = ['fullName', 'email', 'phone', 'address'];
        // let check = true;
        // for (let i = 0; i < arr.length; i++) {
        //     if (!supplierData[arr[i]]) {
        //         let _validInputs = _.cloneDeep(validInputDefault);
        //         _validInputs[arr[i]] = false;
        //         setValidInputs(_validInputs)
        //         toast.error(`Empty input ${arr[i]} `);  
        //         check = false;
        //         break;
        //     }
        // }
        // return check;
        setValidInputs(validInputDefault);
        if (!supplierData.email) {
            toast.error("Email is required!");
            setValidInputs({ ...validInputDefault, email: false });
            return false
        }
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!reg.test(supplierData.email)) {
            setValidInputs({ ...validInputDefault, email: false });
            toast.error("email khong hop le");
            return false
        }
        let checkPasswordWhitespace = /\s/;

        if (!supplierData.phone || checkPasswordWhitespace.test(supplierData.phone)) {
            toast.error("err ");
            setValidInputs({ ...validInputDefault, phone: false });
            return false
        }
        if (!supplierData.address || checkPasswordWhitespace.test(supplierData.address)) {
            toast.error("err ");
            setValidInputs({ ...validInputDefault, address: false });
            return false
        }

        return true
    }

    const hadleConfirmSupplier = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let response = action === 'CREATE' ?
                await createNewSupplier({ ...supplierData }) : await updateSupplier({ ...supplierData });

            if (response.data) {
                props.onHide();
                setSupplierData({ ...defaultSupplierData });
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
        setSupplierData(defaultSupplierData)
        setValidInputs(validInputDefault);
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal'>
                <Modal.Header closeButton onHide={() => handleCloseModalSupplier()} >

                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Thêm mới nhà cung cấp' : 'Chỉnh sửa thông tin nhà cung cấp'}</span>
                    </Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Tên nhà cung cấp (<span className='red'>*</span>) :</label>
                            <input disabled={action === 'CREATE' ? false : true}
                                className={validInputs.fullName ? 'form-control' : 'form-control is-invalid'} type="text"
                                value={supplierData.fullName} onChange={(event) => handleOnchangeInput(event.target.value, "fullName")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Email(<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'} type="email" value={supplierData.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Phone(<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'} type="text" value={supplierData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Address (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.address ? 'form-control' : 'form-control is-invalid'} type="text" value={supplierData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Note(<span className='red'></span>) :</label>
                            <input
                                className={validInputs.note ? 'form-control' : 'form-control is-invalid'} type="text" value={supplierData.note}
                                onChange={(event) => handleOnchangeInput(event.target.value, "note")}
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

export default ModalSupplier;