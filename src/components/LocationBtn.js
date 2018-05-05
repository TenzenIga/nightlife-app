import React, {Component} from 'react';
import {Button,Glyphicon} from 'react-bootstrap';

class LocationBtn extends Component{
  handleClick(){
    this.props.getPlacesByLocation()
  }
render(){

return(
  <Button onClick={(e)=>this.handleClick(e)} bsStyle='success'><Glyphicon glyph="flag" /></Button>
);
}
}
export default LocationBtn;
