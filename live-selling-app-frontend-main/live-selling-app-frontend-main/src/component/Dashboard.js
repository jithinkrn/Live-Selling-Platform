import React, { Component } from "react";
import DashboardDataService from '../Services/DashboardDataService';
import { Rating } from 'react-simple-star-rating'
import dateFormat from 'dateformat';
import '../Dash.css';
import { withRouter } from './withRouter';
import NavBar from "./NavBar";


class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleStreamingTimeChange = this.handleStreamingTimeChange.bind(this);
        this.retrieveCharts = this.retrieveCharts.bind(this);
        this.retrievePopularity = this.retrievePopularity.bind(this);
        this.setSuggestion = this.setSuggestion.bind(this);
        this.getPendingOrderCount = this.getPendingOrderCount.bind(this);
        this.predict = this.predict.bind(this);

        this.state = {
            currentUser: {
                id: "",
                firstName: "",
                lastName: ""
            },
            popularityData: [],
            predictionData: [
                { order: "" },
                { viewer: "" }
            ],
            avgUserLikes: "0",
            avgStreamerLikes: "0",
            rating: "",
            productCategory: "",
            day: "",
            streamingTime: "",
            orderStatisticsMovAvg: "",
            orderStatisticsTime: "",
            polarityChart: "",
            popsuggestion: "",
            streams: [],
            pendingStreamCount: "",
            pendingOrderCount: ""
        }
    }
    componentDidMount() {
      
        if (sessionStorage.getItem('user') === null) {
            this.props.navigate('/home');
        } 
        else {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user.isVerified === false) {
                this.props.navigate('/home');
            }
            else {
            this.setState({
                productCategory: "Clothing",
                day: "SUN",
                streamingTime: "12am-6am",
                orderStatisticsMovAvg: "",
                orderStatisticsTime: "",
                pendingOrderCount: "",
                currentUser: {
                    ...this.state.currentUser,
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },

            }, () => {
                this.retrieveRating();
                this.predict();
                this.retrievePopularity();
                this.retrieveCharts();
                this.getUpcomingStreams();
                this.getPendingOrderCount();

            });
            }
        }
    }
    getPendingOrderCount() {
        document.body.style.zoom = "100%";
        DashboardDataService.getPendingOrderCount(this.state.currentUser.id)
            .then(response => {
                this.setState({
                    pendingOrderCount: response.data
                });
                console.log(this.state.pendingOrderCount);
            }).catch(e => {
                console.log(e);
            });

    }
    getUpcomingStreams() {
        DashboardDataService.getThreeUserStreamsPending(this.state.currentUser.id).then(response => {
            this.setState({
                streams: response.data
            });
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
        DashboardDataService.getAllPendingStreamCount(this.state.currentUser.id).then(response => {
            this.setState({
                pendingStreamCount: response.data
            });
            console.log(response.data);
        }).catch(e => {
            console.log(e);
        });
    }
    setSuggestion() {
        let userLikes = parseInt(this.state.avgUserLikes)
        let streamerLikes = parseInt(this.state.avgStreamerLikes)
        console.log(userLikes)
        console.log(streamerLikes)
        if (userLikes === 0) {

            this.setState({
                popsuggestion: "You haven't received any reactions yet. " +
                    "Good luck on your next stream!"
            });
        }
        else if (userLikes < streamerLikes && userLikes !== 0) {

            this.setState({
                popsuggestion: "You are getting less Hearts than other streamers. " +
                    "Try to improve. Good luck!"
            });
        }
        else if (userLikes === streamerLikes && userLikes !== 0) {
            this.setState({
                popsuggestion: "You are getting same number of Hearts as other streamers. " +
                    "Good job!. Check if you can improve further"
            });
        }
        else if (userLikes > streamerLikes) {

            this.setState({
                popsuggestion: "You are getting more Hearts than Other Streamers " +
                    "Good job!. Check if you can improve even further"
            });
        }
    }
    retrievePopularity() {
        DashboardDataService.getUserAverageLikes(this.state.currentUser.id)
            .then(response => {
                this.setState({
                    avgUserLikes: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });

        DashboardDataService.getAverageStreamLikes()
            .then(response => {
                this.setState({
                    avgStreamerLikes: response.data
                }, () => {
                    this.setSuggestion();
                }
                );
                console.log(response.data);

            }).catch(e => {
                console.log(e);
            });



    }
    // popularity Chart
    getPopularityChart() {
        var userId = this.state.currentUser.id
        var popChart = DashboardDataService.getpolarityChart(userId)
        this.setState({ polarityChart: popChart });

    }
    // Order TimeSeries Chart 
    getOrderMovingAverage() {
        var movingAverage = DashboardDataService.getOrderMovingAverage()
        this.setState({ orderStatisticsMovAvg: movingAverage });

    }
    // Number of orders by time chart
    getOrderByTimePeriod() {
        var bytime = DashboardDataService.getOrderByTimePeriod()
        this.setState({ orderStatisticsTime: bytime });

    }
    async retrieveCharts() {
        const delay = ms => new Promise(
            resolve => setTimeout(resolve, ms)
        );

        this.getPopularityChart()
        await delay(1000);
        this.getOrderMovingAverage();
        await delay(1000);
        this.getOrderByTimePeriod();

    }
    showStar() {
        return (
            <div >
                <Rating initialValue={parseInt(this.state.rating)} size='22px' readonly />
            </div>
        )
    }
    retrieveRating() {
        DashboardDataService.getUserAverageRating(this.state.currentUser.id)
            .then(response => {
                this.setState({
                    rating: response.data
                });
                console.log(response.data);
            }).catch(e => {
                console.log(e);
            });
    }
    handleCategoryChange(e) {
        this.setState({ productCategory: e.target.value });
    }
    handleDayChange(e) {
        this.setState({ day: e.target.value });
    }
    handleStreamingTimeChange(e) {
        this.setState({ streamingTime: e.target.value });
    }
    predict() {
        var bodyFormData = new FormData();
        bodyFormData.append('product_category', this.state.productCategory);
        bodyFormData.append('day', this.state.day);
        bodyFormData.append('time_period', this.state.streamingTime);
        DashboardDataService.getPrediction(bodyFormData)
            .then(response => {
                this.setState({
                    predictionData: response.data
                });
            }).catch(e => {
                console.log(e);
            });
    }
    render() {
        return (
            <div className="div-mainbg">
                <NavBar/>           
                           
            <div className="container">
            <div className="div-whitebg">    
                <div className="row" style={{margin: '10px'}}>
                    <div className="col" style={{margin: '5px'}}>
                        <div className="row">
                            <h2>Welcome {this.state.currentUser.firstName}! </h2>
                            <div className={"div-whitebg"}>
                                <h4>My Rating</h4>
                                <h4>{this.state.rating}/5</h4>
                                <div>
                                    {this.showStar()}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className={"div-grayfill"}>
                                <h4>My Popularity</h4>
                                <div className={"div-brown-font"}>
                                    <p >{this.state.popsuggestion}</p>
                                </div>
                                <div>{this.state.polarityChart}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className={"div-lightBoarder"}>
                                <h4>Orders Pending Confirmation</h4>
                                <div className={"div-contentCenter"}>
                                    <div className={"div-Round-pending"}>
                                        <a href={"/mystore#outstanding_orders"}>
                                            {this.state.pendingOrderCount}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                    <div className="col" style={{margin: '5px'}}>
                        <div className="row">
                        <div className={"div-lightBoarder-fixed"}>
                            <h4>My Upcoming Streams</h4>
                            <div className={"div-whitebg"}>
                                <table className="table table-striped table-hover" style={{ tableLayout: 'fixed', borderRadius: '8px', overflow: 'hidden' }}>
                                    <thead className="table-dark">
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.streams.map((item, i) => (
                                            <tr key={i} className={"limited_tbl_row"}>
                                                <td> {dateFormat(item.schedule, "dd-mm-yyyy")}</td>
                                                <td>{dateFormat(item.schedule, "HH:MM")}</td>
                                                <td className={"limited_tbl_row"}>
                                                    {item.title.length < 20 ? item.title : item.title.substring(0, 20) + "..."}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p>{parseInt(this.state.pendingStreamCount) - this.state.streams.length} More.. <a href={"/mystore#scheduled_streams"}>
                                View All</a></p>
                        </div>
                        </div>                               
                        <div className="row">                        
                        <div className={"div-predcition"}>
                            <h4>Viewers and Orders Prediction</h4>
                            <br></br>
                            <div className="container">
                                <div className="row" >
                                    <div className="col" >
                                        <form className="d-flex flex-column">
                                            <label className="p-2">Product Category</label>
                                            <select className="p-2" id="inlineFormCustomSelectPref" name="product_category"
                                                defaultValue={this.state.productCategory} onChange={this.handleCategoryChange} >
                                                <option value="CLOTHING">Clothing</option>
                                                <option value="FOOD">Food</option>
                                                <option value="APPLIANCES">Home Appliances</option>
                                                <option value="FURNITURES">Furnitures</option>
                                                <option value="TECHNOLOGY">Electronics Devices</option>
                                                <option value="BABY">Baby Items and Toys</option>
                                                <option value="HEALTH">Health and Beauty</option>
                                                <option value="SPORTS">Sports Items</option>
                                                <option value="GROCERIES">Groceries</option>
                                                <option value="OTHERS">Others</option>
                                            </select>
                                            <label className="p-2">Day</label>
                                            <select className="p-2" id="inlineFormCustomSelectPref" name="day"
                                                defaultValue={this.state.day} onChange={this.handleDayChange}>
                                                <option value="SUN">Sunday</option>
                                                <option value="MON">Monday</option>
                                                <option value="TUE">Tuesday</option>
                                                <option value="WED">Wednesday</option>
                                                <option value="THU">Thursday</option>
                                                <option value="FRI">Friday</option>
                                                <option value="SAT">Saturday</option>
                                            </select>

                                            <label className="p-2">Streaming Period</label>
                                            <select className="p-2" id="inlineFormCustomSelectPref" name="time_period"
                                                defaultValue={this.state.streamingTime} onChange={this.handleStreamingTimeChange} >
                                                <option value="12am-6am">12am-6am</option>
                                                <option value="6am-12pm">6am-12pm</option>
                                                <option value="12pm-6pm">12pm-6pm</option>
                                                <option value="6pm-12am">6pm-12am</option>
                                            </select>
                                            <br></br>
                                        </form>

                                        <button className="btn btn-dark" onClick={this.predict}>Predict</button>
                                    </div>
                                    <div className="col">
                                        <h5>Expected Orders:</h5>
                                        <div className={"div-contentCenter"}>
                                            <div className={"div-Round"}>{this.state.predictionData[0]["order"]}</div>
                                        </div>
                                        <br></br>
                                        <h5>Expected Viewers:</h5>
                                        <div className={"div-contentCenter"}>
                                            <div className={"div-Round"}>{this.state.predictionData[1]["viewer"]}</div>
                                        </div>
                                    </div>                                      
                                </div>   
                                </div>                                                            
                            </div>
                        </div>
                    </div>
                    <div className="col" style={{margin: '5px'}}>
                        <div className="row">
                        <div className={"div-grayfill-fixed"}>
                            <div>
                                <h4>Platform Sales Statistics</h4>
                            </div>
                            <div>
                            </div>
                            <div>{this.state.orderStatisticsMovAvg}</div>
                            <div className={"div-graygapfill"}></div>
                            <div>{this.state.orderStatisticsTime}</div>
                        </div>
                        </div>
                    </div>                       
                </div>
            </div>
            </div>
        </div>
        );
    }
}
export default withRouter(Dashboard)
