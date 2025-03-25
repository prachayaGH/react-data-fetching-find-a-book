import { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "./App.css";

function App() {
  const [query, setQuery] = useState(""); // เก็บค่าที่พิมพ์
  const [books, setBooks] = useState([]); // เก็บผลลัพธ์จาก API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (query === "") {
      setError("⚠️ กรุณากรอกข้อความค้นหา");
      setBooks([]); // เคลียร์ผลลัพธ์เมื่อไม่มีคำค้นหา
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

  // การดีเบาเซิร์จ (ค้นหาในช่วงเวลาที่กำหนด)
  const debouncedFetchBooks = debounce(fetchBooks, 500);

  // ใช้ useEffect เพื่อตรวจสอบเมื่อ query เปลี่ยน
  useEffect(() => {
    debouncedFetchBooks();
    // ควรเคลียร์การดีเบาเมื่อคอมโพเนนต์ถูกทำลาย
    return () => {
      debouncedFetchBooks.cancel();
    };
  }, [query]);

  return (
    <div className="container">
      <h1>🔍 ค้นหาหนังสือ</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="พิมพ์ชื่อหนังสือ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
