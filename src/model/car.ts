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
    SELECT * FROM cars;
`;
export const GET_CAR_BY_ID_QUERY = `
    SELECT * FROM cars WHERE id = $1
`;
export const EDIT_CAR_QUERY = ``;
