// User Queries
export const CREATE_USER = `
  INSERT INTO neha.users 
    (email, password_hash, first_name, last_name, is_verified)
  VALUES 
    ($1, $2, $3, $4, $5)
  RETURNING id, email, first_name, last_name, is_active, is_verified, created_at, updated_at
`;

export const FIND_USER_BY_EMAIL = `
  SELECT * FROM neha.users 
  WHERE email = $1
`;

export const FIND_USER_BY_ID = `
  SELECT id, email, first_name, last_name, is_active, is_verified, created_at, updated_at 
  FROM neha.users 
  WHERE id = $1
`;

export const UPDATE_USER = `
  UPDATE neha.users 
  SET 
    first_name = COALESCE($2, first_name),
    last_name = COALESCE($3, last_name),
    is_active = COALESCE($4, is_active),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING id, email, first_name, last_name, is_active, is_verified, created_at, updated_at
`;

export const UPDATE_PASSWORD = `
  UPDATE neha.users 
  SET 
    password_hash = $2,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1
`;

export const DELETE_USER = `
  DELETE FROM neha.users 
  WHERE id = $1
`;

// Refresh Token Queries
export const CREATE_REFRESH_TOKEN = `
  INSERT INTO neha.refresh_tokens 
    (user_id, token, expires_at, created_by_ip)
  VALUES 
    ($1, $2, $3, $4)
  RETURNING *
`;

export const FIND_REFRESH_TOKEN = `
  SELECT * FROM neha.refresh_tokens 
  WHERE token = $1 AND revoked_at IS NULL
`;

export const REVOKE_REFRESH_TOKEN = `
  UPDATE neha.refresh_tokens 
  SET 
    revoked_at = CURRENT_TIMESTAMP,
    revoked_by_ip = $2
  WHERE token = $1 AND revoked_at IS NULL
`;

export const REVOKE_USER_REFRESH_TOKENS = `
  UPDATE neha.refresh_tokens 
  SET 
    revoked_at = CURRENT_TIMESTAMP,
    revoked_by_ip = $2
  WHERE user_id = $1 AND revoked_at IS NULL
`;
