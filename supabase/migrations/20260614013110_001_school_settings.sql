-- School Settings Table
CREATE TABLE IF NOT EXISTS school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name VARCHAR(255) NOT NULL DEFAULT 'Sandipani Smart School',
  school_logo_url TEXT,
  principal_name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  established_year INTEGER,
  board_affiliation VARCHAR(100),
  tagline TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO school_settings (school_name, principal_name, address, city, state, pincode, phone, email, website, established_year, board_affiliation, tagline, description)
VALUES (
  'Sandipani Smart School',
  'Dr. Rajesh Kumar',
  '123 Education Street, Knowledge Park',
  'Bhopal',
  'Madhya Pradesh',
  '462001',
  '+91 755 1234567',
  'info@sandipani.edu',
  'www.sandipani.edu',
  2010,
  'CBSE Affiliation No. 1020304',
  'Nurturing Minds, Building Futures',
  'A premier educational institution committed to excellence in academics and holistic development of students.'
);

-- Enable RLS
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_settings
CREATE POLICY "select_school_settings" ON school_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "update_school_settings" ON school_settings FOR UPDATE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Timetable Table
CREATE TABLE IF NOT EXISTS timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  period INTEGER NOT NULL CHECK (period >= 1 AND period <= 8),
  subject VARCHAR(100) NOT NULL,
  teacher_id TEXT REFERENCES teachers(id) ON DELETE SET NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NOT NULL,
  room VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, day, period)
);

-- Enable RLS on timetables
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_timetables" ON timetables FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_timetables" ON timetables FOR INSERT
  TO authenticated WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "update_timetables" ON timetables FOR UPDATE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "delete_timetables" ON timetables FOR DELETE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Notices/Announcements Table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  notice_type VARCHAR(50) DEFAULT 'general' CHECK (notice_type IN ('general', 'academic', 'event', 'holiday', 'exam', 'emergency')),
  target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')),
  class_id TEXT REFERENCES classes(id) ON DELETE CASCADE,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_active BOOLEAN DEFAULT true,
  published_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on notices
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_notices" ON notices FOR SELECT
  TO authenticated USING (is_active = true);

CREATE POLICY "insert_notices" ON notices FOR INSERT
  TO authenticated WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "update_notices" ON notices FOR UPDATE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "delete_notices" ON notices FOR DELETE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Fees Table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
  payment_mode VARCHAR(50),
  receipt_no VARCHAR(100),
  academic_year VARCHAR(20),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on fees
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_fees" ON fees FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_fees" ON fees FOR INSERT
  TO authenticated WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "update_fees" ON fees FOR UPDATE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Exam Results Table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_type VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  max_marks DECIMAL(5,2) NOT NULL,
  grade VARCHAR(10),
  exam_date DATE,
  academic_year VARCHAR(20),
  remarks TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on exam_results
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_exam_results" ON exam_results FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_exam_results" ON exam_results FOR INSERT
  TO authenticated WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "update_exam_results" ON exam_results FOR UPDATE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'teacher'));

CREATE POLICY "delete_exam_results" ON exam_results FOR DELETE
  TO authenticated USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_timetables_class_day ON timetables(class_id, day);
CREATE INDEX IF NOT EXISTS idx_notices_active ON notices(is_active, published_date);
CREATE INDEX IF NOT EXISTS idx_fees_student_status ON fees(student_id, status);
CREATE INDEX IF NOT EXISTS idx_exam_results_student ON exam_results(student_id, exam_type);