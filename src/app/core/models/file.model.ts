export interface FileEntity {
  name: string;
  size: string;
  date: string;
  time?: string;
  records: string;
  status: string;
  quality?: number;
  compliance?: number;
  violations?: string;
}
