export const ADD_CUSTOMER_QUERY = `
    INSERT INTO customers (
        first_name,
        last_name,
        birth_date
    ) VALUES ($1, $2, $3) RETURNING *;
`;

export const GET_CUSTOMERS_QUERY = `
    SELECT * FROM customers;
`;

export const GET_CUSTOMER_COUNT = `
    SELECT COUNT(*) FROM customers;
`;