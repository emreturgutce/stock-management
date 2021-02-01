export const ADD_INVOICE_QUERY = `
    INSERT INTO invoices (serial_number, price) VALUES ($1, $2) RETURNING *;
`;
export const GET_INVOICES_QUERY = `
    SELECT * FROM invoices;
`;
export const GET_INVOICE_BY_ID_QUERY = `
    SELECT * FROM invoices WHERE id = $1
`;
export const ADD_SALE_QUERY = `
    INSERT INTO sales (
        customer_id,
        personel_id,
        car_id,
        invoice_id,
        sale_date
    ) VALUES ($1, $2, $3, $4, $5)  RETURNING *;
`;
export const GET_SALES_QUERY = `
    SELECT * FROM sales;
`;
export const GET_SALE_BY_ID_QUERY = `
    SELECT * FROM sales WHERE id = $1;
`;
export const GET_SALES_BETWEEN_TWO_DATES = `
    SELECT COUNT(*), sale_date 
    FROM sales 
    WHERE sale_date 
    BETWEEN $1 AND $2 
    GROUP BY sale_date;
`;
export const GET_TOTAL_PROFIT = `
    select SUM(invoices.price - cars.purchase_price) AS profit from sales
        inner join cars on sales.car_id = cars.id
        inner join invoices on invoices.id = sales.invoice_id;
`;
