import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./forum.css";

export default function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({
    username: "",
    content: "",
    category: "Misc",
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:5002/api/posts");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const addPost = async () => {
    if (newPost.username.trim() === "" || newPost.content.trim() === "") return;
    const post = {
      username: newPost.username,
      content: newPost.content,
      category: newPost.category,
    };

    const response = await fetch("http://localhost:5002/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    const data = await response.json();
    setPosts([data, ...posts]);
    setNewPost({ username: "", content: "", category: "Misc" });
  };

  const addAnswer = async (postId, answer) => {
    const response = await fetch(`http://localhost:5002/api/posts/${postId}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    const data = await response.json();
    setPosts(posts.map((post) => (post._id === postId ? data : post)));
  };

  const filteredPosts =
    filterCategory === "All"
      ? posts
      : posts.filter((post) => post.category === filterCategory);

  return (
    <StyledForumContainer>
      <div className="floating-filter">
        <label>Filter by domain:</label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Maths">Maths</option>
          <option value="Science">Science</option>
          <option value="Computers">Computers</option>
          <option value="Misc">Misc</option>
        </select>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="center-content">
        <div className="content-wrapper">
          <div className="create-post">
            <h3>Create Post</h3>
            <input
              type="text"
              placeholder="Enter your username..."
              value={newPost.username}
              onChange={(e) =>
                setNewPost({ ...newPost, username: e.target.value })
              }
            />
            <textarea
              placeholder="Write your question or comment..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            />
            <div className="drop">
              <select
                value={newPost.category}
                onChange={(e) =>
                  setNewPost({ ...newPost, category: e.target.value })
                }
              >
                <option value="Maths">Maths</option>
                <option value="Science">Science</option>
                <option value="Computers">Computers</option>
                <option value="Misc">Misc</option>
              </select>
            </div>
            <br />
            <button onClick={addPost}>Post</button>
          </div>

          <div>
            {filteredPosts.length > 0 ? (
              filteredPosts
                .filter(
                  (post) =>
                    post.content
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    post.username
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((post) => (
                  <div className="post" key={post._id}>
                    <h4
                      onClick={() =>
                        setExpandedPost(expandedPost === post._id ? null : post._id)
                      }
                      style={{ cursor: "pointer", color: "white" }}
                    >
                      {post.content}{" "}
                      <span style={{ fontSize: "14px", color: "#888" }}>
                        (Posted by: {post.username})
                      </span>
                    </h4>
                    <p>
                      <strong>Domain:</strong> {post.category}
                    </p>

                    {expandedPost === post._id && (
                      <div>
                        {post.answers.length > 0 ? (
                          <div className="answers">
                            <h5>Answers:</h5>
                            {post.answers.map((answer, index) => (
                              <p key={index}>{answer.text}</p>
                            ))}
                          </div>
                        ) : (
                          <p>No answers yet.</p>
                        )}
                        <div className="answer-input">
                          <textarea
                            placeholder="Write your answer..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                addAnswer(post._id, e.target.value);
                                e.target.value = "";
                                setExpandedPost(null);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <p style={{ textAlign: "center" }}>No posts found.</p>
            )}
          </div>
        </div>
      </div>

      <button className="navigate-button" onClick={() => navigate("/notes")}>
        Your Notes
      </button>
    </StyledForumContainer>
  );
}

const StyledForumContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  .floating-filter {
    position: fixed;
    top: 10px;
    left: 10px;
    background: #1e1f29;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
    color: white;
    display: flex;
    flex-direction: column;
  }

  .floating-filter label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .floating-filter select {
    padding: 5px;
    border-radius: 5px;
    background: #1e1f29;
    color: white;
  }

  .navigate-button {
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .navigate-button:hover {
    background: #0056b3;
  }
`;
