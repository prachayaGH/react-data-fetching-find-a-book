import axios from "axios"
import { debounce } from "lodash"
import React, { useEffect, useState, useCallback } from "react"

function FindBook() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState("")

  const getBooks = async () => {
    try {
      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}`
      )
      console.log(result.data)
      setBooks(result.data.items || [])
    } catch (error) {
      console.error("Error fetching books:", error)
    }
  }

  useEffect(() => {
    if (search.trim() !== "") {
      getBooks()
    }
  }, [search])

  // ใช้ useCallback เพื่อ memoize ฟังก์ชัน debounce
  const debounceHandleSearch = useCallback(
    debounce((value) => {
      setSearch(value)
    }, 1000),
    [] // dependencies array ว่างเพราะ debounce ไม่ควรเปลี่ยน
  )

  const handleChange = (e) => {
    // เรียกฟังก์ชัน debounce ด้วยค่า input ใหม่
    debounceHandleSearch(e.target.value)
  }

  return (
    <div>
      <h1>Find Book</h1>
      <input type='text' onChange={handleChange} />
      <div>
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id}>
              <li>{book.volumeInfo.title}</li>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>
    </div>
  )
}

export default FindBook
