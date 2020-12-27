export const ADD_PERSONEL_QUERY = `
    INSERT INTO personels (
        first_name,
        last_name,
        birth_date,
        email,
        "password",
        gender,
        hire_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
`;

export const GET_PERSONELS_QUERY = `
    SELECT * FROM personels;
`;

export const GET_PERSONEL_BY_EMAIL = `
    SELECT * FROM personels WHERE email = $1 LIMIT 1;
`;
