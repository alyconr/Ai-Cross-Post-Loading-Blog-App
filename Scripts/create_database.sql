-- Create the database
CREATE DATABASE IF NOT EXISTS ai_blog_posts;
USE ai_blog_posts;

-- Set character set
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Create Users table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    fullname VARCHAR(45) NOT NULL,
    username VARCHAR(45) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    image VARCHAR(255),
    company VARCHAR(45),
    location VARCHAR(45),
    social1 VARCHAR(45),
    social2 VARCHAR(45),
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DevToToken VARCHAR(255),
    MediumToken VARCHAR(255),
    HashNodeToken VARCHAR(255),
    HashnodePublicationId VARCHAR(255),
    OpenAiApiKey VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Posts table
CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description MEDIUMTEXT NOT NULL,
    Content LONGTEXT NOT NULL,
    image VARCHAR(255),
    date DATETIME,
    uid INT NOT NULL,
    Category VARCHAR(45),
    Tags MEDIUMTEXT,
    Metadata LONGTEXT,
    PRIMARY KEY (id),
    KEY uid_idx (uid),
    CONSTRAINT uid FOREIGN KEY (uid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Posts_draft table
CREATE TABLE posts_draft (
    draft_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description MEDIUMTEXT NOT NULL,
    content LONGTEXT NOT NULL,
    image VARCHAR(255),
    date DATETIME,
    userId INT NOT NULL,
    category VARCHAR(45),
    tags MEDIUMTEXT,
    PRIMARY KEY (draft_id),
    KEY draft_postId_idx (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Comments table
CREATE TABLE comments (
    id INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    fullname VARCHAR(45),
    postID INT,
    comment MEDIUMTEXT NOT NULL,
    date DATETIME,
    PRIMARY KEY (id),
    KEY user_id_idx (userID),
    KEY post_id_idx (postID),
    CONSTRAINT postID FOREIGN KEY (postID) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userID FOREIGN KEY (userID) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Comment_onComments table
CREATE TABLE comment_onComments (
    id INT NOT NULL AUTO_INCREMENT,
    onComment_id INT NOT NULL,
    postId INT,
    fullname VARCHAR(45),
    comment MEDIUMTEXT NOT NULL,
    date DATETIME,
    PRIMARY KEY (id),
    KEY onComment_id_idx (onComment_id),
    CONSTRAINT onCommnet_id FOREIGN KEY (onComment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Claps table
CREATE TABLE claps (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applause_count INT NOT NULL,
    PRIMARY KEY (id),
    KEY uid_idx (user_id),
    KEY post_id_idx (post_id),
    CONSTRAINT post_id FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Claps_comments table
CREATE TABLE claps_comments (
    id INT NOT NULL AUTO_INCREMENT,
    userComment_id INT NOT NULL,
    comment_id INT NOT NULL,
    applauseComment_count INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY userComment_id_idx (userComment_id),
    KEY comment_id_idx (comment_id),
    CONSTRAINT comment_id FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userComment_id FOREIGN KEY (userComment_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Claps_commentOnComments table
CREATE TABLE claps_commentOnComments (
    id INT NOT NULL AUTO_INCREMENT,
    userCommentId INT NOT NULL,
    commentOnCommentId INT NOT NULL,
    applauseCommentOnComment INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY CommentsOnCommentsId_idx (commentOnCommentId),
    KEY userCommentId_idx (userCommentId),
    CONSTRAINT CommentsOnCommentsId FOREIGN KEY (commentOnCommentId) REFERENCES comment_onComments (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT userCommentId FOREIGN KEY (userCommentId) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Bookmarks table
CREATE TABLE bookmarks (
    id INT NOT NULL AUTO_INCREMENT,
    usersId INT NOT NULL,
    postsId INT NOT NULL,
    PRIMARY KEY (id),
    KEY user_id_idx (usersId),
    KEY posts_id_idx (postsId),
    CONSTRAINT postsId FOREIGN KEY (postsId) REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT usersId FOREIGN KEY (usersId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create Followers table
CREATE TABLE followers (
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    followers_count INT,
    follow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    KEY following_id_idx (following_id),
    CONSTRAINT follower_id FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT following_id FOREIGN KEY (following_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;