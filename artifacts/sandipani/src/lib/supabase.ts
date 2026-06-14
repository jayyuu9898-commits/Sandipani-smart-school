import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SchoolSettings = {
  id: string;
  school_name: string;
  school_logo_url: string | null;
  principal_name: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  established_year: number | null;
  board_affiliation: string | null;
  tagline: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type TimetableEntry = {
  id: string;
  class_id: string;
  day: string;
  period: number;
  subject: string;
  teacher_id: string | null;
  start_time: string;
  end_time: string;
  room: string | null;
  created_at: string;
  updated_at: string;
};

export type Notice = {
  id: string;
  title: string;
  content: string;
  notice_type: string;
  target_audience: string;
  class_id: string | null;
  priority: string;
  is_active: boolean;
  published_date: string;
  expiry_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ExamResult = {
  id: string;
  student_id: string;
  exam_type: string;
  subject: string;
  marks_obtained: number;
  max_marks: number;
  grade: string | null;
  exam_date: string | null;
  academic_year: string | null;
  remarks: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentRecord = {
  id: string;
  full_name: string;
  roll_no: number;
  class_name: string;
  section: string;
  stream: string | null;
  additional_subject: string | null;
  gender: string | null;
  date_of_birth: string | null;
  parent_name: string | null;
  parent_mobile: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export type TeacherRecord = {
  id: string;
  full_name: string;
  subject: string;
  email: string | null;
  phone: string | null;
  assigned_classes: string[] | null;
  created_at: string;
};

export type ClassRecord = {
  id: string;
  name: string;
  section: string;
  teacher_id: string | null;
  student_count: number | null;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  student_id: string;
  class_id: string | null;
  date: string;
  status: string;
  marked_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
