import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Edit2,
  Copy,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { Invoice, InvoiceStatus, CurrencyCode } from '@/types';
import { calculateInvoice } from '@/lib/calc';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/Toast';

interface InvoicesListProps {
  invoices: Invoice[];
  currency: CurrencyCode;
  onCreateNew: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function getDaysTerm(issuedStr: string, dueStr: string): string {
  try {
    const d1 = new Date(issuedStr);
    const d2 = new Date(dueStr);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `${diff}d term`;
    if (diff === 0) return 'Same day';
    return `${Math.abs(diff)}d past`;
  } catch (e) {
    return '14d term';
  }
}

export function InvoicesList({
  invoices,
  currency,
  onCreateNew,
  onLoad,
  onDelete,
  onDuplicate,
}: InvoicesListProps) {
  const { showToast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'invoiceDate', desc: true }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Status dot color mapping per spec
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
            Overdue
          </Badge>
        );
      case 'draft':
      default:
        return (
          <Badge variant="outline" className="border-border text-muted-foreground bg-white/[0.04]">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/64 mr-1.5" />
            Draft
          </Badge>
        );
    }
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      // 1. Select
      {
        id: 'select',
        size: 32,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
            aria-label="Select all invoices on page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(val) => row.toggleSelected(!!val)}
            aria-label={`Select invoice ${row.original.invoiceNumber}`}
          />
        ),
        enableSorting: false,
      },
      // 2. Invoice Number
      {
        accessorKey: 'invoiceNumber',
        header: 'Invoice',
        size: 110,
        cell: ({ row }) => (
          <button
            onClick={() => onLoad(row.original.id)}
            className="font-mono font-medium text-foreground hover:text-[#2DD4BF] transition-colors text-left"
          >
            {row.original.invoiceNumber}
          </button>
        ),
      },
      // 3. Client
      {
        id: 'client',
        accessorFn: (row) => `${row.client.companyName} ${row.client.name}`,
        header: 'Client',
        size: 180,
        cell: ({ row }) => (
          <div>
            <div className="font-medium text-foreground text-xs">
              {row.original.client.companyName || row.original.client.name || 'Unnamed Client'}
            </div>
            {row.original.client.name && row.original.client.companyName && (
              <div className="text-[11px] text-muted-foreground">{row.original.client.name}</div>
            )}
          </div>
        ),
      },
      // 4. Dates with Flight Time Dashed Connector Treatment
      {
        accessorKey: 'invoiceDate',
        header: 'Schedule & Term',
        size: 240,
        cell: ({ row }) => {
          const issued = row.original.invoiceDate
            ? new Date(row.original.invoiceDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : '-';
          const due = row.original.dueDate
            ? new Date(row.original.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : '-';
          const term = getDaysTerm(row.original.invoiceDate, row.original.dueDate);

          return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{issued}</span>
              <span aria-hidden="true" className="w-4 border-b border-dashed border-muted-foreground/40" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                {term}
              </span>
              <span aria-hidden="true" className="w-4 border-b border-dashed border-muted-foreground/40" />
              <span className="font-medium text-foreground">{due}</span>
            </div>
          );
        },
      },
      // 5. Status
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      // 6. Amount
      {
        id: 'amount',
        header: () => <div className="text-right">Amount</div>,
        size: 120,
        cell: ({ row }) => {
          const totals = calculateInvoice(row.original);
          const invCurrency = row.original.currency || currency;
          return (
            <div className="tabular-nums font-mono font-bold text-right text-foreground text-xs sm:text-sm">
              {formatCurrency(totals.grandTotal, invCurrency)}
            </div>
          );
        },
      },
      // 7. Actions
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onLoad(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-border hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Edit Invoice"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDuplicate(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-border hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-border hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [currency, onLoad, onDuplicate, onDelete]
  );

  // Filter by status first
  const data = useMemo(() => {
    if (statusFilter === 'all') return invoices;
    return invoices.filter((i) => i.status === statusFilter);
  }, [invoices, statusFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  // Bulk Actions
  const handleBulkMarkAsPaid = () => {
    selectedRows.forEach((r) => {
      r.original.status = 'paid';
    });
    setRowSelection({});
    showToast(`Marked ${selectedRows.length} invoices as Paid`, 'success');
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((r) => {
      onDelete(r.original.id);
    });
    setRowSelection({});
    showToast(`Deleted ${selectedRows.length} selected invoices`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Invoices</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Sort, filter, and track payments across all client billing records
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-btn text-white text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice no, client, project..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl dark-input text-xs"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'paid', 'draft', 'overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#6D4AFF]/30 text-white border border-[#6D4AFF]/50 font-bold shadow-sm shadow-purple-600/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar (Reveals on row selection) */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="p-3 px-5 rounded-2xl bg-gradient-to-r from-[#151027] to-[#1E1738] border border-purple-500/40 shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-white">
              <span className="font-semibold text-[#2DD4BF]">{selectedRows.length}</span> invoices selected
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkAsPaid}
                className="text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark as Paid
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TanStack Table Card */}
      <Card className="border-border bg-card/70 overflow-hidden shadow-2xl">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.column.getSize()}px` }}
                      className="select-none"
                    >
                      {header.isPlaceholder ? null : isSortable ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors group"
                        >
                          <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                          <span className="text-muted-foreground group-hover:text-foreground">
                            {sortDir === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#2DD4BF]" />
                            ) : sortDir === 'desc' ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#A855F7]" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-75" />
                            )}
                          </span>
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  <div className="py-8 space-y-2">
                    <FileText className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="font-medium text-foreground text-sm">No invoices found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search filters or create a new invoice.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* TanStack Table Pagination Footer */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Range Selector */}
          <div className="flex items-center gap-2">
            <span>Viewing</span>
            <Select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                table.setPageSize(newSize);
              }}
              aria-label="Select items per page"
            >
              {[5, 10, 20, 50].map((s) => (
                <option key={s} value={s} className="bg-[#151027]">
                  {s}
                </option>
              ))}
            </Select>
            <span>
              of <strong className="text-foreground">{data.length}</strong> results
            </span>
          </div>

          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-2">
            <span className="mr-2">
              Page <strong className="text-foreground">{table.getState().pagination.pageIndex + 1}</strong> of{' '}
              <strong className="text-foreground">{Math.max(1, table.getPageCount())}</strong>
            </span>
            <PaginationPrevious
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
                setPageIndex(table.getState().pagination.pageIndex - 1);
              }}
            />
            <PaginationNext
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
                setPageIndex(table.getState().pagination.pageIndex + 1);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
