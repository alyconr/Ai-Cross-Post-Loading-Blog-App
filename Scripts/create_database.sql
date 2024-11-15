-- Create the database
CREATE DATABASE IF NOT EXISTS ai_blog_posts;
USE ai_blog_posts;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS claps_commentOnComments;
DROP TABLE IF EXISTS claps_comments;
DROP TABLE IF EXISTS claps;
DROP TABLE IF EXISTS comment_onComments;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts_draft;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create Users table (parent table)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Posts table
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    uid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uid FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Posts_draft table
CREATE TABLE posts_draft (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    uid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT posts_draft_uid FOREIGN KEY (uid) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Comments table
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    postID INT NOT NULL,
    userID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT postID FOREIGN KEY (postID) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userID FOREIGN KEY (userID) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Comment_onComments table
CREATE TABLE comment_onComments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    onComment_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT onCommnet_id FOREIGN KEY (onComment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Claps table
CREATE TABLE claps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_clap (post_id, user_id)
);

-- Create Claps_comments table
CREATE TABLE claps_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT NOT NULL,
    userComment_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT comment_id FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userComment_id FOREIGN KEY (userComment_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_comment_clap (comment_id, userComment_id)
);

-- Create Claps_commentOnComments table
CREATE TABLE claps_commentOnComments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commentOnCommentId INT NOT NULL,
    userCommentId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT CommentsOnCommentsId FOREIGN KEY (commentOnCommentId) REFERENCES comment_onComments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userCommentId FOREIGN KEY (userCommentId) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
    UNIQUE KEY unique_comment_reply_clap (commentOnCommentId, userCommentId)
);

-- Create Bookmarks table
CREATE TABLE bookmarks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usersId INT NOT NULL,
    postsId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usersId FOREIGN KEY (usersId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT postsId FOREIGN KEY (postsId) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_bookmark (usersId, postsId)
);

-- Create Followers table
CREATE TABLE followers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT follower_id FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT following_id FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id)
);

-- Add indexes for better performance
CREATE INDEX idx_posts_uid ON posts(uid);
CREATE INDEX idx_posts_draft_uid ON posts_draft(uid);
CREATE INDEX idx_comments_postID ON comments(postID);
CREATE INDEX idx_comments_userID ON comments(userID);
CREATE INDEX idx_comment_replies ON comment_onComments(onComment_id);
CREATE INDEX idx_claps_post ON claps(post_id);
CREATE INDEX idx_claps_user ON claps(user_id);
CREATE INDEX idx_bookmarks_user ON bookmarks(usersId);
CREATE INDEX idx_bookmarks_post ON bookmarks(postsId);
CREATE INDEX idx_followers ON followers(follower_id, following_id);