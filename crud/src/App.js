import React from "react";
import axios from 'axios';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container
} from "reactstrap";
import FormSurvey from "./components/FormSurvey.js"

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      crear: false,
      showForm: false,
      form: {
        id: "",
        titulo: "",
        descripcion: "",
      },
      next_id: 0
    };
  }

  componentDidMount() {
    axios.get(`https://8wrbo7hv3a.execute-api.us-east-1.amazonaws.com/Encuesta/encuestas`)
      .then(res => {
        const data = res.data.body;
        this.setState({ data });
        let idOrdenadas = data.map(o => o.id);
        idOrdenadas.sort()
        let form = { id: idOrdenadas[idOrdenadas.length - 1] + 1, descripcion: '', titulo: '' }
        this.setState({ form: form, next_id: form.id })
      })
  }

  mostrarModalActualizar = (dato) => {
    this.setState({
      form: dato,
      crear: false,
      showForm: true,
    });
  };

  mostrarModalInsertar = () => {
    this.setState({
      crear: true,
      showForm: true,
    });
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

  mostrarForm = (submit) => {
    this.setState({ showForm: false});
    if(submit){
        this.componentDidMount();
    }
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
                    </Button>
                    <Button color="danger" onClick={()=> this.eliminar(dato)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        {this.state.showForm && <FormSurvey crear={this.state.crear} 
                                            form={this.state.form} 
                                            showForm={this.mostrarForm} 
                                            nextId={this.state.next_id}>
                                              </FormSurvey>}
      </>
    );
  }
}
export default App;
