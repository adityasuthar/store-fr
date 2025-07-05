import { StrictMode, use } from "react";
import { createRoot } from "react-dom/client";
// import App  from "./App.jsx";
import "./index.css";
import { useState, useEffect, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";
import react from "react";
import "bootstrap-icons/font/bootstrap-icons.css";


const BASE_URL = import.meta.env.VITE_BASE_URL;



function App() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [store, setStore] = useState("playstore");
  const [country, setCountry] = useState("us");
  const [lang, setLang] = useState("en");

  const handleSearch = async (searchTerm = keyword) => {
    if (!searchTerm) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/search?q=${searchTerm}&store=${store}&country=${country}&lang=${lang}`
      );
      const data = await response.json();
      setResults(data);
      setSuggestions([]); // Clear suggestions after search
    } catch (err) {
      console.error("Frontend fetch error:", err);
    }
  };

  const suggestvalues = async (kw) => {
    if (!kw) return;

    try {
      const response = await fetch(
        `${BASE_URL}/api/suggest?q=${kw}&store=${store}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Suggest fetch error:", err);
    }
  };

  const debouncedSuggest = useMemo(() => debounce(suggestvalues, 2000), [store]);

  useEffect(() => {
    if (keyword) {
      debouncedSuggest(keyword);
    } else {
      setSuggestions([]);
    }
    return () => debouncedSuggest.cancel();
  }, [keyword]);

  const handleSuggestionClick = (item) => {
    const term = item.term || item;
    setKeyword(term);
    setSuggestions([]);
    handleSearch(term);
  };

  return (
    <div className="app-wrapper bg-light text-dark">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-success">App Explorer</h1>
        <p className="text-muted">Search apps from Playstore and Appstore in one place</p>
      </div>

      <div className="d-flex justify-content-center mb-3 gap-2 flex-wrap">
        <button
          className={`btn ${store === "playstore" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setStore("playstore")}
        >
          <i className="bi bi-google-play"></i> Playstore
        </button>
        <button
          className={`btn ${store === "appstore" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setStore("appstore")}
        >
          <i className="bi bi-apple"></i> Appstore
        </button>
      </div>

      <div className="row justify-content-center mb-4 px-3">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="input-group shadow">
            <select
              className="form-select w-auto"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="us">US</option>
              <option value="in">India</option>
              <option value="gb">UK</option>
              <option value="de">Germany</option>
            </select>
            <select
              className="form-select w-auto"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="Search for apps..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-dark" onClick={() => handleSearch()}>
              <i className="bi bi-search"></i>
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="list-group mt-2 shadow">
              {suggestions.map((item, i) => (
                <li
                  key={i}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.term || item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="container-fluid px-5">
        <div className="row">
          {results.map((app, i) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={i}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={app.icon || app.artworkUrl100}
                  alt={app.title || app.trackName}
                  className="card-img-top p-3"
                  style={{ height: "180px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate" title={app.title || app.trackName}>
                    {app.title || app.trackName}
                  </h5>
                  <p className="card-text text-muted small">
                    {app.summary || app.description || "No description available."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
export default App;

// function App() {

//     const [ like, setLike ]  = useState(0);
//     const [ count, setCount ] = useState(0);


//     function increaseCount() {
//         setCount(count + 1);
//     }
//     function increaseLike() { 
//         setLike(like + 1);
//     }
    
//     useEffect(() => 
//         console.log("App component rendered"), [count]);

//     useEffect(() => 
//         console.log("Like counter updated"), [like]);

//     return ( 
//         <>
//             <h1>Like Counter</h1>
//             <div className="like-counter">
//                 <p>Click the buttons to increase or decrease the like count.</p>
//                 <button onClick={increaseCount}>Increase Count</button>
//                 <span>{count}</span>
//                 <button onClick={increaseLike}>Increase Like</button>
//                 <span>{like}</span>
//             </div>
//         </>
//     );
// }

// createRoot(document.getElementById("root")).render(
//     // <StrictMode>
//         <App />
//     // </StrictMode>
// );




// function App() {
//   const [query, setQuery] = useState('')
//   const [results, setResults] = useState([])

//   const fetchSearchResults = async (searchTerm) => {
//     console.log('Searching for:', searchTerm)
//     await new Promise(resolve => setTimeout(resolve, 300))
//     setResults([`${searchTerm} result 1`, `${searchTerm} result 2`, `${searchTerm} result 3`])
//   }

//   useEffect(() => {
//     if (!query) {
//       setResults([])
//       return
//     }

//     const timeout = setTimeout(() => {
//       fetchSearchResults(query)
//     }, 500)

//     return () => clearTimeout(timeout)
//   }, [query])

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Debounced Search</h2>
//       <input
//         type="text"
//         placeholder="Type to search..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         style={{ padding: '8px', width: '300px' }}
//       />

//       <ul>
//         {results.map((result, index) => (
//           <li key={index}>{result}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }


// createRoot(document.getElementById("root")).render(
//     // <StrictMode>
//         <App />
//     // </StrictMode>
// );





// function App() {
//     // const [Like, setLike] = useState(0);
//     // const [inputText, setInputText] = useState("");
//     // const [tableData, setTableData] = useState([]);
//     // const [formData, setFormData] = useState({ name: "", age: "", role: "" });
//     // const [records, setRecords] = useState([]);

//     const [keyword, setKeyword] = useState("");
//     const [results, setResults] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);


//     const handleSearch = async (searchTerm = keyword) => {
//         if (!searchTerm) return;
      
//         try {
//           const response = await fetch(`http://localhost:3001/api/search?q=${searchTerm}`);
//           const data = await response.json();
//           setResults(data);
//         } catch (err) {
//           console.error("Frontend fetch error:", err);
//         }
//     };
      
//     const suggestvalues = async (keyword) => {
//         if (!keyword) return;
        
//         try {
//             const response = await fetch(`http://localhost:3001/api/suggest?q=${keyword}`);
//             const data = await response.json();
//             setSuggestions(data); // <-- update suggestions state
//         } catch (err) {
//             console.error("Frontend fetch error:", err);
//         }
//     };

//     const debouncedSuggest = useMemo(() => debounce(suggestvalues, 3000), []);

//     useEffect(() => {
//       if (keyword) {
//         debouncedSuggest(keyword);
//       } else {
//         setSuggestions([]);
//       }
    
//       return () => {
//         debouncedSuggest.cancel(); // cleanup on unmount or keyword change
//       };
//     }, [keyword]);
    
        
//     const handleSuggestionClick = (suggestion) => {
//         setKeyword(suggestion);
//         setSuggestions([]); // clear suggestions dropdown
//         handleSearch(suggestion); // trigger search with selected suggestion
//       };


//     return (
//         <>
//         <div className="container mt-5">
//           <h2>Google Play Top 10 App Search</h2>
//           <input
//             type="text"
//             className="form-control my-3"
//             placeholder="Enter keyword to search"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             />
//             <ul className="list-group mb-2">
//                 {suggestions.map((item, index) => (
//                     <li
//                         key={index}
//                         className="list-group-item list-group-item-action"
//                         onClick={() => handleSuggestionClick(item)}
//                         style={{ cursor: "pointer" }}
//                     >
//                     {item}
//                     </li>
//                 ))}
//             </ul>
//           <button className="btn btn-primary mb-3" onClick={handleSearch}>
//             Search
//           </button>
//             <ul className="list-group">
//                 {results.map((app, index) => (
//                     <li key={index} className="list-group-item">
//                         <strong>{app.title || app}</strong> <br />
//                         <small>{app.developer}</small>
//                     </li>
//             ))}
//             </ul>
//         </div>
//         </>
//       );
//     };
// createRoot(document.getElementById("root")).render(
// //    <StrictMode>
//         <App />
// //    </StrictMode>
// );
    

// export default App;





//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (formData.name && formData.age && formData.role) {
//             setRecords([...records, formData]);
//             setFormData({ name: "", age: "", role: "" }); // reset form
//         }
//     };

//     return (
//         <div style={{ padding: "20px" }}>
//             <h2>User Form</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="number"
//                     name="age"
//                     placeholder="Age"
//                     value={formData.age}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="text"
//                     name="role"
//                     placeholder="Role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     required
//                 />
//                 <button type="submit">Submit</button>
//             </form>

//             {records.length > 0 && (
//                 <div style={{ marginTop: "20px" }}>
//                     <h3>Submitted Records</h3>
//                     <table border="1" cellPadding="10">
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Age</th>
//                                 <th>Role</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {records.map((record, index) => (
//                                 <tr key={index}>
//                                     <td>{record.name}</td>
//                                     <td>{record.age}</td>
//                                     <td>{record.role}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//         </div>
//     );
// }


// createRoot(document.getElementById("root")).render(
//     //    <StrictMode>
//             <App />
//     //    </StrictMode>
// );
    




//     function increaseLike() {
//         setLike(Like + 1);
//     }
//     function decreaseLike() {
//         if (Like > 0){
//             setLike(Like - 1);
//         }
//     }

    // function handleInputChange(event) {
    //     if (!event.target.value.includes("@")) {
    //         setInputText(event.target.value+"@gmail.com");
    //     }
    //     else {
    //         setInputText(event.target.value)
    //     }
    // }

//     function handleTableDataChange(event) {
//         setTableData(event.target.value);
//     }

//     let table = [
//         [1, 2, 3],
//         [4, 5, 6],
//         [7, 8, 9] ]

//     return (
//         <>
//             <h1>Like Counter</h1>
//             <div className="like-counter">
//                 <p>Click the buttons to increase or decrease the like count.</p>
//                 <button onClick={decreaseLike} disabled={Like==0}>-</button>
//                 <span>{Like}</span>
//                 <button onClick={increaseLike}>+</button>
//             </div>

//             <h1>Input Text</h1>
//             <div className="input-text">
//                 <input type="text" onChange={handleInputChange} placeholder="Type something..." />
//                 <p>You are typing: {inputText}</p>
//             </div>

//             <h1>Table data</h1>
//             <div className="table-data">
//                 <input type="text" onChange={handleTableDataChange} placeholder="Type something..." />
//                 <p>You are typing: {tableData}</p>
//             </div>
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>{tableData} 1</th>
//                             <th>{tableData} 2</th>
//                             <th>{tableData} 3</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {table.map((row, rowIndex) => (
//                                 <tr key={rowIndex}>
//                                     {row.map((cell, cellIndex) => (
//                                         <td key={cellIndex}>{cell}</td>
//                                     ))}
//                                 </tr>
//                             ))}
//                     </tbody>
//                 </table>
//         </>
//     );
// }
// createRoot(document.getElementById("root")).render(
// //    <StrictMode>
//         <App />
// //    </StrictMode>
// );




// function Card(props) {
//     return (
//         <div className="card">
//             <h2>{props.name}</h2>
//             <h3>{props.role}</h3>
//             <p>{props.Bio}</p>
//             <ul>
//                 {props.skills.map((skill, index) => (
//                     <li key={index}>{skill}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// }


// const personsdetails = [
//     { name: "Aditya Suthar", 
//         role: "Full Stack developer", 
//         Bio: "Full Stack Developer proficient in Python, Django, React.js, and Node.js, with a strong foundation in data structures and algorithms. Passionate about building scalable, user-centric web applications and contributing to impactful open-source projects",
//         skills: ["Python", "Django", "React.js"]
//     },
//     { name: "Arjun Gahlot", 
//         role: "Software Engineer", 
//         Bio: "Experienced Software Engineer with a focus on web development and cloud technologies.",
//         skills: ["JavaScript", "Node.js", "AWS"]
//     },
//     { name: "Bharat Swami", 
//         role: "Data Scientist", 
//         Bio: "Data Scientist specializing in machine learning and data analysis.",
//         skills: ["Python", "Pandas", "Scikit-learn"]
//     }]

// createRoot(document.getElementById("root")).render(
//     <StrictMode>
//             {/* <Card name="Aditya Suthar"
//             role="Full Stack Developer"
//             Bio="Full Stack Developer proficient in Python, Django, React.js, and Node.js, with a strong foundation in data structures and algorithms. Passionate about building scalable, user-centric web applications and contributing to impactful open-source projects"
//             skills={["Python", "Django", "React.js"]} /> */}
//             {personsdetails.map((person, index) => (
//                 <Card 
//                     key={index}
//                     name={person.name}
//                     role={person.role}
//                     Bio={person.Bio}
//                     skills={person.skills} />
//             ))}
//     </StrictMode>
// )
