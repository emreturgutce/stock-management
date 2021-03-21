export const ADD_PERSONEL_QUERY = `
    INSERT INTO personels (
        first_name,
        last_name,
        birth_date,
        email,
        "password",
        gender,
        hire_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
`;
export const ADD_ADMIN_PERSONEL_QUERY = `
    INSERT INTO personels (
        first_name,
        last_name,
        birth_date,
        email,
        "password",
        gender,
        hire_date,
        role
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
`;
export const GET_PERSONELS_QUERY = `
    SELECT * FROM personels WHERE id != $1;
`;

export const GET_PERSONEL_BY_EMAIL = `
    SELECT  
        id,
        first_name,
        last_name,
        verified,
        birth_date,
        email,
        gender,
        password,
        role
    FROM personels 
    WHERE email = $1 
    LIMIT 1;
`;

export const GET_PERSONEL_BY_ID = `
    SELECT * FROM personels WHERE id = $1 LIMIT 1;
`;
export const CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID = `
    SELECT 1 FROM personels WHERE id = $1;
`;
export const CHECK_IF_PERSONEL_EXISTS_WITH_THE_ID_AND_ROLE = `
    SELECT 1 FROM personels WHERE id = $1 AND role = $2;
`;
export const DELETE_PERSONELS = `
    DELETE FROM personels;
`;
export const UPDATE_PERSONEL_BY_ID = `
    UPDATE personels
    SET 
        first_name = $1, 
        last_name = $2, 
        email = $3, 
        birth_date = $4, 
        gender = $5
    WHERE id = $6;
`;
export const VERIFY_PERSONEL_EMAIL = `
    UPDATE personels SET verified = TRUE WHERE id = $1;
`;
export const CHANGE_PASSWORD = `
    UPDATE personels SET password = $1 WHERE id = $2;
`;
export const CHECK_IF_PERSONEL_EXISTS_WITH_THE_EMAIL = `
    SELECT id FROM personels WHERE email = $1 AND verified = true;
`;
export const DELETE_PERSONEL_BY_ID = `
    DELETE FROM personels WHERE id = $1;
`;
export const ENHANCE_PERSONEL_ROLE = `
    UPDATE personels SET role = 'ADMIN' WHERE id = $1 and role != 'ADMIN';
`;
export const DROP_PERSONEL_ROLE = `
    UPDATE personels SET role = 'PERSONEL' WHERE id = $1 and role != 'PERSONEL';
`;