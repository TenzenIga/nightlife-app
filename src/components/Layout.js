
import React, { Component } from 'react';
import {Panel} from 'react-bootstrap';
import Header from './Heading';
import Input from './Input';
import Navigation from './navbar';
import Footer from './footer';
import List from './List';
import no_image from'../no_image.png';
import {googleKey} from '../config';
const google = window.google;

 class Layout extends Component{
   constructor(props){
     super();
     this.state ={
       showInfo:false,
       isAuthenticated: false,
       address:null,
       data:[],
       posts:[],
       user:null,
       token: '',
       visitedPlaces:[]
     }
  }
getPlaces =(lat, long)=>{ // get places by latitude and longitude
  let map,service

  var pyrmont = new google.maps.LatLng(lat,long);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });

    var request = {
      location: pyrmont,
      radius: '1000',
      types: ['restaurant']  //we are looking for restaurants
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, this.callback);  //when we get result -we use callback function
}

getSavedPlaces = ()=>{ // get list of places from database
   return fetch('/data')
       .then(results=>{
         return results.json();
       }).then(data=>{
         let visitedPlaces = data;
         return visitedPlaces;
       })

}

callback =(results, status)=>{ //compare serached places with places from database
  console.log(results);
  this.setState({ isLoading: true });
  this.getSavedPlaces().then(response=>{
  /* response ->
   [{name: String,
   id:String,
   votedUsers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
   }]
  */
  const visitedPlaces = response
  const user = this.state.user;
  const placesId = visitedPlaces.map(key=>{ //make separate array of places ids
    return key.id;
  })

let data = results.map( key=>{
  return  {id:key.place_id,
    rating:key.rating,
    name:key.name,
    address:key.vicinity,
    voted:false,
    image:typeof key.photos !== 'undefined'? key.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000}): no_image}  // if placeid alredy in database - get number of people

})
data = data.map(key=>{
  if(placesId.includes(key.id)){ //add votedusers to data object
    if(user && visitedPlaces[placesId.indexOf(key.id)].votedUsers.includes(user._id)){
      key.voted = true;
    }
    key.people = visitedPlaces[placesId.indexOf(key.id)].votedUsers
    return key;
  }
   key.people =[];
   return key;
})
 this.setState({
   data:data,
    isLoading: false
 })
})
}

searchPlaces =(address) =>{
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=ru&key=${googleKey}`)
  .then(results =>{
    return results.json();
  }).then(data =>{
    if(data.status ==="ZERO_RESULTS"){
      alert('Неправильный адрес!');
      return false;
    }
    let latitude= data.results[0].geometry.location.lat;
    let longitude = data.results[0].geometry.location.lng;
    this.getPlaces(latitude, longitude)
  })
}

getPlacesByLocation = ()=>{
    navigator.geolocation.getCurrentPosition((position)=> {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ru&key=${googleKey}`)
    .then(results =>{
       return results.json();
     }).then(data=>{
       let address = data.results[0].formatted_address;
       this.getPlaces(latitude, longitude);
      this.setState({
         address:address
     })
     })

})
}

onSuccess = (response) => {
  let {data} = this.state;


  const token = response.headers.get('x-auth-token');
  response.json().then(user => {
    if (user) {
      if(data){
        data = data.map(key=>{
          if(key.people.includes(user._id)){
            key.voted = true
          }
          return key;
        })
      }

      this.setState(
        {
          isAuthenticated: true,
          user: user,
          token: token,
          data:data
        });
    }
  });
};

logOut =()=>{
  this.setState({
    token:'',
    isAuthenticated: false,
    user:null
  })
}
onFailed = (error) => {
  alert(error);
};

handleClose =()=> { //clsoe info modal
   this.setState({ showInfo: false });
 }

 handleShow =()=> { // show modal info
   this.setState({ showInfo: true });
 }

vote=(key, placeid, name)=>{ //add vote via post request or delete vote
  let {data} = this.state;

  let people = data[key].people || [];
  const {user, token} = this.state;
  let body = {
    name:name,
    id:placeid,
    user:user._id
  }
  if(people.includes(user._id)){ //if user already voted

  this.postRequest(body, 'DELETE', token, data, key)
  }else{
  this.postRequest(body, 'POST', token, data, key)
  }
}

postRequest = (body, type, token, data, key)=>{
  if(type==='POST'){
    data[key].voted = true;
  }else{
    data[key].voted = false;
  }
  fetch('/', {
  method: type,
  headers:new Headers({
    'x-auth-token':token,
    'Content-Type': 'application/json'
  }),
  body:JSON.stringify(body)
  }).then((res) => res.json())
    .then((res) =>{
      console.log(res)
      data[key].people = res.votedUsers
      this.setState({
        data:data
      })
    }).catch((err)=>console.log(err))

  }

render(){
  const {isLoading, data} = this.state;
const content = isLoading?(
<p className='text-center'>Загрузка...</p>
):(
<List places = {data}
  onSuccess={this.onSuccess}
  onFailed={this.onFailed}
  isAuthenticated={this.state.isAuthenticated}
  user={this.state.user}
  token={this.state.token}
  vote={this.vote}
  />
)
  return(
<div>
<Navigation
  onSuccess={this.onSuccess}
  onFailed={this.onFailed}
  isAuthenticated={this.state.isAuthenticated}
  logOut={this.logOut}
  showInfo={this.state.showInfo}
  handleShow={this.handleShow}
  handleClose={this.handleClose}
/>
<Panel className='app center-block' bsStyle="primary">
      <Header />
        <Panel.Body>
          <div id='map'>
          </div>
         <Input address={this.state.address} searchPlaces={this.searchPlaces} getPlacesByLocation={this.getPlacesByLocation}/>
        {content}
         </Panel.Body>
      </Panel>
      <Footer/>
    </div>
      );
   }
 }
export default Layout;
