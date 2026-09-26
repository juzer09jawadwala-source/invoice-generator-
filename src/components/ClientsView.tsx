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
  Users,
  Search,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  FileText,
  Mail,
  Phone,
  MapPin,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Client, Invoice, CurrencyCode } from '@/types';
import { calculateInvoice } from '@/lib/calc';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/Toast';

interface ClientsViewProps {
  clients: Client[];
  invoices: Invoice[];
  currency: CurrencyCode;
  onAddClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  onCreateInvoiceForClient: (clientId: string) => void;
}

export function ClientsView({
  clients,
  invoices,
  currency,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onCreateInvoiceForClient,
}: ClientsViewProps) {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'companyName', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setCompanyName(client.companyName);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() && !name.trim()) return;

    if (editingClient) {
      onUpdateClient(editingClient.id, {
        name: name.trim() || companyName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      showToast('Client details updated', 'success');
    } else {
      onAddClient({
        name: name.trim() || companyName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      showToast('New client added successfully', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, clientName: string) => {
    onDeleteClient(id);
    showToast(`Client ${clientName} removed`, 'info');
  };

  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        id: 'select',
        size: 32,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
            aria-label="Select all clients on page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(val) => row.toggleSelected(!!val)}
            aria-label={`Select client ${row.original.companyName || row.original.name}`}
          />
        ),
        enableSorting: false,
      },
      {
        id: 'companyName',
        accessorFn: (row) => `${row.companyName || ''} ${row.name || ''}`,
        header: 'Company / Name',
        size: 200,
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-foreground text-xs">
              {row.original.companyName || row.original.name}
            </div>
            {row.original.name && row.original.companyName && (
              <div className="text-[11px] text-muted-foreground">{row.original.name}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 180,
        cell: ({ row }) => (
          <span className="text-muted-foreground font-mono text-xs">{row.original.email || '—'}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        size: 140,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">{row.original.phone || '—'}</span>
        ),
      },
      {
        id: 'invoicesCount',
        header: 'Invoices',
        size: 100,
        cell: ({ row }) => {
          const count = invoices.filter(
            (i) => i.clientId === row.original.id || i.client.companyName === row.original.companyName
          ).length;
          return <span className="font-mono font-medium text-foreground">{count}</span>;
        },
      },
      {
        id: 'totalBilled',
        header: () => <div className="text-right">Total Billed</div>,
        size: 140,
        cell: ({ row }) => {
          const clientInvs = invoices.filter(
            (i) => i.clientId === row.original.id || i.client.companyName === row.original.companyName
          );
          const total = clientInvs.reduce((sum, inv) => sum + calculateInvoice(inv).grandTotal, 0);
          return (
            <div className="tabular-nums font-mono font-bold text-right text-foreground">
              {formatCurrency(total, currency)}
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        size: 140,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCreateInvoiceForClient(row.original.id)}
              className="p-1.5 rounded-lg bg-[#E85D3F]/20 text-white border border-[#E85D3F]/30 hover:bg-[#E85D3F]/30 transition-colors cursor-pointer"
              title="Create Invoice"
              aria-label={`Create invoice for ${row.original.companyName || row.original.name}`}
            >
              <FileText className="w-3.5 h-3.5 text-[#E85D3F]" />
            </button>
            <button
              onClick={() => openEditModal(row.original)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-white/10 text-[#D8CBB7] hover:text-white transition-colors cursor-pointer"
              title="Edit Client"
              aria-label={`Edit client ${row.original.companyName || row.original.name}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.original.id, row.original.companyName || row.original.name)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-rose-500/20 text-[#D8CBB7] hover:text-rose-400 transition-colors cursor-pointer"
              title="Delete Client"
              aria-label={`Delete client ${row.original.companyName || row.original.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [invoices, currency, onCreateInvoiceForClient]
  );

  const table = useReactTable({
    data: clients,
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

  const handleBulkDelete = () => {
    selectedRows.forEach((r) => onDeleteClient(r.original.id));
    setRowSelection({});
    showToast(`Deleted ${selectedRows.length} clients`, 'info');
  };

  const filteredClients = useMemo(() => {
    if (!globalFilter.trim()) return clients;
    const q = globalFilter.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [clients, globalFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Clients</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Corporate clients directory, contact details, and historical invoicing totals
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-border">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-btn text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Client</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact name, email..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl dark-input text-xs"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Total: <strong className="text-foreground">{clients.length}</strong> clients registered
        </div>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 px-5 rounded-2xl bg-card border border-purple-500/40 shadow-xl flex items-center justify-between"
          >
            <div className="text-xs text-white">
              <strong className="text-[#2DD4BF]">{selectedRows.length}</strong> clients selected
            </div>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Mode Switch: Table vs Grid */}
      {viewMode === 'table' ? (
        <Card className="border-[#F4E7C8]/15 bg-[#140C0A]/85 backdrop-blur-xl overflow-hidden shadow-2xl">
          <Table className="table-fixed min-w-[820px]">
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
                            <span className="text-[#D8CBB7] group-hover:text-white">
                              {sortDir === 'asc' ? (
                                <ChevronUp className="w-3.5 h-3.5 text-[#E85D3F]" />
                              ) : sortDir === 'desc' ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#F3C352]" />
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
                      <Users className="w-8 h-8 text-zinc-500 mx-auto" />
                      <p className="font-medium text-foreground text-sm">No clients found</p>
                      <p className="text-xs text-muted-foreground">Add your first client or adjust your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
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
                {[5, 10, 20].map((s) => (
                  <option key={s} value={s} className="bg-[#150E0C]">
                    {s}
                  </option>
                ))}
              </Select>
              <span>of <strong className="text-foreground">{clients.length}</strong> results</span>
            </div>

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
      ) : filteredClients.length === 0 ? (
        <div className="py-16 text-center space-y-3 glass-panel rounded-3xl border border-white/10">
          <Users className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="font-medium text-foreground text-sm">No clients found</p>
          <p className="text-xs text-muted-foreground">Add your first client or adjust your search.</p>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const clientInvoices = invoices.filter(
              (inv) => inv.clientId === client.id || inv.client.companyName === client.companyName
            );
            const totalBilled = clientInvoices.reduce((sum, inv) => sum + calculateInvoice(inv).grandTotal, 0);

            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E85D3F]/40 to-[#F3C352]/30 border border-[#F4E7C8]/15 flex items-center justify-center font-heading font-bold text-[#F4E7C8] text-sm shadow-inner">
                        {(client.companyName || client.name).substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-base text-[#F4E7C8]">
                          {client.companyName || client.name}
                        </h3>
                        {client.companyName && client.name && (
                          <p className="text-xs text-[#D8CBB7]">Attn: {client.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1.5 rounded-lg text-[#D8CBB7] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit Client"
                        aria-label={`Edit ${client.companyName || client.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, client.companyName || client.name)}
                        className="p-1.5 rounded-lg text-[#D8CBB7] hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                        title="Delete Client"
                        aria-label={`Delete ${client.companyName || client.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-[#D8CBB7] py-2 border-t border-b border-[#F4E7C8]/10">
                    {client.email && (
                      <div className="flex items-center gap-2 text-[#D8CBB7]">
                        <Mail className="w-3.5 h-3.5 text-[#E85D3F]" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-[#D8CBB7]">
                        <Phone className="w-3.5 h-3.5 text-[#F3C352]" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-start gap-2 text-[#D8CBB7]">
                        <MapPin className="w-3.5 h-3.5 text-[#B84427] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-[#D8CBB7]">{clientInvoices.length} Invoices</span>
                    <span className="font-mono font-bold text-[#F4E7C8]">
                      {formatCurrency(totalBilled, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => onCreateInvoiceForClient(client.id)}
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-[#F4E7C8]/15 hover:bg-[#E85D3F]/20 hover:border-[#E85D3F]/40 hover:text-white text-xs font-semibold text-[#D8CBB7] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E85D3F]" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-[#150E0C] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading font-bold text-base text-white">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      placeholder="billing@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Address</label>
                  <textarea
                    rows={2}
                    placeholder="Full street address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl glass-btn text-white font-semibold"
                  >
                    {editingClient ? 'Update Client' : 'Add Client'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
