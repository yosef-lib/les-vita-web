export type StudentStatus = 'Aktif' | 'Paused' | 'Alumni';

export interface Student {
  id: string;
  name: string;
  grade: string;
  program: string;
  status: StudentStatus;
  joinDate: string;
  parentName: string;
  phone: string;
}

export const mockStudents: Student[] = [
  {
    id: 'S001',
    name: 'Budi Santoso',
    grade: '3 SD',
    program: 'SD (Semua Mapel)',
    status: 'Aktif',
    joinDate: '2025-07-15',
    parentName: 'Ibu Ani',
    phone: '081234567890'
  },
  {
    id: 'S002',
    name: 'Siti Aminah',
    grade: 'TK B',
    program: 'Calistung (TK/PAUD)',
    status: 'Aktif',
    joinDate: '2025-08-01',
    parentName: 'Bapak Joko',
    phone: '089876543210'
  },
  {
    id: 'S003',
    name: 'Andi Pratama',
    grade: '7 SMP',
    program: 'SMP (Eksakta)',
    status: 'Paused',
    joinDate: '2024-01-10',
    parentName: 'Ibu Budi',
    phone: '081122334455'
  },
  {
    id: 'S004',
    name: 'Rina Wijaya',
    grade: '5 SD',
    program: 'Holiday Class',
    status: 'Aktif',
    joinDate: '2025-12-15',
    parentName: 'Bapak Wijaya',
    phone: '085566778899'
  }
];
