import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpjhpwzxmfhbijiodhvu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamhwd3p4bWZoYmlqaW9kaHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjc5ODksImV4cCI6MjA2MzkwMzk4OX0.uwv4h5WWi7_yKKv1Z2qdI8NgZvrQDYOfNPRFIOqn80c';

export const supabase = createClient(supabaseUrl, supabaseKey);
