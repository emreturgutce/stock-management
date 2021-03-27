CREATE DATABASE stock_management WITH template=template0 owner=postgres;

\connect stock_management;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE');

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE role_enum AS ENUM ('PERSONEL', 'ADMIN');

CREATE TABLE IF NOT EXISTS personels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    role role_enum NOT NULL DEFAULT 'PERSONEL',
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gender gender_enum,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS car_manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TYPE is_new_enum AS ENUM ('NEW', 'NOT NEW');
CREATE TYPE is_sold_enum AS ENUM ('SOLD', 'NOT SOLD');
CREATE TYPE car_state_enum AS ENUM ('WAITING', 'NONE');

CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL UNIQUE,
    sale_price DECIMAL NOT NULL,
    purchase_price DECIMAL NOT NULL,
    is_sold is_sold_enum NOT NULL DEFAULT 'NOT SOLD',
    description TEXT,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    is_new is_new_enum NOT NULL DEFAULT 'NEW',
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    enter_date DATE NOT NULL,
    supplier_id UUID NOT NULL,
    personel_id UUID NOT NULL,
    car_manufacturer_id UUID NOT NULL,
    car_color_code UUID NOT NULL,
    state car_state_enum NOT NULL DEFAULT 'NONE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE cars ADD CONSTRAINT cars_personels FOREIGN KEY (personel_id) REFERENCES personels(id) ON DELETE CASCADE;
ALTER TABLE cars ADD CONSTRAINT cars_suppliers FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE;
ALTER TABLE cars ADD CONSTRAINT cars_car_manufacturers FOREIGN KEY (car_manufacturer_id) REFERENCES car_manufacturers(id) ON DELETE CASCADE;
ALTER TABLE cars ADD CONSTRAINT cars_car_colors FOREIGN KEY (car_color_code) REFERENCES car_colors(id) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS car_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL UNIQUE,
    car_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE car_images ADD CONSTRAINT car_images_cars FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number INT NOT NULL UNIQUE,
    price INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
    PRIMARY KEY(customer_id, car_id),
    customer_id UUID NOT NULL,
    personel_id UUID NOT NULL,
    car_id UUID NOT NULL,
    invoice_id UUID NOT NULL,
    sale_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE sales ADD CONSTRAINT sales_customers FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_personels FOREIGN KEY (personel_id) REFERENCES personels(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_cars FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE;

CREATE TYPE car_action_type_enum AS ENUM ('DELETE', 'SELL');

CREATE TABLE IF NOT EXISTS actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type car_action_type_enum NOT NULL,
    customer_first_name VARCHAR(50),
    customer_last_name VARCHAR(50),
    customer_birth_date DATE,
    invoice_serial_number INT,
    invoice_price INT,
    sale_date Date,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS awaiting_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL,
    personel_id UUID NOT NULL,
    action_id UUID NOT NULL,
    is_fulfiled BOOLEAN NOT NULL DEFAULT false,
    is_aborted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE awaiting_list ADD CONSTRAINT awaiting_list_cars FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
ALTER TABLE awaiting_list ADD CONSTRAINT awaiting_list_personels FOREIGN KEY (personel_id) REFERENCES personels(id) ON DELETE CASCADE;
ALTER TABLE awaiting_list ADD CONSTRAINT awaiting_list_actions FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE;

/*
    Renkleri ekle
*/
INSERT INTO car_colors (name) VALUES ('bej');
INSERT INTO car_colors (name) VALUES ('beyaz');
INSERT INTO car_colors (name) VALUES ('bordo');
INSERT INTO car_colors (name) VALUES ('füme');
INSERT INTO car_colors (name) VALUES ('gri');
INSERT INTO car_colors (name) VALUES ('gümüş gri');
INSERT INTO car_colors (name) VALUES ('kırmızı');
INSERT INTO car_colors (name) VALUES ('mor');
INSERT INTO car_colors (name) VALUES ('lacivert');
INSERT INTO car_colors (name) VALUES ('mavi');
INSERT INTO car_colors (name) VALUES ('pembe');
INSERT INTO car_colors (name) VALUES ('sarı');
INSERT INTO car_colors (name) VALUES ('siyah');
INSERT INTO car_colors (name) VALUES ('şampanya');
INSERT INTO car_colors (name) VALUES ('turkuaz');
INSERT INTO car_colors (name) VALUES ('turuncu');
INSERT INTO car_colors (name) VALUES ('yeşil');

/* Üretici Ekle */
INSERT INTO car_manufacturers (name) VALUES ('Volkswagen');
INSERT INTO car_manufacturers (name) VALUES ('Maruti Suzuki');
INSERT INTO car_manufacturers (name) VALUES ('Tesla');
INSERT INTO car_manufacturers (name) VALUES ('AUDİ');
INSERT INTO car_manufacturers (name) VALUES ('Nissan');
INSERT INTO car_manufacturers (name) VALUES ('Honda');
INSERT INTO car_manufacturers (name) VALUES ('Ford');
INSERT INTO car_manufacturers (name) VALUES ('BMW');
INSERT INTO car_manufacturers (name) VALUES ('Mercedes Benz');
INSERT INTO car_manufacturers (name) VALUES ('Toyota');
INSERT INTO car_manufacturers (name) VALUES ('Volvo');
INSERT INTO car_manufacturers (name) VALUES ('Peugeot');
INSERT INTO car_manufacturers (name) VALUES ('Skoda');
INSERT INTO car_manufacturers (name) VALUES ('Renault');
INSERT INTO car_manufacturers (name) VALUES ('Fiat');
INSERT INTO car_manufacturers (name) VALUES ('Citroen');
INSERT INTO car_manufacturers (name) VALUES ('Hyundai');
INSERT INTO car_manufacturers (name) VALUES ('Jeep');
INSERT INTO car_manufacturers (name) VALUES ('Mini');
INSERT INTO car_manufacturers (name) VALUES ('Opel');
INSERT INTO car_manufacturers (name) VALUES ('Dacia');

/* Tedarikçi Ekle */
INSERT INTO suppliers (first_name, last_name) VALUES  ('Delal Abdullatif', 'Abzak');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Fatma Özlem', 'Acar');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Özde', 'Acarkan');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Atahan', 'Adanır');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Hacı Mehmet', 'Adıgüzel');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Mükerrem Zeynep', 'Ağca');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Bestami', 'Ağırağaç');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Aykanat', 'Ağıroğlu');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Şennur', 'Ağnar');
INSERT INTO suppliers (first_name, last_name) VALUES  ('Tutkum', 'Ahmadı Asl');

/* Personel Ekle */
INSERT INTO personels (first_name, last_name, birth_date, email, password, gender, hire_date, role)
VALUES ('Emre', 'Turgut', '2000-06-23', 'emreturgut@mail.com', crypt('123456', gen_salt('bf', 4)), 'MALE', '2021-01-01', 'ADMIN');

INSERT INTO personels (first_name, last_name, birth_date, email, password, gender, hire_date)
VALUES ('Emre', 'Turgut', '2000-06-23', 'emreturgut1@mail.com', crypt('123456', gen_salt('bf', 4)), 'MALE', '2021-01-01');

/* Araba Ekle */
INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Toyota Yaris Yeni 1.5 Dream e-CVT', 299200, 270000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'Yaris',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Toyota'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'beyaz'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 BMW 1 Serisi 1.5 116d', 414200, 400000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'1 Serisi',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'BMW'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'mavi'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Suzuki Swift 1.2 Hibrit GL Techno CVT', 216900, 200000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'Swift',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Maruti Suzuki'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'kırmızı'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Volvo S90 2.0 D5 Inscription Plus', 938350, 920000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'S90',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Volvo'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'gümüş gri'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Mercedes A Serisi A180 1.4 Style', 386000, 370000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'A Serisi',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Mercedes Benz'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'gümüş gri'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Peugeot 208 1.5 BlueHDi Signature', 192500, 180000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'208',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Peugeot'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'kırmızı'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Ford Fiesta 1.0 Style AT', 203400, 194000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'Fiesta',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Ford'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'kırmızı'));

INSERT INTO cars (title, sale_price, purchase_price, description, model, year, enter_date, 
supplier_id, personel_id, car_manufacturer_id, car_color_code)
VALUES ('2020 Jeep Renegade 1.0 Sport', 284450, 270000, 
'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
'Renegade',
2020, '2021-01-01', 
(SELECT id AS supplier_id FROM suppliers LIMIT 1), 
(SELECT id AS personel_id FROM personels LIMIT 1), 
(SELECT id AS car_manufacturer_id FROM car_manufacturers WHERE name = 'Jeep'), 
(SELECT id AS car_color_code FROM car_colors WHERE name = 'mavi'));
