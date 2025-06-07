CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL
);

INSERT INTO users(username,password) VALUES 
('pawel', 'asd'),
('asd', 'asd');

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO messages (user_id, content) VALUES
(1, 'Is it working?'),
(2, 'Yup'),
(1, 'Yaay');