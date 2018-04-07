import React, {Component} from 'react';
import {Form,FormGroup, FormControl,InputGroup, Button} from 'react-bootstrap';

class Input extends Component{
  constructor(props){
    super();
    this.state ={
      value:''
    };
 }

 handleChange=(event)=>{
  this.setState({value: event.target.value});
}

 handleSubmit = (event)=>{
   this.props.searchPlaces(this.state.value);
   event.preventDefault();
 }

  render(){
    return(
        <Form className='search' onSubmit={this.handleSubmit}><FormGroup >
          <InputGroup>
        <FormControl
          type="text"
          placeholder="Введите область"
          value={this.state.value}
          onChange={this.handleChange}
          />
          <InputGroup.Button>
              <Button type='submit'>Искать</Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        </Form>
        )
    }
}
export default Input;
