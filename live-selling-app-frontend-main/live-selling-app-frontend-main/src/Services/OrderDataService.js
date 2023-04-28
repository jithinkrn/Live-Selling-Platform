import axios from "axios";

const ORDER_API_BASE_URL = "http://localhost:8080/api/orders";

class OrderDataService {

    getChannelOrdersPendingByUserId(id) {
        return axios.get(ORDER_API_BASE_URL + "/channelordersuserpending/" + id);
    }

    getChannelOrdersHistory(id) {
        return axios.get(ORDER_API_BASE_URL + "/channelordersuserhistory/" + id);
    }

    getProductsInOrder(id) {
        return axios.get(ORDER_API_BASE_URL + "/products/" + id);
    }

    getOrderById(id) {
        return axios.get(ORDER_API_BASE_URL + "/getorder/" + id);
    }

    updateOrderStatus(orderid, status) {
        return axios.put(ORDER_API_BASE_URL + "/updateorderstatus/" + orderid + "/" + status);
    }

    searchOrder(search, id){
        return axios.post(ORDER_API_BASE_URL + "/searchorder/" + id, search);
    }
}

export default new OrderDataService();