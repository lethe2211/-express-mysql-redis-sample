CREATE USER 'isuconp'@'localhost' IDENTIFIED BY 'isuconp';
CREATE USER 'isuconp'@'%' IDENTIFIED BY 'isuconp';
GRANT ALL ON *.* TO 'isuconp'@'localhost';
GRANT ALL ON *.* TO 'isuconp'@'%';

DROP DATABASE IF EXISTS isuconp;
CREATE DATABASE isuconp;
