-- Remove master admin infrastructure completely
DROP TABLE IF EXISTS admin_login_history CASCADE;
DROP TABLE IF EXISTS master_admin CASCADE;
DROP FUNCTION IF EXISTS validate_master_admin_session(text);