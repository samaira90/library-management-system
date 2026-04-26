import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc
} from "firebase/firestore";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { db, auth } from "./firebase";

function App() {

  // 🔐 AUTH
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 📚 BOOKS
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    total_copies: 1
  });

  // 🔐 CHECK LOGIN
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 📚 FETCH BOOKS
  const fetchBooks = async () => {
    const querySnapshot = await getDocs(collection(db, "books"));
    const list = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      list.push({
        id: doc.id,
        title: data.title || "No Title",
        author: data.author || "Unknown",
        total_copies: data.total_copies || 0,
        available_copies: data.available_copies || 0
      });
    });

    setBooks(list);
  };

  useEffect(() => {
    if (user) fetchBooks();
  }, [user]);

  // 🔐 LOGIN
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 SIGNUP
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔐 LOGOUT
  const logout = async () => {
    await signOut(auth);
  };

  // 📚 ADD BOOK
  const addBook = async () => {
    if (!newBook.title || !newBook.author) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "books"), {
      title: newBook.title,
      author: newBook.author,
      total_copies: Number(newBook.total_copies),
      available_copies: Number(newBook.total_copies)
    });

    setNewBook({ title: "", author: "", total_copies: 1 });
    fetchBooks();
  };

  // 📚 ADD SAMPLE BOOKS
  const addSampleBooks = async () => {
    const sample = [
      { title: "Clean Code", author: "Robert Martin", total_copies: 5, available_copies: 5 },
      { title: "Deep Work", author: "Cal Newport", total_copies: 6, available_copies: 6 },
      { title: "Zero to One", author: "Peter Thiel", total_copies: 4, available_copies: 4 },
      { title: "Ikigai", author: "Hector Garcia", total_copies: 7, available_copies: 7 },
      { title: "Atomic Habits", author: "James Clear", total_copies: 8, available_copies: 8 }
    ];

    for (let b of sample) {
      await addDoc(collection(db, "books"), b);
    }

    alert("Sample books added!");
    fetchBooks();
  };

  // 📦 ISSUE
  const issueBook = async (book) => {
    if (book.available_copies > 0) {
      await updateDoc(doc(db, "books", book.id), {
        available_copies: book.available_copies - 1
      });
      fetchBooks();
    } else {
      alert("No copies available");
    }
  };

  // 🔄 RETURN
  const returnBook = async (book) => {
    await updateDoc(doc(db, "books", book.id), {
      available_copies: book.available_copies + 1
    });
    fetchBooks();
  };

  // 🔍 SEARCH
  const filteredBooks = books.filter((book) =>
    (book.title || "").toLowerCase().includes(search.toLowerCase())
  );

  // 🔐 LOGIN PAGE
  if (!user) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #667eea, #764ba2)"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "15px",
          width: "300px",
          textAlign: "center"
        }}>
          <h2>📚 Library Login</h2>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", margin: "10px 0" }}
          />

          <button onClick={login} style={{ width: "100%", marginBottom: "10px" }}>
            Login
          </button>

          <button onClick={signup} style={{ width: "100%" }}>
            Signup
          </button>
        </div>
      </div>
    );
  }

  // 📚 MAIN UI
  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>📚 Library Management System</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="🔍 Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          margin: "20px 0",
          borderRadius: "5px"
        }}
      />

      {/* ADD BOOK */}
      <div style={{
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <h3>Add Book</h3>

        <input
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />

        <input
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          style={{ marginLeft: "10px" }}
        />

        <input
          type="number"
          value={newBook.total_copies}
          onChange={(e) => setNewBook({ ...newBook, total_copies: e.target.value })}
          style={{ marginLeft: "10px", width: "80px" }}
        />

        <button onClick={addBook} style={{ marginLeft: "10px" }}>
          Add
        </button>

        <button onClick={addSampleBooks} style={{ marginLeft: "10px" }}>
          Add Sample Books
        </button>
      </div>

      {/* BOOKS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            style={{
              background: "white",
              borderRadius: "15px",
              padding: "15px",
              width: "260px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <img
              src="https://source.unsplash.com/200x150/?book"
              alt="book"
              style={{ width: "100%", borderRadius: "5px" }}
            />

            <h3>{book.title}</h3>
            <p><b>Author:</b> {book.author}</p>
            <p><b>Available:</b> {book.available_copies}</p>

            <button
              onClick={() => issueBook(book)}
              style={{ marginRight: "10px", background: "orange", color: "white" }}
            >
              Issue
            </button>

            <button
              onClick={() => returnBook(book)}
              style={{ background: "green", color: "white" }}
            >
              Return
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;