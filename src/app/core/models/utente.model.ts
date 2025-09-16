export interface Utente {
  id: string;
  nome: string;
  email: string;
  ruolo: 'Admin' | 'Analyst' | 'Viewer';
  funzione?: string;
  stato: 'Attivo' | 'Sospeso';
  ultimoAccesso: string;
}
