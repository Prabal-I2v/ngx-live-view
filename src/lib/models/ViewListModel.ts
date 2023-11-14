export interface ViewListModel {
  id: number;
  Text: string;
  heading: string;
  Rows: number;
  Cols: number;
  hasSpecial?: boolean;
  SpecialElement?: number;
  SEWidth?: number;
  SEHeight?: number;
  NumberofTiles?: number;
}
