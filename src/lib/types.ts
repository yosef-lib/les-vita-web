export interface ScheduleItem {
  id: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  teacherName: string;
  teacherPhone: string;
  subject: string;
  gradeLevel: string;
  dayDate: string; // e.g. "Senin, 8 September 2026"
  timeSlot: string; // e.g. "15:30 - 17:00 WIB"
  materials: string; // e.g. "Modul Bab 4: Persamaan Kuadrat & Soal Latihan"
  materialUrl?: string;
  status: 'scheduled' | 'confirmed' | 'rescheduled' | 'cancelled';
}

export interface Teacher {
  id: string;
  name: string;
  phone: string;
  subjects: string[];
  avatar: string;
}

export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentPhone: string;
  grade: string;
  joinDate?: string;
}
