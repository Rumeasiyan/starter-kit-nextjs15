import type { ColumnDef } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
  isPaginationEnabled?: boolean;
  tableWrapperClassName?: string;
  tableClassName?: string;
  tableHeaderClassName?: string;
}
