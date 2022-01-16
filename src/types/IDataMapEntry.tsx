export interface IDataMapEntry {
  _id: false;
  timestamp: Date;
  description: string;
  values: [
    {
      _id: false;
      value: number;
      content: string;
      color: string;
    }
  ];
}
