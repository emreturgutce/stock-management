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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;
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
    SELECT *, cars.id AS car_id, cars.description AS car_description, car_colors.name AS car_color, car_manufacturers.name AS car_brand
    FROM cars
        LEFT JOIN (SELECT car_id, string_agg(image_url, ';') AS image_urls FROM car_images GROUP BY car_id) AS car_images
        ON car_images.car_id = cars.id
        JOIN car_colors
        ON car_colors.id = cars.car_color_code
        JOIN car_manufacturers
        ON car_manufacturers.id = cars.car_manufacturer_id
        JOIN personels
        ON cars.personel_id = personels.id;
`;
export const GET_CAR_BY_ID_QUERY = `
    SELECT * FROM cars WHERE id = $1
`;
export const MARK_CAR_AS_SOLD_QUERY = `
    UPDATE cars SET is_sold = 'SOLD' WHERE id = $1;
`;
export const DELETE_CAR_BY_ID = `
    DELETE FROM cars WHERE id = $1;
`;
export const ADD_CAR_IMAGE = `
    INSERT INTO car_images (image_url, car_id) VALUES ($1, $2);
`;

export const GET_CAR_IMAGES_BY_ID = `
    SELECT image_url FROM car_images WHERE car_id = $1 LIMIT 1;
`;
export const UPDATE_CAR_BY_ID = `
    UPDATE cars 
    SET title = $1, description = $2, sale_price = $3, purchase_price = $4, enter_date = $5, year = $6, 
        model = $7, is_new = $8, car_color_code = $9, car_manufacturer_id= $10, supplier_id = $11
    WHERE id = $12;
`;
