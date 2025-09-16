export interface FileProcessing {
  fileName: string;
  fileSize: string;
  totalRecords: number;
  progress: number;
  recordsProcessed: number;
  timeRemaining: string;
  currentStep: string;
  stepDescription: string;
  qualityScore: number;
  violationsFound: number;
  largeExposures: number;
  status: string;
}
