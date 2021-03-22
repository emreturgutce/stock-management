export const ADD_CAR_COLOR_QUERY = `
    INSERT INTO car_colors (name) VALUES ($1) RETURNING *;
`;
export const GET_CAR_COLORS_QUERY = `
    SELECT * FROM car_colors;
`;
export const ADD_CAR_MANUFACTURER_QUERY = `
    INSERT INTO car_manufacturers (name) VALUES ($1) RETURNING *;
`;
export const GET_CAR_MANUFACTURER_QUERY = `
    SELECT * FROM car_manufacturers;
`;
export const ADD_CAR_QUERY = `
    INSERT INTO cars (
        title,
        sale_price,
        purchase_price,
        is_sold,
        description,
        model,
        year,
        is_new,
        enter_date,
        supplier_id,
        personel_id,
        car_manufacturer_id,
        car_color_code
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
`;
export const GET_CARS_QUERY = `
    SELECT *, cars.id AS car_id, cars.description AS car_description, car_colors.name AS car_color, car_manufacturers.name AS car_brand
    FROM cars 
    JOIN car_colors 
    ON car_colors.id = cars.car_color_code
    JOIN car_manufacturers
    ON car_manufacturers.id = cars.car_manufacturer_id;
`;
export const GET_CARS_QUERY_NEW = `
    SELECT 
        cars.id AS car_id, 
        cars.title,
        cars.description,
        cars.sale_price,
        cars.purchase_price,
        cars.is_sold,
        cars.model,
        cars.year,
        cars.is_new,
        cars.enter_date,
        cars.car_color_code,
        cars.car_manufacturer_id,
        cars.supplier_id,
        cars.personel_id AS id,
        cars.state,
        car_colors.name AS car_color, 
        car_manufacturers.name AS car_brand,
        personels.first_name,
        personels.last_name,
        car_images.image_urls,
        cars.is_deleted
    FROM cars
        LEFT JOIN (
            SELECT car_id, string_agg(image_url, ';') AS image_urls 
            FROM car_images 
            GROUP BY car_id) AS car_images
        ON car_images.car_id = cars.id
        JOIN car_colors
        ON car_colors.id = cars.car_color_code
        JOIN car_manufacturers
        ON car_manufacturers.id = cars.car_manufacturer_id
        JOIN personels
        ON cars.personel_id = personels.id
    WHERE is_deleted = false;
`;
export const GET_CAR_BY_ID_QUERY = `
    SELECT * FROM cars WHERE id = $1
`;
export const MARK_CAR_AS_SOLD_QUERY = `
    UPDATE cars SET is_sold = 'SOLD' WHERE id = $1;
`;
export const DELETE_CAR_BY_ID = `
    UPDATE cars SET is_deleted = true WHERE id = $1;
`;
export const ADD_CAR_IMAGE = `
    INSERT INTO car_images (image_url, car_id) VALUES ($1, $2);
`;

export const GET_CAR_IMAGES_BY_ID = `
    SELECT image_url FROM car_images WHERE car_id = $1;
`;
export const UPDATE_CAR_BY_ID = `
    UPDATE cars 
    SET title = $1, description = $2, sale_price = $3, purchase_price = $4, enter_date = $5, year = $6, 
        model = $7, is_new = $8, car_color_code = $9, car_manufacturer_id= $10, supplier_id = $11
    WHERE id = $12;
`;
export const DELETE_CAR_IMAGE = `
    delete from car_images where car_id = $1 and image_url = $2;
`;
export const ADD_CARS_QUERY = `
    INSERT INTO cars (
        title,
        description,
        sale_price,
        purchase_price,
        enter_date,
        year,
        model,
        is_new,
        car_color_code,
        car_manufacturer_id,
        supplier_id,
        personel_id
    ) VALUES %L;
`;
export const ADD_MULTI_CAR_IMAGE = `
    INSERT INTO car_images (image_url, car_id) VALUES %L;
`;
export const DELETE_MULTI_CAR_IMAGE = `
    delete from car_images where car_id = %L and image_url in (%L);
`;
export const GET_CAR_FROM_AWAITING_LIST = `
    SELECT * FROM awaiting_list JOIN actions ON actions.id = action_id WHERE awaiting_list.id = $1;
`;
export const ADD_DELETE_CAR_ACTION = `
    INSERT INTO actions (type) VALUES ('DELETE') RETURNING id;
`;
export const ADD_SELL_CAR_ACTION = `
    INSERT INTO actions (
        type,
        customer_first_name,
        customer_last_name,
        customer_birth_date,
        invoice_serial_number,
        invoice_price,
        sale_date
    ) VALUES ('SELL', $1, $2, $3, $4, $5, $6) RETURNING id;
`;
export const ADD_ACTION_TO_AWAITING_LIST = `
    INSERT INTO awaiting_list (car_id, personel_id, action_id) 
    VALUES ($1, $2, $3);
`;
export const UPDATE_CAR_STATE_TO_AWAITING = `
    UPDATE cars SET state = 'WAITING' WHERE id = $1;
`;
export const GET_AWAITING_LIST = `
    SELECT awaiting_list.id AS awaiting_list_id, * 
    FROM awaiting_list 
    JOIN actions 
    ON actions.id = awaiting_list.action_id
    JOIN personels
    ON personels.id = awaiting_list.personel_id
    JOIN cars
    ON cars.id = awaiting_list.car_id
    WHERE is_fulfiled = false
    ORDER BY actions.created_at;
`;
export const GET_COMPLETED_EVENTS = `
    SELECT awaiting_list.id AS awaiting_list_id, * 
    FROM awaiting_list 
    JOIN actions 
    ON actions.id = awaiting_list.action_id
    JOIN personels
    ON personels.id = awaiting_list.personel_id
    JOIN cars
    ON cars.id = awaiting_list.car_id
    WHERE is_fulfiled = true
    ORDER BY actions.created_at DESC;
`;
export const CHECK_IF_CAR_IS_IN_WAITING_STATE = `
    SELECT 1 FROM cars WHERE id = $1 AND state = 'WAITING';
`;
export const DELETE_EVENT_FROM_AWAITING_LIST = `
    UPDATE awaiting_list SET is_fulfiled = true WHERE car_id = $1;
`;
export const UPDATE_CAR_STATE_TO_NONE = `
    UPDATE cars SET state = 'NONE' where id = $1;
`;
export const ABORT_EVENT = `
    UPDATE awaiting_list SET is_fulfiled = true, is_aborted = true WHERE car_id = $1;
`;