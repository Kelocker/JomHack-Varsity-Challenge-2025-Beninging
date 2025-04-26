import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [msg, setMsg] = useState('');

  // Place the function to extract data in the page that displays the summary table
  const extract_data = async () => {
    try {
      // Get the table element
      const table = document.querySelector('table');
      const rows = table.querySelectorAll('tbody tr');
      
      // Extract data from table rows
      const extractedData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
          foodName: cells[0].textContent,
          quantity: parseInt(cells[1].textContent),
          measurementUnit: cells[2].textContent,
          expiryDate: cells[3].textContent,
          category: cells[4].textContent
        };
      });
      // Debug purpose
      console.log("Extracted data:", extractedData);
      // Send the extracted data to the backend
      const response = await axios.post('http://localhost:5000/api/extract', { data: extractedData });
      console.log("Response from backend:", response.data);
      alert(`Summary extracted successfully! Check console for details.`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to extract summary');
    }}

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => setMsg(response.data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      {<h1>{msg}</h1>}

      {/* Example table of summary table*/}
      <table>
        <thead>
          <tr>
            <th>Food Name</th>
            <th>Quantity</th>
            <th>Measurement Unit</th>
            <th>Expiry Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {/* Example row, replace with dynamic data */}
          <tr>
            <td>Apple</td>
            <td>10</td>
            <td>-</td>
            <td>2023-12-31</td>
            <td>Fruit</td>
          </tr>
          <tr>
            <td>Sugar</td>
            <td>50</td>
            <td>gram</td>
            <td>2024-01-15</td>
            <td>condiments</td>
          </tr>
          <tr>
            <td>Soy sauce</td>
            <td>500</td>
            <td>ml</td>
            <td>2024-01-15</td>
            <td>condiments</td>
          </tr>
        </tbody>
      </table>
      <button onClick={extract_data}>Extract Summary</button>
    </div>


  );
}

export default App;
