import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

const ModalDeleteWarehouseExport = (props) => {

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn muốn xóa hóa đơn : {props.dataModal.code} ? </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>Close</Button>
                    <Button variant="primary" onClick={props.confirmDeleteExport}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}



export default ModalDeleteWarehouseExport;