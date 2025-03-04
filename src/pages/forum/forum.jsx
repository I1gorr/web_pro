import React, { useState } from "react";
import styled from 'styled-components';
import "./forum.css";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPost, setNewPost] = useState({
    username: "",
    content: "",
    category: "Misc",
  });
  const [filterCategory, setFilterCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState(null);

  const addPost = () => {
    if (newPost.username.trim() === "" || newPost.content.trim() === "")
      return;
    const post = {
      id: Date.now(),
      username: newPost.username,
      content: newPost.content,
      category: newPost.category,
      answers: [],
    };
    setPosts([post, ...posts]);
    setNewPost({ username: "", content: "", category: "Misc" });
  };

  const addAnswer = (postId, answer) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, answers: [...post.answers, { text: answer }] }
          : post
      )
    );
  };

  const filteredPosts =
    filterCategory === "All"
      ? posts
      : posts.filter((post) => post.category === filterCategory);

  const Radio = ({ onChange }) => {
    const handleChange = (e) => {
      onChange(e.target.value);
    };

    return (
      <StyledWrapper>
        <div className="select">
          <div className="selected" data-default="All" data-one="Maths" data-two="Science" data-three="Computers" data-four="Misc">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
              <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
            </svg>
          </div>
          <div className="options">
            <div title="all">
              <input id="all" name="option" type="radio" value="All" defaultChecked onChange={handleChange} />
              <label className="option" htmlFor="all" data-txt="All" />
            </div>
            <div title="Maths">
              <input id="option-1" name="option" type="radio" value="Maths" onChange={handleChange} />
              <label className="option" htmlFor="option-1" data-txt="Maths" />
            </div>
            <div title="Science">
              <input id="option-2" name="option" type="radio" value="Science" onChange={handleChange} />
              <label className="option" htmlFor="option-2" data-txt="Science" />
            </div>
            <div title="Computers">
              <input id="option-3" name="option" type="radio" value="Computers" onChange={handleChange} />
              <label className="option" htmlFor="option-3" data-txt="Computers" />
            </div>
            <div title="Misc">
              <input id="option-4" name="option" type="radio" value="Misc" onChange={handleChange} />
              <label className="option" htmlFor="option-4" data-txt="Misc" />
            </div>
          </div>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledForumContainer>
      {/* Filter Bar */}
      <div className="domainFilter">
      <p>Filter by domain</p>
      </div>
      <div className="filter-bar">
        <Radio onChange={(value) => setFilterCategory(value)} />
      </div>
      
        
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Center Content */}
      <div className="center-content">
        <div className="content-wrapper">
          {/* Create Post */}
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
          {/* Posts */}
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
                  <div className="post" key={post.id}>
                    <h4
                      onClick={() =>
                        setExpandedPost(
                          expandedPost === post.id ? null : post.id
                        )
                      }
                      style={{
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      {post.content}{" "}
                      <span style={{ fontSize: "14px", color: "#888" }}>
                        (Posted by: {post.username})
                      </span>
                    </h4>
                    <p>
                      <strong>Domain:</strong> {post.category}
                    </p>
                    {/* Answers */}
                    {expandedPost === post.id && (
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
                        {/* Answer Input */}
                        <div className="answer-input">
                          <textarea
                            placeholder="Write your answer..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                addAnswer(post.id, e.target.value);
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
    </StyledForumContainer>
  );
}

const StyledWrapper = styled.div`
  .select {
    width: fit-content;
    cursor: pointer;
    position: relative;
    transition: 300ms;
    color: white;
    overflow: hidden;
  }

  .selected {
    background-color: #2a2f3b;
    padding: 5px;
    margin-bottom: 3px;
    border-radius: 5px;
    position: relative;
    z-index: 100000;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .arrow {
    position: relative;
    right: 0px;
    height: 10px;
    transform: rotate(-90deg);
    width: 25px;
    fill: white;
    z-index: 100000;
    transition: 300ms;
  }

  .options {
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding: 5px;
    background-color: #2a2f3b;
    position: relative;
    top: -100px;
    opacity: 0;
    transition: 300ms;
  }

  .select:hover > .options {
    opacity: 1;
    top: 0;
  }

  .select:hover > .selected .arrow {
    transform: rotate(0deg);
  }

  .option {
    border-radius: 5px;
    padding: 5px;
    transition: 300ms;
    background-color: #2a2f3b;
    width: 150px;
    font-size: 15px;
  }
  .option:hover {
    background-color: #323741;
  }

  .options input[type="radio"] {
    display: none;
  }

  .options label {
    display: inline-block;
  }
  .options label::before {
    content: attr(data-txt);
  }

  .options input[type="radio"]:checked + label {
    display: none;
  }

  .options input[type="radio"]#all:checked + label {
    display: none;
  }

  .select:has(.options input[type="radio"]#all:checked) .selected::before {
    content: attr(data-default);
  }
  .select:has(.options input[type="radio"]#option-1:checked) .selected::before {
    content: attr(data-one);
  }
  .select:has(.options input[type="radio"]#option-2:checked) .selected::before {
    content: attr(data-two);
  }
  .select:has(.options input[type="radio"]#option-3:checked) .selected::before {
    content: attr(data-three);
  }
  .select:has(.options input[type="radio"]#option-4:checked) .selected::before {
    content: attr(data-four);
  }
`;

const StyledForumContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;