import axios from 'axios';
//CATEGORY
const getListCategories = (page, keyWord, size) => {
    return axios.get(`http://localhost:8080/categories?keyword=${keyWord}&pageNumber=${page}&pageSize=${size}`)
}
const createCartegory = (categoryData) => {
    return axios.post('http://localhost:8080/categories', { ...categoryData })
}
const deleteCategory = (categoryData) => {
    return axios.delete(`http://localhost:8080/categories/${categoryData.id}`)
}
const updateCategory = (categoryData) => {
    return axios.put(`http://localhost:8080/categories/${categoryData.id}`, { ...categoryData })
}

// CUSTOMER
const getListCustomers = (keyWord, page, size) => {
    return axios.get(`http://localhost:8080/customers?keyword=${keyWord}&pageNumber=${page}&pageSize=${size}`)
}
const createNewCustomer = (customerData) => {
    return axios.post('http://localhost:8080/customers', { ...customerData })
}
const updateCustomer = (customerData) => {

    return axios.put(`http://localhost:8080/customers/${customerData.id}`, { ...customerData })
}
const deleteCustomer = (customerData) => {
    return axios.delete(`http://localhost:8080/customers/${customerData.id}`)
}
//SUPPLIER
const getListSuppliers = (keyWord, page, size) => {

    return axios.get(`http://localhost:8080/suppliers?keyword=${keyWord}&pageNumber=${page}&pageSize=${size}`)
}
const createNewSupplier = (supplierData) => {
    return axios.post('http://localhost:8080/suppliers', { ...supplierData })
}
const deleteSupplier = (supplierData) => {
    return axios.delete(`http://localhost:8080/suppliers/${supplierData.id}`)
}
const updateSupplier = (supplierData) => {

    return axios.put(`http://localhost:8080/suppliers/${supplierData.id}`, { ...supplierData })
}

//Product
const getListProduct = (keyWord, page, size) => {
    return axios.get(`http://localhost:8080/products?keyword=${keyWord}&pageNumber=${page}&pageSize=${size}`)
}
const getProductByID = (productData) => {
    return axios.get(`http://localhost:8080/products/${productData.id}`)
}
const deleteProduct = (productData) => {
    return axios.delete(`http://localhost:8080/products/${productData.id}`)
}
const createNewProduct = (productData) => {
    return axios.post('http://localhost:8080/products', { ...productData })
}
const updateProduct = (productData) => {

    return axios.put(`http://localhost:8080/products/${productData.id}`, { ...productData })
}
const getAllCategory = () => {
    return axios.get('http://localhost:8080/categories/get-all')
}

//Imprort
const getListWarehouseReceipt = (keyWord, page, size) => {
    return axios.get(`http://localhost:8080/warehouse-import`)
}
const createNewWarehouseReceipt = (receiptData) => {
    return axios.post('http://localhost:8080/warehouse-import', { ...receiptData })
}
const getAllSuppliers = () => {
    return axios.get('http://localhost:8080/suppliers/get-all')
}
const getAllProduct = () => {
    return axios.get('http://localhost:8080/products/get-all')
}
const updateWarehouseReceipt = (receiptData) => {
    return axios.put(`http://localhost:8080/warehouse-import/${receiptData.idWarehouseImport}`, { ...receiptData })
}
const getOneWh = (receiptData) => {
    return axios.get(`http://localhost:8080/warehouse-import/${receiptData.idWarehouseImport}`)
}
const fetchAllUsers = (page, limit) => {
    // return axios.get(``)
}

const deleteUser = () => {

}


const createNewUser = () => {

}

const fetchAllGroup = () => {

}
const updateUser = () => {

}

export {
    getListCategories, deleteCategory, updateCategory, createCartegory,
    getListCustomers, createNewCustomer, updateCustomer, deleteCustomer,
    getListSuppliers, createNewSupplier, updateSupplier, deleteSupplier,
    getListProduct, createNewProduct, updateProduct, getAllCategory, deleteProduct, getProductByID,
    getListWarehouseReceipt, createNewWarehouseReceipt, getAllSuppliers, getAllProduct, updateWarehouseReceipt, getOneWh,
    deleteUser, fetchAllUsers, updateUser, createNewUser,
    fetchAllGroup,
}