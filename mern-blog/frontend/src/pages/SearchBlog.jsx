//workspaces/codespaces-blank/mern-blog/frontend/src/pages/SearchBlog.jsx
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import API from "../api.js";
import "../styles/SearchBlog.css";
import { Link } from "react-router-dom";

const SearchBlog = () => {
  const [result, setResult] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownboxRef = useRef(null); //this will give a tag to that box which we are using in the div element

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // this will check if the user who clicked is inside the box or not
      if (
        dropdownboxRef.current &&
        !dropdownboxRef.current.contains(event.target)
      ) {
        // this will check so when the click is outside the box it will close
        setShowDropdown(false); // so it will close
      }
    };
    document.addEventListener("mousedown", handleClickOutside); //  it will tell to check the whole page for clicks then above function will check if the click in the box or not
    return () => document.removeEventListener("mousedown", handleClickOutside); // then it will remove the event listener when we are done clicking
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      if (searchWords.trim() === "") {
        setResult([]);
        setShowDropdown(false);
        return;
      }
      setSearching(true);
      setShowDropdown(true);

      try {
        console.log("🚀 Frontend sending:", {
          q: searchWords,
          category: category,
          sort: sortBy,
        });
        const res = await API.get(`/blogs/search`, {
          params: {
            q: searchWords.trim(),
            category: category,
            sort: sortBy,
          },
        });
        console.log("search result : ", searchWords, category, sortBy);
        setResult(res.data.blogs || res.data);
      } catch (error) {
        alert("Can't search the blog");
      } finally {
        setSearching(false);
      }
    };

    const delayInterval = setTimeout(() => {
      fetchBlog();
    }, 500);
    return () => clearTimeout(delayInterval);
  }, [searchWords, category, sortBy]);

  return (
    <div className="search-blog-container" ref={dropdownboxRef}>
      {" "}
      {/* //so we tell this div that you are the box which will handle the
      handleClickOutside so it will use itself as the reference */}{" "}
      <div className="search-bar">
        <div className="search-input-container">
          <input
            className="search-input"
            name="title"
            type="text"
            placeholder="Search blogs..."
            value={searchWords}
            onChange={(e) => setSearchWords(e.target.value)}
            onFocus={() => searchWords && setShowDropdown(true)}
          />

          {/* Dropdown Results */}
          {showDropdown && (
            <div className="search-dropdown">
              {searching && (
                <div className="dropdown-item loading">⏳ Searching...</div>
              )}

              {!searching && result.length === 0 && searchWords && (
                <div className="dropdown-item no-results">
                  😞 No blogs found
                </div>
              )}

              {!searching &&
                result.map((blog) => (
                  <div key={blog._id}>
                    <h4>
                      <Link
                        key={blog._id}
                        to={`/blogs/${blog._id}`}
                        className="dropdown-item blog-result"
                        onClick={() => setShowDropdown(false)}
                      >
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="blog-preview">
                      {blog.content.substring(0, 80)}...
                    </p>
                    <div className="blog-meta">
                      <span>🏷️ {blog.category}</span>
                      <span>❤️ {blog.likes} likes</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <select
          className="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Anime">⛩️Anime</option>
          <option value="Game">🎮 Gaming</option>
        </select>

        {/* Sort Filter */}
        <select
          className="sort-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
          <option value="alphabetical">A-Z</option>
        </select>

        <button className="search-button" type="button">
          {searching ? "Searching..." : "Search"}
        </button>
      </div>
      {/* Remove the old results display - now shown in dropdown only */}
    </div>
  );
};

export default SearchBlog;
