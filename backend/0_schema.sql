DROP DATABASE IF EXISTS isuconp;
CREATE DATABASE isuconp;

DROP TABLE IF EXISTS isuconp.user;
DROP TABLE IF EXISTS isuconp.item;
DROP TABLE IF EXISTS isuconp.address;
DROP TABLE IF EXISTS isuconp.order;
DROP TABLE IF EXISTS isuconp.order_detail;

CREATE TABLE isuconp.user
(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(63) NOT NULL
);

CREATE TABLE isuconp.item
(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL
);

CREATE TABLE isuconp.address
(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  address VARCHAR(511) NOT NULL
);

CREATE TABLE isuconp.order
(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  to_address_id INTEGER NOT NULL,
  status VARCHAR(31) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES isuconp.user(id),
  FOREIGN KEY (to_address_id) REFERENCES isuconp.address(id)
);

CREATE TABLE isuconp.order_detail
(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  order_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  from_address_id INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES isuconp.order(id),
  FOREIGN KEY (item_id) REFERENCES isuconp.item(id),
  FOREIGN KEY (from_address_id) REFERENCES isuconp.address(id)
);
