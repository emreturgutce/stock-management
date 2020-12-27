export const ADD_SUPPLIER_QUERY = `
    INSERT INTO suppliers (
        first_name,
        last_name,
        birth_date
    ) VALUES ($1, $2, $3) RETURNING *;
`;

export const GET_SUPPLIERS_QUERY = `
    SELECT * FROM suppliers
`;

export const GET_SUPPLIER_BY_ID_QUERY = `
    SELECT * FROM suppliers WHERE id = $1
`;
