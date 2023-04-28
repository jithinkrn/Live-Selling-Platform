import axios from "axios";

const PRODUCT_API_BASE_URL = "http://localhost:8080/api/product";

class ProductService {

    getProductsByUserId(id) {
        return axios.get(PRODUCT_API_BASE_URL + "/channelproducts/" + id);
    }

    addToStore(id, product) {
        return axios.post(PRODUCT_API_BASE_URL + "/addtostore/" + id, product);
    }

    findProductById(id) {
        return axios.get(PRODUCT_API_BASE_URL + "/selectproduct/" + id);
    }

    findByName(name) {
        return axios.get(PRODUCT_API_BASE_URL + "/productname/" + name);
    }

    editProduct(id, product) {
        return axios.put(PRODUCT_API_BASE_URL + "/editproduct/" + id, product);
    }

    deleteProduct(id) {
        return axios.delete(PRODUCT_API_BASE_URL + "/products/" + id);
    }

    getProductsByUserIdSorted(id, order) {
        return axios.get(PRODUCT_API_BASE_URL + "/channelproductssortbyname/" + id + "/" + order);
    }

    getProductsByUserIdCatSorted(id, order) {
        return axios.get(PRODUCT_API_BASE_URL + "/channelproductssortbycat/" + id + "/" + order);
    }

    getProductsByUserIdPriceSorted(id, order) {
        return axios.get(PRODUCT_API_BASE_URL + "/channelproductssortbyprice/" + id + "/" + order);
    }

    getProductsByUserIdQtySorted(id, order) {
        return axios.get(PRODUCT_API_BASE_URL + "/channelproductssortbyqty/" + id + "/" + order);
    }

    searchProduct(search, id) {
        return axios.post(PRODUCT_API_BASE_URL + "/searchproduct/" + id, search);
    }
}

export default new ProductService();