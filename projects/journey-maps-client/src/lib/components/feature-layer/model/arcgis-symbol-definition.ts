export interface ArcgisSymbolDefinition {
  type: 'esriSMS' | 'esriSLS' | 'esriSFS' | 'esriPMS' | 'esriPFS' | 'esriTS';
  color: number[];
  width?: number;
  size?: number;
  outline?: { color: number[], width?: number };
}
