import { Injectable, signal, computed } from '@angular/core';
import { FileEntity } from '../models/file.model';
import { filesFromDb } from '../functions/api.functions';

@Injectable({ providedIn: 'root' })
export class FileManagementFacade {
  private readonly _files = signal<FileEntity[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  files = computed(() => this._files());
  isLoading = computed(() => this._isLoading());
  error = computed(() => this._error());

  loadFiles() {
    this._isLoading.set(true);
    this._error.set(null);
    filesFromDb()
      .then(files => this._files.set(files))
      .catch(err => this._error.set('Errore nel caricamento dei file'))
      .finally(() => this._isLoading.set(false));
  }
}
