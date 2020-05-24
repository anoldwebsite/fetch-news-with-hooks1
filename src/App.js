import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function App() {
  const [results, setResults] = useState([]);//Initialize the state with an empty array
  const [query, setQuery] = useState('covid-19');
  const [laoding, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef();

  useEffect(() => {
    getResults();
  }, []);//Empty array means only on mounting and unmounting of the component render or re-render and not on updates.

  const getResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setResults(response.data.hits);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSubmit = event => {
    event.preventDefault();//Prevent the page from re-laoding.
    getResults();
  };

  const handleClearSearchBox = event => {
    setQuery('');
    searchInputRef.current.focus();
  };
  //console.log(results);
  /*   useEffect(() => {
    axios.get('http://hn.algolia.com/api/v1/search?query=covid19')
      .then(response => {
        console.log(response.data)
        setResults(response.data.hits)
      })
  }, []); */

  return (
    <div className="container max-w-md ms-auto p-4 m-2 bg-purple-lightest shadow-lg rounded">
      <img
        src="https://icon.now.sh/react/c0c"
        alt="Rect Logo"
        className="float-right h-12"
      />
      <h1 className="text-grey-darkset font-thin">Using React hooks to fetch News</h1>
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          ref={searchInputRef} //Now the content of the input field is accessible through our ref.
          className="border p-1 rounded"
        />
        <button type="submit" className="bg-orange rounded m-1 p-1">Search</button>
        <button type="button" onClick={handleClearSearchBox} className="bg-teal text-white p-1 rounded">Clear</button>
      </form>

      {
        laoding
          ? (
            <div className="font-bold text-orange-dark">Loading Results...</div>
          )
          : (
            <ul className="list-reset leading-normal">
              {
                results.map(result => (
                  <li key={result.objectID}>
                    <a
                      href={result.url}
                      className="text-indigo-dark hover:text-indigo-darkest"
                    >
                      {result.title}
                    </a>
                  </li>
                ))
              }
            </ul>
          )
      }

      {error && <div className="text-red font-bold">{error.message}</div>}
    </div>
  );
};