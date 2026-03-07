-- Enable real-time for the follows table
-- Note: Postgres does not support 'IF EXISTS' in 'DROP TABLE' for publications.
-- If the table is already in the publication, the first command may fail,
-- but the second will ensure it is present.

BEGIN;
  -- Try to add the table. If it's already there, this might error, 
  -- so we do it simply to ensure membership.
  ALTER PUBLICATION supabase_realtime ADD TABLE follows;
COMMIT;
