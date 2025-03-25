import { useState } from "react";
import "./App.css";
import axios from "axios";
import { useEffect } from "react";

function App() {
  // ใช้ useState เก็บค่าจาก input
  const [inputText,setInputText] = useState("")
  // ใช้ useState เก็บค่าจากการดึงข้อมูล
  const [books,setBooks] = useState([])
  // มีการ re-render ใหม่ทุกครั้งที่ inputText มีการเปลี่ยนแปลง
  useEffect (() => {
    getData()
  },[inputText])

  const getData = async () => {
    // ไม่เรียก API ถ้า inputText ว่าง
    if (!inputText.trim()) return;
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${inputText}`)
        // ใช้ logical OR (||) เพื่อกำหนดค่าเริ่มต้นเป็น [] (array ว่าง) 
        // ในกรณีที่ response.data.items เป็น undefined หรือไม่มีข้อมูล
        setBooks(response.data.items || [])
      } catch (error) {
        console.log("Error fetch books:",error)
      }
    
  }

  return (
  <div className="App">
    <h1>Find a Book:</h1>
    <input 
      type="text" 
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      />
      <ul>
        {books.map((book) => {
          return (
            <li key={book.id}>
              <strong>{book.volumeInfo.title}</strong>
            </li>
          )
        })}
      </ul>
  </div>
  );
}

export default App;
