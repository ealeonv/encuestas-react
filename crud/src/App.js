import React from "react";
import axios from 'axios';
import "./App.css";
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

class App extends React.Component {
  state = {
    data: [],
    modalActualizar: false,
    modalInsertar: false,
    form: {
      id: "",
      titulo: "",
      descripcion: "",
    },
  };

  componentDidMount() {
    axios.get(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuestas`)
      .then(res => {
        const data = res.data.body;
        this.setState({ data });
        let idOrdenadas = data.map(o => o.id);
        idOrdenadas.sort()
        let form = { id: idOrdenadas[idOrdenadas.length - 1] + 1, description: '', titulo: '' }
        this.setState({ form: form })
      })
  }

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      modalActualizar: true,
    });
  };

  cerrarModalActualizar = () => {
    this.setState({ modalActualizar: false });
  };

  mostrarModalInsertar = () => {
    this.setState({
      modalInsertar: true,
    });
  };

  cerrarModalInsertar = () => {
    this.setState({ modalInsertar: false });
  };

  editar = (dato) => {
    let contador = 0;
    let arreglo = this.state.data;
    arreglo.map((registro) => {
      if (dato.id === registro.id) {
        arreglo[contador].titulo = dato.titulo;
        arreglo[contador].descripcion = dato.descripcion;
      }
      contador++;
    });
    axios.put(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuesta`, this.state.form)
    .then(() => {
      this.setState({ modalActualizar: false });
      this.componentDidMount();
    })
  };

  eliminar = (dato) => {
    let opcion = window.confirm("Estás Seguro que deseas Eliminar el elemento "+dato.id);
    if (opcion) {
      axios.delete(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuesta`, {data: {"id": dato.id}})
      .then(() => {
        this.setState({ modalActualizar: false });
        this.componentDidMount();
      })
    }
  };

  insertar= ()=>{
    axios.post(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuesta`, this.state.form)
    .then(() => {
      this.setState({ modalInsertar: false });
      this.componentDidMount();
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
        <Container>
        <br />
          <Button color="success" onClick={()=>this.mostrarModalInsertar()}>Crear</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>titulo</th>
                <th>descripcion</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {this.state.data.map((dato) => (
                <tr key={dato.id}>
                  <td>{dato.id}</td>
                  <td>{dato.titulo}</td>
                  <td>{dato.descripcion}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => this.mostrarModalActualizar(dato)}
                    >
                      Editar
                    </Button>{" "}
                    <Button color="danger" onClick={()=> this.eliminar(dato)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

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
export default App;
