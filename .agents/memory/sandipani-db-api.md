---
name: Sandipani DB & API foundation
description: Covers the database schema, API route patterns, generated hook names, and frontend integration for Students/Teachers/Classes.
---

## DB Schema (lib/db/src/schema/)
- students.ts → `studentsTable` — id (text PK, generated), fullName, rollNo, className, section, stream, additionalSubject, gender, dateOfBirth, parentName, parentMobile, address, email, phone, createdAt
- teachers.ts → `teachersTable` — id (text PK, generated), fullName, subject, email, phone, assignedClasses (text array), createdAt
- classes.ts → `classesTable` — id (text PK, derived from name+section), name, section, teacherId, studentCount, createdAt

## ID Generation
- Students: `STU-{year}-{padded count+1}` (e.g. STU-2026-001)
- Teachers: `TCH-{year}-{padded count+1}` (e.g. TCH-2026-001)
- Classes: `CLS-{padded number}-{section}` (e.g. CLS-08-A), with fallback suffix if duplicate

## Zod schema names from @workspace/api-zod (generated)
- `CreateStudentBody`, `UpdateStudentBody`
- `CreateTeacherBody`, `UpdateTeacherBody`
- `CreateClassBody`, `UpdateClassBody`

## React Query hook names from @workspace/api-client-react (generated)
- `useListStudents`, `useCreateStudent`, `useUpdateStudent`, `useDeleteStudent`, `getListStudentsQueryKey`
- `useListTeachers`, `useCreateTeacher`, `useUpdateTeacher`, `useDeleteTeacher`, `getListTeachersQueryKey`
- `useListClasses`, `useCreateClass`, `useUpdateClass`, `useDeleteClass`, `getListClassesQueryKey`

**Why:** The codegen names come from operationId in the OpenAPI spec: listStudents → useListStudents, createStudent → useCreateStudent, etc. Always check the generated files if unsure.

## Frontend pages
- Students, Teachers, Classes pages in artifacts/sandipani/src/pages/admin/ now use real API via generated hooks
- All three pages have loading spinners, error toasts, real CRUD with invalidate-on-success pattern
- Students form expanded to include all 13 fields from the spec
- Classes page fetches teachers list for the teacher dropdown

## What's still mock data
- Attendance, Homework, Notes, Results, Timetable — all still use mockData.ts (BATCH 2 scope)
- Auth (login) is still local-state-based mock

## Key commands
- `pnpm --filter @workspace/db run push` — push schema changes
- `pnpm --filter @workspace/api-spec run codegen` — regenerate hooks after OpenAPI changes
