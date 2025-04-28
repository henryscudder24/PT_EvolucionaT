CREATE USER 'Ananda'@'localhost' IDENTIFIED BY 'fluyo369';
ALTER USER 'Ananda'@'localhost' IDENTIFIED BY 'fluyo369';

ALTER USER 'Ananda'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY 'fluyo369';
  
GRANT ALL PRIVILEGES
  ON `evolucionaT`.*
  TO 'Ananda'@'localhost';

FLUSH PRIVILEGES;



