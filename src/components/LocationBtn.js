import React, {Component} from 'react';
import {Button} from 'react-bootstrap';

class LocationBtn extends Component{
  handleClick(){
    this.props.getPlacesByLocation()
  }
render(){

return(
  <Button onClick={(e)=>this.handleClick(e)} block bsStyle='warning'>Определить местоположение</Button>
);
}
}
export default LocationBtn;
