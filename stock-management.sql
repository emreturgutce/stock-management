CREATE DATABASE stock_management WITH template=template0 owner=postgres;

\connect stock_management;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE');

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE
);

/*
    TODO = personel maaşı ve personel ünvanı tabloları eklenebilir
*/

CREATE TABLE IF NOT EXISTS personels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    gender gender_enum,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS car_manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS car_colors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TYPE is_new_enum AS ENUM ('NEW', 'NOT NEW');
CREATE TYPE is_sold_enum AS ENUM ('SOLD', 'NOT SOLD');

CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL UNIQUE,
    sale_price DECIMAL NOT NULL,
    purchase_price DECIMAL NOT NULL,
    is_sold is_sold_enum NOT NULL,
    description TEXT,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    is_new is_new_enum NOT NULL,
    enter_date DATE NOT NULL,
    supplier_id UUID NOT NULL,
    personel_id UUID NOT NULL,
    car_manufacturer_id UUID NOT NULL,
    car_color_code UUID NOT NULL,
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
    car_id UUID NOT NULL
);

ALTER TABLE car_images ADD CONSTRAINT car_images_cars FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number INT NOT NULL UNIQUE,
    price INT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
    PRIMARY KEY(customer_id, car_id),
    customer_id UUID NOT NULL,
    personel_id UUID NOT NULL,
    car_id UUID NOT NULL,
    invoice_id UUID NOT NULL,
    sale_date DATE NOT NULL
);

ALTER TABLE sales ADD CONSTRAINT sales_customers FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_personels FOREIGN KEY (personel_id) REFERENCES personels(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_cars FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
ALTER TABLE sales ADD CONSTRAINT sales_invoices FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE;
