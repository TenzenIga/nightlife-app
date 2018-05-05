import React, {Component} from 'react';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
class GoingBtn extends Component{
  constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this)

    }
    handleClick() {
    this.props.vote(this.props.index, this.props.placeid, this.props.name);
}

render(){
  let content = !!this.props.isAuthenticated ?
    (
    <div>
          {this.props.isVoted?
            (<button onClick={(e)=>this.handleClick(e)} className="voteButtonOff">Отмена</button>)
            :
          (<button onClick={(e)=>this.handleClick(e)} className="voteButtonOn">Пойду</button>)
        }
        </div>
    ) :
    (
      <TwitterLogin loginUrl="/api/v1/auth/twitter"
                    onFailure={this.props.onFailed} onSuccess={this.props.onSuccess}
                    requestTokenUrl="/api/v1/auth/twitter/reverse"
                    showIcon={true}
                    className='voteButtonOn'
                     >Пойду
      </TwitterLogin>

    );
 return(
   <div>{content}</div>
      )
    }
  }
export default GoingBtn;
