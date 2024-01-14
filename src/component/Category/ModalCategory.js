import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createCartegory, updateCategory } from '../../service/dataService'
import { toast } from 'react-toastify';
import _ from "lodash";
//not merge state
const ModalCategory = (props) => {
    const { action, dataModalUpdate } = props;


    const defaultCategoryData = {
        name: '',
        description: '',

    }
    const validInputDefault = {
        name: true,
        description: true,

    }


    const [categoryData, setCategoryData] = useState(defaultCategoryData);
    const [validInputs, setValidInputs] = useState(validInputDefault);

    useEffect(() => {

    }, [])
    useEffect(() => {
        if (action === 'UPDATE') {
            setCategoryData({ ...dataModalUpdate });
        }
    }, [dataModalUpdate])
    useEffect(() => {
        if (action === 'CREATE') {
            setCategoryData({ ...categoryData })
        }
    }, [action])

    const handleOnchangeInput = (value, name) => {
        let _Data = _.cloneDeep(categoryData)
        _Data[name] = value;
        setCategoryData(_Data);
    }
    const checkValidateInputs = () => {
        if (action === 'UPDATE') return true;
        setValidInputs(validInputDefault);
        let arr = ['name', 'description'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!categoryData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs)

                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
    }

    const hadleConfirmCategory = async () => {
        let check = checkValidateInputs();
        if (check === true) {
            let response = action === 'CREATE' ?
                await createCartegory({ ...categoryData }) : await updateCategory({ ...categoryData });

            if (response.data) {
                props.onHide();
                setCategoryData({ ...defaultCategoryData });
                toast.success(action, "successful")
            } else {
                toast.error("error");
                let _validInputs = _.cloneDeep(validInputDefault);
                _validInputs[response.data.content] = false;
                setValidInputs(_validInputs)
            }
        }
    }
    const handleCloseModalCategory = () => {
        props.onHide();
        setCategoryData(defaultCategoryData)
        setValidInputs(validInputDefault);
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal-user'>
                <Modal.Header closeButton onHide={() => handleCloseModalCategory()} >
                    <Modal.Title id="contained-modal-title-vencenter">
                        <span>{props.action === 'CREATE' ? 'Tạo mới loại sản phẩm' : 'Chỉnh sửa thông tin loại sản phẩm'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Loại thuốc (<span className='red'>*</span>) :</label>
                            <input
                                className={validInputs.name ? 'form-control' : 'form-control is-invalid'} type="text"
                                value={categoryData.name} onChange={(event) => handleOnchangeInput(event.target.value, "name")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group' >
                            <label>Mô tả (<span className='red'></span>) :</label>
                            <input
                                className={validInputs.description ? 'form-control' : 'form-control is-invalid'} type="text" value={categoryData.description}
                                onChange={(event) => handleOnchangeInput(event.target.value, "description")}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalCategory()}>close</Button>
                    <Button variant="primary" onClick={() => hadleConfirmCategory()}>
                        {action === 'CREATE' ? 'Create' : 'Update'}
                    </Button>
                </Modal.Footer>


            </Modal >
        </>
    )
}

export default ModalCategory;