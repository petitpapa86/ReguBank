import { FileProcessing } from '../models/file-processing.model';
import { apiFunctions } from '../functions/api.functions';

export function createLoadFileProcessingUseCase(): () => Promise<FileProcessing> {
  return async () => {
    return await apiFunctions.loadFileProcessing()();
  };
}
