import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    host: "",
    user: "",
    password: "",
    database: "",
  });
  const [response, setResponse] = useState("");
  const [tables, setTables] = useState({});
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState("");



  const showTables = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:8000/show_tables/", {
        params: {
          host: formData.host,
          user: formData.user,
          password: formData.password,
          database: selectedDatabase,
        },
      })
       setTables(response.data);
       console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:8000/test_connection/", formData)
      .then((res) => {
        setResponse(res.data);
        alert(res.data);
        setDatabases(res.data.databases);

      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSelectChange = (event) => {
    setSelectedDatabase(event.target.value);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <h1>Test de connexion à la base de données</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Host:
          <input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Utilisateur:
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Mot de passe:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Base de données:
          <input
            type="text"
            name="database"
            value={formData.database}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="submit">Tester la connexion</button>


      </form>
     
       <button onClick={showTables}>Afficher les tables</button>
      { 
       Object.keys(tables).map((tableName) => (
        <div key={tableName}>
          <h3>{tableName}</h3>
          <ul>
            {tables[tableName].map((fieldName) => (
              <li key={fieldName}>{fieldName}</li>
            ))}
          </ul>
        </div>
       ))
      }
    </div>
  );
}


export default App;
