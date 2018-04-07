/* global gapi */
import React, { Component } from 'react';
import {Panel } from 'react-bootstrap';
import Header from './Heading';
import Input from './Input';
import LocationBtn from './LocationBtn';
import List from './List';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import {Button} from 'react-bootstrap';

const google = window.google;

 class Layout extends Component{
   constructor(props){
     super();
     this.state ={
       isAuthenticated: false,
       address:null,
       data:[],
       posts:[],
       user:null,
       token: ''
     }
  }
getPlaces =(lat, long)=>{
  let map,service

  var pyrmont = new google.maps.LatLng(lat,long);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
      });

    var request = {
      location: pyrmont,
      radius: '1000',
      types: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, this.callback);
}

callback =(results, status)=>{
 console.log(results)
let data = results.map( key=>{
   return {id:key.id, rating:key.rating, name:key.name, address:key.vicinity, image:typeof key.photos !== 'undefined'
       ? key.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000})
       : ''}

})

 this.setState({
   data:data
 })
}

searchPlaces =(address) =>{
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&language=ru&key=AIzaSyBNsmAqXHlbvZ_zz0SofURkOX1AVJQ6iY0`)
  .then(results =>{
    return results.json();
  }).then(data =>{
    let latitude= data.results[0].geometry.location.lat;
    let longitude = data.results[0].geometry.location.lng;
    this.getPlaces(latitude, longitude)
  })
}

getPlacesByLocation = ()=>{
navigator.geolocation.getCurrentPosition((position)=> {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ru&key=AIzaSyBNsmAqXHlbvZ_zz0SofURkOX1AVJQ6iY0`)
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
  const token = response.headers.get('x-auth-token');
  response.json().then(user => {
    console.log(user);
    if (token) {
      console.log(token);
      this.setState({isAuthenticated: true, user: user, token: token});
    }
  });
};

onFailed = (error) => {
  alert(error);
};

render(){
  return(
<div>
<Panel className='app center-block' bsStyle='primary'>
      <Header />
        <Panel.Body>
          <div id='map'>
          </div>
         <Input address={this.state.address} searchPlaces={this.searchPlaces}/>

        <LocationBtn className='LocationBtn' getPlacesByLocation={this.getPlacesByLocation}/>
        {this.state.data&& (<List places = {this.state.data} onSuccess={this.onSuccess} onFailed={this.onFailed} isAuthenticated={this.state.isAuthenticated}/>)}
         </Panel.Body>
      </Panel>
    </div>
      );
   }
 }
export default Layout;
