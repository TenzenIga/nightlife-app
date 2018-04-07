import React from 'react';
import ListItem from './ListItem';
import {ListGroup } from 'react-bootstrap';

function List(props){
 const places = props.places;
 const listItems = places.map((place)=>
      <ListItem isAuthenticated={props.isAuthenticated} onSuccess={props.onSuccess} onFailed={props.onFailed} key ={place.id} address={place.address} rating={place.rating} name={place.name} image={place.image}/>
);
return(
  <ListGroup className='list'>
    {listItems}
  </ListGroup>
);
}

export default List;
