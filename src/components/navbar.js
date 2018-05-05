import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import TwitterLogin from 'react-twitter-auth/lib/react-twitter-auth-component.js';
import Info from './info';

const Navigation =(props)=>(
  <div><Navbar  collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">NightLife App </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={1} href="#" onClick={props.handleShow}>
          Справка
        </NavItem>

        {props.isAuthenticated ?(<NavItem eventKey={2} onClick={props.logOut} >Выйти </NavItem>)
                       :
                       (
<TwitterLogin  loginUrl="/api/v1/auth/twitter"
                                       onFailure={props.onFailed} onSuccess={props.onSuccess}
                                       requestTokenUrl="/api/v1/auth/twitter/reverse"
                                       className='login'
                                        > Авторизация</TwitterLogin>
)}

      </Nav>
    </Navbar.Collapse>
  </Navbar>
 <Info
 show={props.showInfo}
 handleClose={props.handleClose}
 />
  </div>

)

export default Navigation;
