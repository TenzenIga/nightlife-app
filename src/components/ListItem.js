import React from 'react';
import {ListGroupItem, Media, Button} from 'react-bootstrap';
import StarRatingComponent from 'react-star-rating-component';
import GoingBtn from './GoingBtn';

const ListItem = (props)=>(
<ListGroupItem><Media>
<Media.Left align="middle">
<img width={150} height={150} src={props.image} alt="thumbnail" responsive="true" />
</Media.Left>
<Media.Body>
<Media.Heading>{props.name}</Media.Heading>
<p>{props.address}</p>
  <StarRatingComponent
          name="rate2"
          editing={false}
          starCount={5}
          value={props.rating}
        />
      <GoingBtn isAuthenticated={props.isAuthenticated} onSuccess={props.onSuccess} onFailed={props.onFailed}/>
</Media.Body>
</Media></ListGroupItem>
);

export default ListItem;
