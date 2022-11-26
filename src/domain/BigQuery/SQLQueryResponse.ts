type SQLFieldSchema = {
  name: string;
  type: string;
};
type SQLQueryMeta = {
  cachehit: boolean;
  totalBytesProcessed: number;
  location: string;
};

export type SQLQueryResponse<T> = {
  rows: T[];
  schema: SQLFieldSchema[];
  meta: SQLQueryMeta;
};
