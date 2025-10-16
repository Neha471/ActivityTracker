// Activity Queries
export const CREATE_ACTIVITY = `
  INSERT INTO neha.activities 
    (user_id, title, category, frequency, notes)
  VALUES 
    ($1, $2, $3, $4, $5)
  RETURNING id, user_id, title, category, frequency, notes, is_active, created_at, updated_at
`;

export const GET_ACTIVITY_BY_ID = `
  SELECT id, user_id, title, category, frequency, notes, is_active, created_at, updated_at
  FROM neha.activities 
  WHERE id = $1 AND user_id = $2
`;

export const GET_ALL_ACTIVITIES = `
  SELECT id, user_id, title, category, frequency, notes, is_active, created_at, updated_at
  FROM neha.activities
  WHERE user_id = $1
  ORDER BY created_at DESC
`;

export const UPDATE_ACTIVITY = `
  UPDATE neha.activities 
  SET 
    title = COALESCE($3, title),
    category = COALESCE($4, category),
    frequency = COALESCE($5, frequency),
    notes = COALESCE($6, notes),
    is_active = COALESCE($7, is_active),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1 AND user_id = $2
  RETURNING id, user_id, title, category, frequency, notes, is_active, created_at, updated_at
`;

export const DELETE_ACTIVITY = `
  DELETE FROM neha.activities 
  WHERE id = $1 AND user_id = $2
  RETURNING id
`;

export const ACTIVITY_EXISTS = `
  SELECT EXISTS(
    SELECT 1 FROM neha.activities 
    WHERE id = $1 AND user_id = $2
  )
`;
