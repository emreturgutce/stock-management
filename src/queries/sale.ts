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
export const GET_TOTAL_REVENUE = `
    select SUM(invoices.price) AS revenue from sales
        inner join invoices on invoices.id = sales.invoice_id;
`;
export const GET_FULL_SALE_INFO = `
    select 
        sales.sale_date, 
        invoices.serial_number, 
        invoices.price, 
        customers.first_name as customer_first_name, 
        customers.last_name as customer_last_name, 
        personels.first_name as personel_first_name, 
        personels.last_name as personel_last_name, 
        personels.email as personel_email,
        cars.title, 
        cars.description, 
        cars.model, 
        cars.year, 
        cars.is_new
    from sales 
    join invoices on invoices.id = sales.invoice_id 
    join customers on customers.id = sales.customer_id 
    join personels on personels.id = sales.personel_id
    join cars on cars.id = sales.car_id
    where sales.car_id = $1;
`;

export const GET_LAST_FIVE_SALES = `
    select title, first_name, last_name, purchase_price, serial_number, sale_date, price, cars.id AS car_id
    from sales
        join customers on customers.id = customer_id
        join invoices on invoices.id = sales.invoice_id
        join cars on cars.id = car_id
    order by sale_date desc
    limit 5;
`;
