import { RisultatiAnalisiData } from './risultati-analisi.component.data';

export const RISULTATI_ANALISI_MOCK: RisultatiAnalisiData = {
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
      severity: 'CRITICA',
      description: "Gruppo ABC S.p.A. supera il limite del 25% del capitale ammissibile con un'esposizione del 27.50%",
      details: {
        'Controparte': 'Gruppo ABC S.p.A.',
        'Esposizione': '€687.500.000',
        'Percentuale': '27.50%',
        'Limite': '25.00%'
      }
    },
    {
      title: 'Dati Mancanti - Campo Obbligatorio',
      severity: 'ALTA',
      description: '1.847 record mancano del campo obbligatorio "data_scadenza" richiesto per BCBS 239',
      details: {
        'Campo': 'data_scadenza',
        'Record Interessati': 1847,
        'Percentuale': '1.48%'
      }
    },
    {
      title: 'Formato Data Non Standard',
      severity: 'MEDIA',
      description: '892 record utilizzano formato data DD/MM/YYYY invece del formato standard YYYY-MM-DD',
      details: {
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
