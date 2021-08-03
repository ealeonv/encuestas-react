import React from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";

class FormSurvey extends React.Component {
  state = {
    modalActualizar: false,
    modalInsertar: false,
    form: {
      id: "",
      titulo: "",
      descripcion: "",
    },
  };

  componentDidMount(){
    if(this.props.crear){
      this.setState({
        modalInsertar: true,
        modalActualizar: false,
        form: this.props.form
      });
    }else{
      this.setState({
        modalInsertar: false,
        modalActualizar: true,
        form: this.props.form
      });
    }
  }

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
    this.props.showForm(false);
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
    this.props.showForm(false);
  };

  editar = () => {
    axios.put(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuesta`, this.state.form)
    .then(() => {
      this.setState({ modalActualizar: false });
      this.props.showForm(true);
    })
  };

  insertar= ()=>{
    axios.post(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuesta`, this.state.form)
    .then(() => {
      this.setState({ modalInsertar: false });
      this.props.showForm(true);
    })
  }

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  render() {
    return (
      <>
        <Modal isOpen={this.state.modalActualizar}>
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
               Id:
              </label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.id}
              />
            </FormGroup>

            <FormGroup>
              <label>
                titulo:
              </label>
              <input
                className="form-control"
                name="titulo"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.titulo}
              />
            </FormGroup>

            <FormGroup>
              <label>
                descripcion:
              </label>
              <input
                className="form-control"
                name="descripcion"
                type="text"
                onChange={this.handleChange}
                value={this.state.form.descripcion}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              color="danger"
              onClick={() => this.cerrarModalActualizar()}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={() => this.editar(this.state.form)}
            >
              Editar
            </Button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
           <div><h3>Crear nueva encuesta</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                Id:
              </label>

              <input
                className="form-control"
                readOnly
                type="text"
                value={this.state.form.id}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Titulo:
              </label>
              <input
                className="form-control"
                name="titulo"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Descripcion:
              </label>
              <input
                className="form-control"
                name="descripcion"
                type="text"
                onChange={this.handleChange}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              className="btn btn-danger"
              onClick={() => this.cerrarModalInsertar()}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onClick={() => this.insertar()}
            >
              Crear
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default FormSurvey;
