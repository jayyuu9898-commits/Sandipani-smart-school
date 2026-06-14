-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES profiles(id),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Enable RLS on attendance
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Students can view their own attendance
CREATE POLICY "students_view_own_attendance" ON attendance FOR SELECT
  TO authenticated USING (
    student_id IN (
      SELECT id FROM students WHERE auth.uid()::TEXT = id
    )
  );

-- Teachers can view attendance for their classes
CREATE POLICY "teachers_view_class_attendance" ON attendance FOR SELECT
  TO authenticated USING (
    class_id IN (
      SELECT id FROM classes 
      WHERE teacher_id = auth.uid()::TEXT 
        OR teacher_id IN (
          SELECT teacher_id FROM classes 
          WHERE id IN (
            SELECT class_id FROM students WHERE auth.uid()::TEXT = id
          )
        )
    )
  );

-- Admins can view all attendance
CREATE POLICY "admins_view_all_attendance" ON attendance FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Teachers can mark attendance for their classes
CREATE POLICY "teachers_mark_attendance" ON attendance FOR INSERT
  TO authenticated WITH CHECK (
    class_id IN (
      SELECT id FROM classes 
      WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Teachers can update attendance for their classes
CREATE POLICY "teachers_update_attendance" ON attendance FOR UPDATE
  TO authenticated USING (
    class_id IN (
      SELECT id FROM classes 
      WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Admins can mark/update attendance
CREATE POLICY "admins_manage_attendance" ON attendance FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admins_update_all_attendance" ON attendance FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Homework Table
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100) NOT NULL,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ NOT NULL,
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on homework
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Students can view homework for their class
CREATE POLICY "students_view_class_homework" ON homework FOR SELECT
  TO authenticated USING (
    class_id IN (
      SELECT class_id FROM students WHERE auth.uid()::TEXT = id
    )
  );

-- Teachers can view homework they created or for their classes
CREATE POLICY "teachers_view_homework" ON homework FOR SELECT
  TO authenticated USING (
    teacher_id = auth.uid()::TEXT
    OR class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Admins can view all homework
CREATE POLICY "admins_view_all_homework" ON homework FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Teachers can create homework for their classes
CREATE POLICY "teachers_create_homework" ON homework FOR INSERT
  TO authenticated WITH CHECK (
    teacher_id = auth.uid()::TEXT
    AND class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Teachers can update their homework
CREATE POLICY "teachers_update_homework" ON homework FOR UPDATE
  TO authenticated USING (
    teacher_id = auth.uid()::TEXT
  );

-- Admins can manage all homework
CREATE POLICY "admins_manage_homework" ON homework FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admins_update_all_homework" ON homework FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  subject VARCHAR(100) NOT NULL,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id TEXT NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  file_url TEXT,
  file_type VARCHAR(50) CHECK (file_type IN ('pdf', 'doc', 'docx', 'ppt', 'pptx', 'image', 'video', 'other')),
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Students can view published notes for their class
CREATE POLICY "students_view_class_notes" ON notes FOR SELECT
  TO authenticated USING (
    is_published = true
    AND class_id IN (
      SELECT class_id FROM students WHERE auth.uid()::TEXT = id
    )
  );

-- Teachers can view notes they created or for their classes
CREATE POLICY "teachers_view_notes" ON notes FOR SELECT
  TO authenticated USING (
    teacher_id = auth.uid()::TEXT
    OR class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Admins can view all notes
CREATE POLICY "admins_view_all_notes" ON notes FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Teachers can create notes for their classes
CREATE POLICY "teachers_create_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (
    teacher_id = auth.uid()::TEXT
    AND class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()::TEXT
    )
  );

-- Teachers can update their notes
CREATE POLICY "teachers_update_notes" ON notes FOR UPDATE
  TO authenticated USING (
    teacher_id = auth.uid()::TEXT
  );

-- Admins can manage all notes
CREATE POLICY "admins_manage_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "admins_update_all_notes" ON notes FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON attendance(class_id, date);
CREATE INDEX IF NOT EXISTS idx_homework_class_date ON homework(class_id, due_date);
CREATE INDEX IF NOT EXISTS idx_homework_teacher ON homework(teacher_id);
CREATE INDEX IF NOT EXISTS idx_notes_class_subject ON notes(class_id, subject);
CREATE INDEX IF NOT EXISTS idx_notes_teacher ON notes(teacher_id);
