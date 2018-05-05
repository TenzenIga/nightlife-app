import React, {Component} from 'react';
import {Form,FormGroup, FormControl,InputGroup, Button} from 'react-bootstrap';
import LocationBtn from './LocationBtn';
class Input extends Component{
  constructor(props){
    super();
    this.state ={
      value:'',
      valueIsValid:null
    };
 }

 handleChange=(event)=>{
  this.setState({value: event.target.value});

}
getValidationState =()=> {
  const length = this.state.value.length;
  if (length > 5) return {success:'success', buttonStatus: false};
   else if (length > 0) return {succes:'error', buttonStatus: true};
   return {succes:null, buttonStatus: true};
}
 handleSubmit = (event)=>{
   this.props.searchPlaces(this.state.value);
   event.preventDefault();
 }

  render(){
     const validation = this.getValidationState();
    return(
        <Form className='search' onSubmit={this.handleSubmit}><FormGroup   validationState = {validation.success}>
          <InputGroup>
        <FormControl
          type="text"
          placeholder="Введите область"
          value={this.state.value}
          onChange={this.handleChange}

          />
          <InputGroup.Button>
              <Button type='submit' disabled = {validation.buttonStatus}>Искать</Button>
              <LocationBtn className='LocationBtn' onClick = {this.handleClick} getPlacesByLocation={this.props.getPlacesByLocation} />
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        </Form>
        )
    }
}
export default Input;
