import React from 'react';
import {Modal, Button, Label,Glyphicon} from 'react-bootstrap';

const Info = (props)=>(
  <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Справка</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Night Life App</h4>
            <p>
              NightLife это приложение для поиска кафе, ресторанов и баров в радиусе километра по указанному адресу.
              С помощью авторизации через twitter, вы можете отметить место которое планируете сегодня посетить и увидеть сколько еще людей там будет.
              Кнопка <Label bsStyle="success"><Glyphicon glyph="flag" /></Label> проводит поиск объектов по вашему местоположению( точность вычисления может быть низкая).
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.handleClose}>Закрыть</Button>
          </Modal.Footer>
        </Modal>
);

export default Info;
