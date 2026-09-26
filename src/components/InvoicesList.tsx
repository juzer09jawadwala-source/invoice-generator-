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
  Eye,
  Layers,
  Filter,
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
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/Toast';
import { LayeredInvoiceShowcase } from './LayeredInvoiceShowcase';

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
  const [selectedShowcaseId, setSelectedShowcaseId] = useState<string>(invoices[0]?.id || '');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'invoiceDate', desc: true }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Status badge with Pinterest warm editorial palette
  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-500/15 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="border-[#F3C352]/40 text-[#F3C352] bg-[#F3C352]/15 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F3C352] mr-1.5" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="border-red-500/40 text-red-300 bg-red-500/15 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5" />
            Overdue
          </Badge>
        );
      case 'draft':
      default:
        return (
          <Badge variant="outline" className="border-white/15 text-[#D8CBB7] bg-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8CBB7]/60 mr-1.5" />
            Draft
          </Badge>
        );
    }
  };

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      // 1. Select Checkbox
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
            onClick={() => {
              setSelectedShowcaseId(row.original.id);
              onLoad(row.original.id);
            }}
            className="font-mono font-bold text-[#F4E7C8] hover:text-[#E85D3F] transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
          >
            <span>{row.original.invoiceNumber}</span>
            <span className="opacity-0 group-hover:opacity-100 text-[#E85D3F] text-[10px]">↗</span>
          </button>
        ),
      },
      // 3. Client Name & Company (Real untouched data)
      {
        id: 'client',
        accessorFn: (row) => `${row.client.companyName} ${row.client.name}`,
        header: 'Client',
        size: 190,
        cell: ({ row }) => (
          <div
            onClick={() => setSelectedShowcaseId(row.original.id)}
            className="cursor-pointer"
            title="Click to view in showcase"
          >
            <div className="font-heading font-bold text-[#F4E7C8] text-xs">
              {row.original.client.companyName || row.original.client.name || 'Unnamed Client'}
            </div>
            {row.original.client.name && row.original.client.companyName && (
              <div className="text-[11px] text-[#D8CBB7]">{row.original.client.name}</div>
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
            <div className="flex items-center gap-1.5 text-xs text-[#D8CBB7]">
              <span className="font-semibold text-[#F4E7C8]">{issued}</span>
              <span aria-hidden="true" className="w-4 border-b border-dashed border-[#F4E7C8]/25" />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-[#F4E7C8] border border-[#F4E7C8]/15">
                {term}
              </span>
              <span aria-hidden="true" className="w-4 border-b border-dashed border-[#F4E7C8]/25" />
              <span className="font-semibold text-[#F4E7C8]">{due}</span>
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
        size: 130,
        cell: ({ row }) => {
          const totals = calculateInvoice(row.original);
          const invCurrency = row.original.currency || currency;
          return (
            <div className="tabular-nums font-mono font-bold text-right text-[#F4E7C8] text-xs sm:text-sm">
              {formatCurrency(totals.grandTotal, invCurrency)}
            </div>
          );
        },
      },
      // 7. Actions (Inspect in showcase, Edit, Duplicate, Delete)
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        size: 130,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                setSelectedShowcaseId(row.original.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                selectedShowcaseId === row.original.id
                  ? 'bg-[#E85D3F] border-[#E85D3F] text-white shadow-sm'
                  : 'bg-white/[0.04] border-[#F4E7C8]/15 hover:bg-[#E85D3F]/20 text-[#D8CBB7] hover:text-[#F4E7C8]'
              }`}
              title="Showcase in layered deck"
              aria-label={`View invoice ${row.original.invoiceNumber} in showcase`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLoad(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors cursor-pointer"
              title="Edit Invoice"
              aria-label={`Edit invoice ${row.original.invoiceNumber}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDuplicate(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors cursor-pointer"
              title="Duplicate"
              aria-label={`Duplicate invoice ${row.original.invoiceNumber}`}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(row.original.id)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-red-500/20 text-[#D8CBB7] hover:text-red-400 transition-colors cursor-pointer"
              title="Delete"
              aria-label={`Delete invoice ${row.original.invoiceNumber}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [currency, onLoad, onDuplicate, onDelete, selectedShowcaseId]
  );

  // Filter by status
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

  // Status counts for pills
  const statusCounts = useMemo(() => {
    return {
      all: invoices.length,
      pending: invoices.filter((i) => i.status === 'pending').length,
      paid: invoices.filter((i) => i.status === 'paid').length,
      draft: invoices.filter((i) => i.status === 'draft').length,
      overdue: invoices.filter((i) => i.status === 'overdue').length,
    };
  }, [invoices]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-12">
      {/* ========================================================== */}
      {/* 1. HERO LAYERED INVOICE SHOWCASE (Pinterest Centerpiece)    */}
      {/* ========================================================== */}
      <LayeredInvoiceShowcase
        invoices={invoices}
        currency={currency}
        selectedId={selectedShowcaseId || invoices[0]?.id}
        onSelectId={setSelectedShowcaseId}
        onEdit={onLoad}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onCreateNew={onCreateNew}
      />

      {/* ========================================================== */}
      {/* 2. EDITORIAL TRANSITION DIVIDER                             */}
      {/* ========================================================== */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-[#F4E7C8]/15" />
        </div>
        <div className="relative flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111111]/90 border border-[#F4E7C8]/20 backdrop-blur-md shadow-lg text-[10px] font-bold uppercase tracking-widest text-[#F4E7C8]">
          <Layers className="w-3.5 h-3.5 text-[#E85D3F]" />
          <span>Ledger & Document Directory</span>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 3. TABLE CONTROLS & STATUS FILTER TOOLBAR                   */}
      {/* ========================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#F4E7C8]">
              All Billing Records
            </h3>
            <p className="text-xs text-[#D8CBB7] mt-0.5">
              Live index of client statements, schedules, and settlement statuses.
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E85D3F] hover:bg-[#B84427] text-white text-xs font-bold shadow-lg shadow-[#E85D3F]/25 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-[#F4E7C8]/15 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
          {/* Search input with warm styling */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#D8CBB7] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice no, client, project..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              aria-label="Search invoice number, client, or project"
              className="w-full pl-9 pr-4 py-2 rounded-xl dark-input text-xs font-medium"
            />
          </div>

          {/* Status Filters with Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'paid', 'draft', 'overdue'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPageIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#E85D3F] text-white font-bold shadow-md shadow-[#E85D3F]/30 border border-[#E85D3F]'
                    : 'text-[#D8CBB7] hover:text-[#F4E7C8] hover:bg-white/[0.05]'
                }`}
              >
                <span>{st}</span>
                <span className="text-[10px] font-mono opacity-80 font-bold">
                  ({statusCounts[st]})
                </span>
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
              className="p-3 px-4 sm:px-5 rounded-2xl bg-[#150E0C] border border-[#E85D3F]/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 text-xs text-[#F4E7C8]">
                <span className="font-bold text-[#F3C352]">{selectedRows.length}</span> invoices selected
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkMarkAsPaid}
                  className="text-xs text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Mark as Paid
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

        {/* ========================================================== */}
        {/* 4. TANSTACK TABLE CARD (Redesigned with Editorial Warmth)   */}
        {/* ========================================================== */}
        <Card className="border border-[#F4E7C8]/15 bg-[#140C0A]/85 backdrop-blur-xl overflow-hidden shadow-2xl">
          <Table className="table-fixed min-w-[860px]">
            <TableHeader className="bg-[#111111]/95 border-b border-[#F4E7C8]/15">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-[#F4E7C8]/15">
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.column.getSize()}px` }}
                        className="select-none text-[#F4E7C8] font-bold text-[11px] uppercase tracking-wider"
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
                            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
                          >
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            <span className="text-[#D8CBB7]/60 group-hover:text-[#F4E7C8]">
                              {sortDir === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#F3C352]" />
                              ) : sortDir === 'desc' ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#E85D3F]" />
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

            <TableBody className="divide-y divide-[#F4E7C8]/10">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const isShowcased = selectedShowcaseId === row.original.id;
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`group transition-colors ${
                        isShowcased
                          ? 'bg-[#E85D3F]/10 border-l-2 border-l-[#E85D3F]'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4 text-[#F4E7C8]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-[#D8CBB7]">
                    <div className="py-8 space-y-2">
                      <FileText className="w-8 h-8 text-[#E85D3F] mx-auto opacity-70" />
                      <p className="font-semibold text-[#F4E7C8] text-sm">No invoices found</p>
                      <p className="text-xs text-[#D8CBB7]">
                        Try adjusting your search query or status filter.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* TanStack Table Pagination Footer */}
          <div className="p-4 border-t border-[#F4E7C8]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8CBB7] bg-[#111111]/70">
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
                  <option key={s} value={s} className="bg-[#150E0C] text-[#F4E7C8]">
                    {s}
                  </option>
                ))}
              </Select>
              <span>
                of <strong className="text-[#F4E7C8]">{data.length}</strong> results
              </span>
            </div>

            {/* Previous / Next Buttons */}
            <div className="flex items-center gap-2">
              <span className="mr-2">
                Page <strong className="text-[#F4E7C8]">{table.getState().pagination.pageIndex + 1}</strong> of{' '}
                <strong className="text-[#F4E7C8]">{Math.max(1, table.getPageCount())}</strong>
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
    </div>
  );
}
