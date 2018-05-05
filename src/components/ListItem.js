import React, {Component} from 'react';
import {ListGroupItem, Media} from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import GoingBtn from './GoingBtn';

class ListItem extends Component {

  render(){
    let numberOfPeople =  this.props.people.length;
    const {image, name, address, rating, placeid, isAuthenticated, onSuccess, onFailed, index, isVoted} = this.props;
return (<ListGroupItem><Media>
<Media.Left align="middle">
<img width={150} height={150} src={image} alt="thumbnail" responsive="true" />
</Media.Left>
<Media.Body>
<Media.Heading>{name}</Media.Heading>
<p>{address}</p>
<p>Буду сегодня там: {numberOfPeople}</p>
  <StarRatingComponent
          name="rate2"
          editing={false}
          starCount={5}
          value={rating}
        />
      <GoingBtn
        name={name}
        index={index}
      onSuccess={onSuccess}
      onFailed={onFailed}
      vote = {this.props.vote}
      placeid={placeid}
      isAuthenticated={isAuthenticated}
      isVoted={isVoted}
        />
</Media.Body>
</Media></ListGroupItem>)
}
}
export default ListItem;
