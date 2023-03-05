import React, { useState } from 'react';
import axios from 'axios';
import "./App.css";
function App() {
  const [formData, setFormData] = useState({
    user: '',
    host: '',
    password: '',
    database: ''
  });
  const [dbList, setDbList] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedDb, setSelectedDb] = useState('');

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleTestConnection = e => {
  e.preventDefault();
  axios.post('http://localhost:8000/test_connection/', formData)
    .then(res => {
      const db = res.data.databases;
      dbList.push(db)
      setDbList(dbList); // Mettre à jour dbList avec le nom de la base de données
      setSelectedDb(db);

    })
    .catch(err => console.log(err));
};


const handleGetTables = e => {
  e.preventDefault();
  axios.post(`http://localhost:8000/show_tables/`,{ ...formData , selectedDb:selectedDb}
  
  )
    .then(res => {
      setTables(res.data.tables);
      console.log(res.data)
    })
    .catch(err => console.log(err));

};

  return (
    <div className="container">
      <div className='formBox'>
      <form>
      <h1>Database Connection</h1>

        <div className='inputfield'>
        <label>User:</label>
        <input type="text" name="user" class="field" value={formData.user} onChange={handleChange} /><br />
        </div>

        <div className='inputfield'>
        <label>Host:</label>
        <input type="text" name="host" class="field" value={formData.host} onChange={handleChange} /><br />
        </div>

        <div className='inputfield'>
        <label>Password:</label>
        <input type="password" name="password" class="field" value={formData.password} onChange={handleChange} /><br />
        </div>

        <div className='inputfield'>
        <label>Database:</label>
        <input type="text" name="database" class="field" value={formData.database} onChange={handleChange} /><br />
         </div>

        <button class="btn" onClick={handleTestConnection}>Test Connection</button>
      </form>

      <select className='selection-db' value={selectedDb} onChange={e => setSelectedDb(e.target.value)}>
      <option value =" " disabled selected>connected databases </option>
        {dbList.map((db,index) => <option key={index}>{db}</option>)}
      </select>
      <button onClick={handleGetTables} disabled={!selectedDb}>Show Tables</button>
      {tables.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              {Object.keys(tables[0]).map(key => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {tables.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => <td key={j}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}

    
            </div>

    </div>
  );
}

export default App;
