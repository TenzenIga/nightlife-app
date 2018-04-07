import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
import { Route, Link, Switch, Redirect} from 'react-router-dom';
class GoingBtn extends Component{
  constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this)
      this.state = {
        user:null,
        token: '',
        isAuthenticated:this.props.isAuthenticated,
        going:0
      }
    }
    handleClick() {

      let {going} = this.state
      going++;
      this.setState({

        going:going
      })

}


render(){
  let content = !!this.props.isAuthenticated ?
    (
      <div>
          <button onClick={this.handleClick} className="button" >
          Going-{this.state.going}</button>
        </div>

    ) :
    (
      <TwitterLogin loginUrl="http://localhost:4000/api/v1/auth/twitter"
                    onFailure={this.props.onFailed} onSuccess={this.props.onSuccess}
                    requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"
                    showIcon={true} >
Going - {this.state.going}
                    </TwitterLogin>

    );
 return(
   <div>{content}</div>
      )
    }
  }
export default GoingBtn;
