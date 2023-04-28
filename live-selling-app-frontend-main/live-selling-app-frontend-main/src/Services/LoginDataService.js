import axios from "axios";

const LOGIN_API_BASE_URL = "http://localhost:8080/api"

class LoginDataService {
    loginCheck(LoginBag) {
        return axios.post(LOGIN_API_BASE_URL+"/login", LoginBag);
    }

}

export default new LoginDataService();