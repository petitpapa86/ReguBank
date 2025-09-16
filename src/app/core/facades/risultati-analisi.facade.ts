import { Injectable, signal, computed, effect } from '@angular/core';

export interface RisultatiAnalisiViolation {
  title: string;
  severity: 'CRITICA' | 'ALTA' | 'MEDIA';
  description: string;
  details: Record<string, string | number>;
}

export interface RisultatiAnalisiExposure {
  counterparty: string;
  exposure: string;
  percent: string;
  status: string;
}

export interface RisultatiAnalisiAction {
  title: string;
  description: string;
  deadline: string;
  priority: string;
  color: string;
}

export interface RisultatiAnalisiData {
  fileName: string;
  fileSize: string;
  totalRecords: number;
  complianceScore: number;
  dataQuality: number;
  criticalViolations: number;
  largeExposures: number;
  violations: RisultatiAnalisiViolation[];
  topExposures: RisultatiAnalisiExposure[];
  recommendedActions: RisultatiAnalisiAction[];
}

@Injectable({ providedIn: 'root' })
export class RisultatiAnalisiFacade {
  private readonly _dataVersion = signal(0);
  private readonly _cachedData = signal<RisultatiAnalisiData | null>(null);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  readonly data = computed(() => this._cachedData());

  private _loadEffect = effect(() => {
    if (this._dataVersion() > 0) {
      this._performLoad();
    }
  });

  private _errorEffect = effect(() => {
    this.lastError.set(this._cachedError());
  });

  constructor() {
    this.load();
  }

  private async _performLoad() {
    this.isLoading.set(true);
    try {
      // Simulate API call using static db.json data
      // In a real app, replace with HTTP request
      const fileProcessing = {
        fileName: 'esposizioni_settembre_2025.xlsx',
        fileSize: '15,7 MB',
        totalRecords: 125000,
        complianceScore: 87.2,
        dataQuality: 94.5,
        criticalViolations: 3,
        largeExposures: 15,
        violations: [
          {
            title: 'Superamento Limite Grande Esposizione',
            severity: 'CRITICA' as const,
            description: "Gruppo ABC S.p.A. supera il limite del 25% del capitale ammissibile con un'esposizione del 27.50%",
            details: {
              'Controparte': 'Gruppo ABC S.p.A.',
              'Esposizione': '€687.500.000',
              'Percentuale': '27.50%',
              'Limite': '25.00%',
              'Campo': '',
              'Record Interessati': '',
              'Formato Attuale': '',
              'Formato Richiesto': '',
              'Record da Correggere': ''
            }
          },
          {
            title: 'Dati Mancanti - Campo Obbligatorio',
            severity: 'ALTA' as const,
            description: '1.847 record mancano del campo obbligatorio "data_scadenza" richiesto per BCBS 239',
            details: {
              'Controparte': '',
              'Esposizione': '',
              'Percentuale': '1.48%',
              'Limite': '',
              'Campo': 'data_scadenza',
              'Record Interessati': 1847,
              'Formato Attuale': '',
              'Formato Richiesto': '',
              'Record da Correggere': ''
            }
          },
          {
            title: 'Formato Data Non Standard',
            severity: 'MEDIA' as const,
            description: '892 record utilizzano formato data DD/MM/YYYY invece del formato standard YYYY-MM-DD',
            details: {
              'Controparte': '',
              'Esposizione': '',
              'Percentuale': '',
              'Limite': '',
              'Campo': '',
              'Record Interessati': '',
              'Formato Attuale': 'DD/MM/YYYY',
              'Formato Richiesto': 'YYYY-MM-DD',
              'Record da Correggere': 892
            }
          }
        ],
        topExposures: [
          {
            counterparty: 'Gruppo ABC S.p.A.',
            exposure: '€687.500.000',
            percent: '27.50%',
            status: 'Violazione'
          },
          {
            counterparty: 'Banca Commerciale Roma',
            exposure: '€425.200.000',
            percent: '17.01%',
            status: 'Conforme'
          },
          {
            counterparty: 'Gruppo DEF International',
            exposure: '€298.750.000',
            percent: '11.95%',
            status: 'Conforme'
          },
          {
            counterparty: 'Immobiliare Milano Nord',
            exposure: '€275.100.000',
            percent: '11.00%',
            status: 'Conforme'
          },
          {
            counterparty: 'Energia Sostenibile S.r.l.',
            exposure: '€250.800.000',
            percent: '10.03%',
            status: 'Conforme'
          }
        ],
        recommendedActions: [
          {
            title: 'Ridurre Esposizione Gruppo ABC',
            description: 'Vendere €62.5M di esposizioni per rientrare nel limite del 25%',
            deadline: '30 giorni',
            priority: 'Critica',
            color: 'red'
          },
          {
            title: 'Completare Dati Mancanti',
            description: 'Aggiungere le date di scadenza per 1.847 record',
            deadline: '14 giorni',
            priority: 'Alta',
            color: 'orange'
          },
          {
            title: 'Correggere Formati Data',
            description: 'Convertire 892 record al formato YYYY-MM-DD',
            deadline: '7 giorni',
            priority: 'Media',
            color: 'yellow'
          }
        ]
      };
      this._cachedData.set(fileProcessing);
      this._cachedError.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load risultati analisi';
      this._cachedError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  load() {
    this._dataVersion.update(v => v + 1);
  }

  clearError() {
    this._cachedError.set(null);
    this.lastError.set(null);
  }
}
