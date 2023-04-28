import axios from "axios";
const RATING_API_BASE_URL = "http://127.0.0.1:8080/api/rating/userrating/";
const PREDICTION_API_BASE_URL = "http://127.0.0.1:5000/result";
const USER_LIKES_API_BASE_URL = "http://127.0.0.1:8080/api/likes/userlikes/";
const AVG_LIKE_API_BASE_URL = "http://127.0.0.1:8080/api/likes/avgstreamlikes/";
const CHART_API_BASE_URL = "http://127.0.0.1:5000/"
const STREAM_API_BASE_URL = "http://127.0.0.1:8080/api/user/"
const ORDER_API_BASE_URL = "http://127.0.0.1:8080/api/orders/"


class DashboardDataService {  
    getUserAverageRating(userId){
        return axios.get(RATING_API_BASE_URL+userId);      
    }

    async getPrediction(formData){ 

        const response = await axios({
            method: 'post',
            url: PREDICTION_API_BASE_URL,
            data: formData,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
        });        
        return response;
    }
    getUserAverageLikes(userId){
        return axios.get(USER_LIKES_API_BASE_URL+userId);      
    }
    getAverageStreamLikes(){
        return axios.get(AVG_LIKE_API_BASE_URL);      
    }
    getpolarityChart(userId){

        var url =  CHART_API_BASE_URL + "charts?name=popchart&userid="+userId;
        var popChart =   <div>                
                        <img src={url} height = {300} alt=""></img>  
                        </div>;           
        return popChart     
    }
    getOrderMovingAverage(){

        var url =  CHART_API_BASE_URL + "charts?name=movavg";            
        var movingAverage = <div>
                            <img src={url} height = {300} alt=""></img> 
                            </div>;                     
        return movingAverage 
    }
    getOrderByTimePeriod(){

        var url =   CHART_API_BASE_URL + "charts?name=bytime";
        var bytime =    <div>          
                        <img src={url} height = {300} alt=""></img> 
                        </div>;   

        return bytime 
    }
    getThreeUserStreamsPending(userId) {
        return axios.get(STREAM_API_BASE_URL + "upcomingstreams/" + userId)
    }
    getAllPendingStreamCount(userId){
        return axios.get(STREAM_API_BASE_URL + "upcomingstreamcount/" + userId)
    }    
    getPendingOrderCount(userId){
        var data = axios.get(ORDER_API_BASE_URL + "pendingorders/" + userId)
        console.log(data)
        return data
    }
}
export default new DashboardDataService();