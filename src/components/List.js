import React from 'react';
import ListItem from './ListItem';
import {ListGroup } from 'react-bootstrap';

function List(props){
 const places = props.places;
 const listItems = places.map((place, index)=>
 <ListItem
      token={props.token}
      isAuthenticated={props.isAuthenticated}
      user={props.user}
      onSuccess={props.onSuccess}
      onFailed={props.onFailed}
      key ={place.id}
      placeid={place.id}
      address={place.address}
      rating={place.rating}
      name={place.name}
      index={index}
      image={place.image}
      people={place.people}
      vote={props.vote}
      isVoted = {place.voted}
      />
);
return(
  <ListGroup className='list'>
    {listItems}
  </ListGroup>
);
}

export default List;
