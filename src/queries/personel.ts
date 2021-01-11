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

export const GET_PERSONEL_BY_ID = `
    SELECT * FROM personels WHERE id = $1 LIMIT 1;
`;
export const CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID = `
    SELECT 1 FROM personels WHERE id = $1;
`;
export const DELETE_PERSONELS = `
    DELETE FROM personels;
`;
