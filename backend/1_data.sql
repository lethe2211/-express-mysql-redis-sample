-- INSERT INTO isuconp.user (id, name) VALUES (1, 'ユーザ1');
-- INSERT INTO isuconp.user (id, name) VALUES (2, 'ユーザ2');

-- INSERT INTO isuconp.item (id, name, price) VALUES (1, 'item1', 100);
-- INSERT INTO isuconp.item (id, name, price) VALUES (2, 'item2', 200);
-- INSERT INTO isuconp.item (id, name, price) VALUES (3, 'item3', 300);

-- INSERT INTO isuconp.address (id, address) VALUES (1, '東京都港区');
-- INSERT INTO isuconp.address (id, address) VALUES (2, '東京都渋谷区');

-- INSERT INTO isuconp.order (id, user_id, to_address_id, status) VALUES (1, 1, 1, 'IN_SHIPPING');
-- INSERT INTO isuconp.order (id, user_id, to_address_id, status) VALUES (2, 1, 2, 'PREPARING');
-- INSERT INTO isuconp.order (id, user_id, to_address_id, status) VALUES (3, 2, 2, 'SHIPPED');

-- INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id) VALUES (1, 1, 1, 1);
-- INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id) VALUES (2, 1, 2, 1);
-- INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id) VALUES (3, 1, 3, 2);
-- INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id) VALUES (4, 2, 1, 2);
-- INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id) VALUES (5, 2, 3, 1);

-- ユーザーテーブル (isuconp.user)
DELIMITER //
CREATE PROCEDURE GenerateUserData()
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 500 DO
    INSERT INTO isuconp.user (id, name) VALUES (i, CONCAT('ユーザ', i));
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;
CALL GenerateUserData();

-- アイテムテーブル (isuconp.item)
DELIMITER //
CREATE PROCEDURE GenerateItemData()
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 1000 DO
    INSERT INTO isuconp.item (id, name, price) VALUES (i, CONCAT('item', i), i * 100);
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;
CALL GenerateItemData();

-- アドレステーブル (isuconp.address)
DELIMITER //
CREATE PROCEDURE GenerateAddressData()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE city_names VARCHAR(511);
  SET city_names = '東京都港区,東京都渋谷区,大阪府大阪市北区,大阪府大阪市東区,京都府京都市中京区,京都府京都市東山区,福岡県福岡市博多区,福岡県福岡市中央区,北海道札幌市中央区,北海道札幌市豊平区,名古屋市中区,名古屋市東区,広島市中区,広島市西区,仙台市青葉区,仙台市宮城野区,横浜市中区,横浜市港北区,神戸市中央区,神戸市兵庫区,札幌市中央区,札幌市豊平区,川崎市川崎区,川崎市高津区,相模原市中央区,相模原市南区,千葉市中央区,千葉市花見川区,さいたま市中央区,さいたま市大宮区,仙台市青葉区,仙台市宮城野区,浜松市中区,浜松市西区,静岡市葵区,静岡市駿河区,新潟市中央区,新潟市西区,岡山市北区,岡山市南区,倉敷市中央区,倉敷市児島区,長崎市中央区,長崎市西区,熊本市中央区,熊本市西区,宇都宮市中央区,宇都宮市西区,高松市中央区,高松市亀井町,松山市中央区,松山市南区,岐阜市岐阜市,岐阜市長良区,金沢市金沢市,金沢市尾山台,沼津市沼津市,沼津市東海市';
  
  WHILE i <= 100 DO
    INSERT INTO isuconp.address (id, address) VALUES (i, SUBSTRING_INDEX(SUBSTRING_INDEX(city_names, ',', i), ',', -1));
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;
CALL GenerateAddressData();


-- オーダーテーブル (isuconp.order)
DELIMITER //
CREATE PROCEDURE GenerateOrderData()
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 2000 DO
    INSERT INTO isuconp.order (id, user_id, to_address_id, status)
    VALUES (i, FLOOR(1 + RAND() * 500), FLOOR(1 + RAND() * 100), 
            CASE WHEN RAND() < 0.3 THEN 'PREPARING'
                 WHEN RAND() >= 0.3 AND RAND() < 0.6 THEN 'IN_SHIPPING'
                 ELSE 'SHIPPED' END);
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;
CALL GenerateOrderData();

-- オーダーディテールテーブル (isuconp.order_detail)
DELIMITER //
CREATE PROCEDURE GenerateOrderDetailData()
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 3000 DO
    INSERT INTO isuconp.order_detail (id, order_id, item_id, from_address_id)
    VALUES (i, FLOOR(1 + RAND() * 2000), FLOOR(1 + RAND() * 1000), FLOOR(1 + RAND() * 100));
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;
CALL GenerateOrderDetailData();
