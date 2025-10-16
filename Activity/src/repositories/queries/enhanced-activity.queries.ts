// Enhanced Activity Queries

// ==================== CATEGORY QUERIES ====================

export const CREATE_CATEGORY = `
  INSERT INTO neha.activity_categories 
    (user_id, name, color, icon)
  VALUES 
    ($1, $2, $3, $4)
  RETURNING id, user_id, name, color, icon, created_at, updated_at
`;

export const GET_ALL_CATEGORIES = `
  SELECT id, user_id, name, color, icon, created_at, updated_at
  FROM neha.activity_categories
  WHERE user_id = $1
  ORDER BY name ASC
`;

export const GET_CATEGORY_BY_ID = `
  SELECT id, user_id, name, color, icon, created_at, updated_at
  FROM neha.activity_categories 
  WHERE id = $1 AND user_id = $2
`;

export const UPDATE_CATEGORY = `
  UPDATE neha.activity_categories 
  SET 
    name = COALESCE($3, name),
    color = COALESCE($4, color),
    icon = COALESCE($5, icon),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1 AND user_id = $2
  RETURNING id, user_id, name, color, icon, created_at, updated_at
`;

export const DELETE_CATEGORY = `
  DELETE FROM neha.activity_categories 
  WHERE id = $1 AND user_id = $2
  RETURNING id
`;

export const CATEGORY_EXISTS = `
  SELECT EXISTS(
    SELECT 1 FROM neha.activity_categories 
    WHERE id = $1 AND user_id = $2
  )
`;

// ==================== ACTIVITY QUERIES ====================

export const CREATE_ACTIVITY = `
  INSERT INTO neha.activities 
    (user_id, title, description, category_id, frequency_type, frequency_value, 
     frequency_period, frequency_specific_days, color, icon, notes)
  VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING 
    id, user_id, title, description, category_id, frequency_type, 
    frequency_value, frequency_period, frequency_specific_days, 
    color, icon, notes, is_active, streak, total_completions, 
    consistency, last_completed, created_at, updated_at
`;

export const GET_ACTIVITY_BY_ID = `
  SELECT 
    a.id, a.user_id, a.title, a.description, a.category_id, 
    a.frequency_type, a.frequency_value, a.frequency_period, 
    a.frequency_specific_days, a.color, a.icon, a.notes, 
    a.is_active, a.streak, a.total_completions, a.consistency, 
    a.last_completed, a.created_at, a.updated_at,
    c.id as category_id, c.name as category_name, 
    c.color as category_color, c.icon as category_icon
  FROM neha.activities a
  JOIN neha.activity_categories c ON a.category_id = c.id
  WHERE a.id = $1 AND a.user_id = $2
`;

export const GET_ALL_ACTIVITIES = `
  SELECT 
    a.id, a.user_id, a.title, a.description, a.category_id, 
    a.frequency_type, a.frequency_value, a.frequency_period, 
    a.frequency_specific_days, a.color, a.icon, a.notes, 
    a.is_active, a.streak, a.total_completions, a.consistency, 
    a.last_completed, a.created_at, a.updated_at,
    c.id as category_id, c.name as category_name, 
    c.color as category_color, c.icon as category_icon
  FROM neha.activities a
  JOIN neha.activity_categories c ON a.category_id = c.id
  WHERE a.user_id = $1
  ORDER BY a.created_at DESC
`;

export const UPDATE_ACTIVITY = `
  UPDATE neha.activities 
  SET 
    title = COALESCE($3, title),
    description = COALESCE($4, description),
    category_id = COALESCE($5, category_id),
    frequency_type = COALESCE($6, frequency_type),
    frequency_value = COALESCE($7, frequency_value),
    frequency_period = COALESCE($8, frequency_period),
    frequency_specific_days = COALESCE($9, frequency_specific_days),
    color = COALESCE($10, color),
    icon = COALESCE($11, icon),
    notes = COALESCE($12, notes),
    is_active = COALESCE($13, is_active),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1 AND user_id = $2
  RETURNING 
    id, user_id, title, description, category_id, frequency_type, 
    frequency_value, frequency_period, frequency_specific_days, 
    color, icon, notes, is_active, streak, total_completions, 
    consistency, last_completed, created_at, updated_at
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

// ==================== ACTIVITY LOG QUERIES ====================

export const CREATE_ACTIVITY_LOG = `
  INSERT INTO neha.activity_logs 
    (activity_id, user_id, date, status, notes, completed_at)
  VALUES 
    ($1, $2, $3, $4, $5, $6)
  ON CONFLICT (activity_id, date) 
  DO UPDATE SET 
    status = EXCLUDED.status,
    notes = EXCLUDED.notes,
    completed_at = EXCLUDED.completed_at,
    updated_at = CURRENT_TIMESTAMP
  RETURNING id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
`;

export const GET_ACTIVITY_LOGS = `
  SELECT id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
  FROM neha.activity_logs
  WHERE user_id = $1
  ORDER BY date DESC
`;

export const GET_ACTIVITY_LOGS_BY_DATE_RANGE = `
  SELECT id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
  FROM neha.activity_logs
  WHERE user_id = $1 AND date >= $2 AND date <= $3
  ORDER BY date DESC
`;

export const GET_ACTIVITY_LOGS_FOR_ACTIVITY = `
  SELECT id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
  FROM neha.activity_logs
  WHERE activity_id = $1 AND user_id = $2
  ORDER BY date DESC
`;

export const GET_ACTIVITY_LOG_BY_DATE = `
  SELECT id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
  FROM neha.activity_logs
  WHERE activity_id = $1 AND date = $2
`;

export const UPDATE_ACTIVITY_LOG = `
  UPDATE neha.activity_logs 
  SET 
    status = COALESCE($4, status),
    notes = COALESCE($5, notes),
    completed_at = COALESCE($6, completed_at),
    updated_at = CURRENT_TIMESTAMP
  WHERE activity_id = $1 AND date = $2 AND user_id = $3
  RETURNING id, activity_id, user_id, date, status, notes, completed_at, created_at, updated_at
`;

export const DELETE_ACTIVITY_LOG = `
  DELETE FROM neha.activity_logs 
  WHERE activity_id = $1 AND date = $2 AND user_id = $3
  RETURNING id
`;

// ==================== STATISTICS QUERIES ====================

export const GET_ACTIVITY_STATS = `
  SELECT 
    COUNT(DISTINCT a.id) as total_activities,
    COUNT(CASE WHEN l.date = CURRENT_DATE AND l.status = 'completed' THEN 1 END) as completed_today,
    COUNT(CASE WHEN l.date = CURRENT_DATE AND l.status = 'pending' THEN 1 END) as pending_today,
    ROUND(AVG(a.consistency), 2) as avg_consistency,
    SUM(a.streak) as total_streak
  FROM neha.activities a
  LEFT JOIN neha.activity_logs l ON a.id = l.activity_id
  WHERE a.user_id = $1 AND a.is_active = true
`;

export const GET_MOST_CONSISTENT_ACTIVITY = `
  SELECT 
    a.id, a.user_id, a.title, a.description, a.category_id, 
    a.frequency_type, a.frequency_value, a.frequency_period, 
    a.frequency_specific_days, a.color, a.icon, a.notes, 
    a.is_active, a.streak, a.total_completions, a.consistency, 
    a.last_completed, a.created_at, a.updated_at,
    c.id as category_id, c.name as category_name, 
    c.color as category_color, c.icon as category_icon
  FROM neha.activities a
  JOIN neha.activity_categories c ON a.category_id = c.id
  WHERE a.user_id = $1 AND a.is_active = true
  ORDER BY a.consistency DESC, a.streak DESC
  LIMIT 1
`;

export const GET_MOST_MISSED_ACTIVITY = `
  SELECT 
    a.id, a.user_id, a.title, a.description, a.category_id, 
    a.frequency_type, a.frequency_value, a.frequency_period, 
    a.frequency_specific_days, a.color, a.icon, a.notes, 
    a.is_active, a.streak, a.total_completions, a.consistency, 
    a.last_completed, a.created_at, a.updated_at,
    c.id as category_id, c.name as category_name, 
    c.color as category_color, c.icon as category_icon
  FROM neha.activities a
  JOIN neha.activity_categories c ON a.category_id = c.id
  WHERE a.user_id = $1 AND a.is_active = true
  ORDER BY a.consistency ASC, a.streak ASC
  LIMIT 1
`;

export const GET_ACTIVITY_PROGRESS = `
  WITH activity_stats AS (
    SELECT 
      l.activity_id,
      COUNT(*) as total_days,
      COUNT(CASE WHEN l.status = 'completed' THEN 1 END) as completed_days,
      COUNT(CASE WHEN l.status = 'missed' THEN 1 END) as missed_days,
      MAX(CASE WHEN l.status = 'completed' THEN l.date END) as last_completed_date
    FROM neha.activity_logs l
    WHERE l.activity_id = $1 AND l.date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY l.activity_id
  ),
  last_seven_days AS (
    SELECT 
      l.activity_id,
      array_agg(COALESCE(l.status, 'pending') ORDER BY l.date DESC) as last_seven_status
    FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') dates(date)
    LEFT JOIN neha.activity_logs l ON l.activity_id = $1 AND l.date = dates.date
    GROUP BY l.activity_id
  )
  SELECT 
    s.activity_id,
    s.total_days,
    s.completed_days,
    s.missed_days,
    a.streak as current_streak,
    s.completed_days as longest_streak, -- Simplified for now
    CASE 
      WHEN s.total_days = 0 THEN 0 
      ELSE ROUND((s.completed_days::DECIMAL / s.total_days::DECIMAL) * 100, 2) 
    END as consistency_rate,
    COALESCE(lsd.last_seven_status, ARRAY[]::VARCHAR[]) as last_seven_days
  FROM activity_stats s
  JOIN neha.activities a ON s.activity_id = a.id
  LEFT JOIN last_seven_days lsd ON s.activity_id = lsd.activity_id
  WHERE s.activity_id = $1
`;