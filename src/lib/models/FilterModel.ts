export type FilterType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'array'
  | 'multiselect';

export interface FilterModel {
  name: string;
  type: FilterType;
  values: any[];
}
