import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState(""); // เก็บค่าที่พิมพ์
  const [books, setBooks] = useState([]); // เก็บผลลัพธ์จาก API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (query === "") {
      setError("⚠️ กรุณากรอกข้อความค้นหา");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items || []);
    } catch (err) {
      setError("❌ ไม่สามารถดึงข้อมูลหนังสือได้");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔍 ค้นหาหนังสือ</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="พิมพ์ชื่อหนังสือ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
        />
        <button onClick={fetchBooks}>ค้นหา</button>
      </div>

      {loading && <p className="loading">⌛ กำลังโหลด...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="book-list">
        {books.map((book) => (
          <li key={book.id} className="book-item">
            <h2>{book.volumeInfo.title}</h2>
            <p>{book.volumeInfo.authors?.join(", ") || "ไม่ระบุผู้แต่ง"}</p>
          </li>
          
        ))}
      </ul>
    </div>
  );
}

export default App;
