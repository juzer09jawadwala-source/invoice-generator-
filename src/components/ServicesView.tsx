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
  Briefcase,
  Search,
  ChevronUp,
  ChevronDown,
  Edit2,
  Trash2,
  RotateCcw,
  X,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { CatalogService, CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/Toast';

interface ServicesViewProps {
  services: CatalogService[];
  currency: CurrencyCode;
  onAddService: (data: Omit<CatalogService, 'id'>) => CatalogService;
  onUpdateService: (id: string, updates: Partial<CatalogService>) => void;
  onDeleteService: (id: string) => void;
  onResetDefaults: () => void;
}

export function ServicesView({
  services,
  currency,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetDefaults,
}: ServicesViewProps) {
  const { showToast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CatalogService | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Design');
  const [price, setPrice] = useState(5000);
  const [taxPercent, setTaxPercent] = useState(18);
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Design');
    setPrice(5000);
    setTaxPercent(18);
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (svc: CatalogService) => {
    setEditingService(svc);
    setName(svc.name);
    setCategory(svc.category);
    setPrice(svc.price);
    setTaxPercent(svc.taxPercent);
    setDescription(svc.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      onUpdateService(editingService.id, {
        name: name.trim(),
        category: category.trim(),
        price: Number(price) || 0,
        taxPercent: Number(taxPercent) || 0,
        description: description.trim(),
      });
      showToast('Service updated successfully', 'success');
    } else {
      onAddService({
        name: name.trim(),
        category: category.trim(),
        price: Number(price) || 0,
        taxPercent: Number(taxPercent) || 0,
        description: description.trim(),
      });
      showToast('New service added to catalog', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, svcName: string) => {
    onDeleteService(id);
    showToast(`Service ${svcName} removed from catalog`, 'info');
  };

  const handleReset = () => {
    onResetDefaults();
    showToast('Service catalog reset to 20 default services', 'info');
  };

  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category));
    return ['all', ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (categoryFilter === 'all') return services;
    return services.filter((s) => s.category === categoryFilter);
  }, [services, categoryFilter]);

  const columns = useMemo<ColumnDef<CatalogService>[]>(
    () => [
      {
        id: 'select',
        size: 32,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
            aria-label="Select all services on page"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(val) => row.toggleSelected(!!val)}
            aria-label={`Select service ${row.original.name}`}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'name',
        header: 'Service Name',
        size: 220,
        cell: ({ row }) => (
          <div>
            <div className="font-bold text-foreground text-xs">{row.original.name}</div>
            {row.original.description && (
              <div className="text-[11px] text-muted-foreground truncate max-w-xs">{row.original.description}</div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 130,
        cell: ({ row }) => (
          <Badge variant="outline" className="border-purple-500/30 text-[#A855F7] bg-purple-500/10 text-[10px]">
            <Tag className="w-2.5 h-2.5 mr-1" />
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: 'price',
        header: () => <div className="text-right">Default Rate</div>,
        size: 130,
        cell: ({ row }) => (
          <div className="tabular-nums font-mono font-bold text-right text-foreground">
            {formatCurrency(row.original.price, currency)}
          </div>
        ),
      },
      {
        accessorKey: 'taxPercent',
        header: () => <div className="text-center">Tax %</div>,
        size: 90,
        cell: ({ row }) => (
          <div className="font-mono text-center text-muted-foreground">{row.original.taxPercent}%</div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openEditModal(row.original)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-border hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              title="Edit Service"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(row.original.id, row.original.name)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-border hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 transition-colors"
              title="Delete Service"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [currency]
  );

  const table = useReactTable({
    data: filteredServices,
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
    selectedRows.forEach((r) => onDeleteService(r.original.id));
    setRowSelection({});
    showToast(`Deleted ${selectedRows.length} services`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">Services Catalog</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your service rates, billing tiers, and standard tax settings
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-border hover:bg-white/[0.08] text-xs font-semibold text-zinc-300 hover:text-white transition-all"
            title="Reset to 20 default studio services"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2DD4BF]" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white text-xs font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all cursor-pointer glow-btn"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Category Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service name, category, rate..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl dark-input text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-primary/30 text-white border border-primary/50 font-bold shadow-sm shadow-purple-600/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              {cat}
            </button>
          ))}
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
              <strong className="text-[#2DD4BF]">{selectedRows.length}</strong> services selected
            </div>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Card */}
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
                    <Briefcase className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="font-medium text-foreground text-sm">No services found</p>
                    <p className="text-xs text-muted-foreground">Add a service or click Reset Defaults.</p>
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
                <option key={s} value={s} className="bg-[#151027]">
                  {s}
                </option>
              ))}
            </Select>
            <span>of <strong className="text-foreground">{filteredServices.length}</strong> results</span>
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel bg-[#151027] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-heading font-bold text-base text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mobile App UI Design"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl dark-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl dark-input"
                    >
                      <option value="Design" className="bg-[#151027]">Design</option>
                      <option value="Development" className="bg-[#151027]">Development</option>
                      <option value="Branding" className="bg-[#151027]">Branding</option>
                      <option value="Marketing" className="bg-[#151027]">Marketing</option>
                      <option value="Media" className="bg-[#151027]">Media</option>
                      <option value="Content" className="bg-[#151027]">Content</option>
                      <option value="Support" className="bg-[#151027]">Support</option>
                      <option value="Strategy" className="bg-[#151027]">Strategy</option>
                      <option value="Custom" className="bg-[#151027]">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Default Rate</label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl dark-input font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl dark-input font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Standard Description</label>
                  <textarea
                    rows={2}
                    placeholder="Deliverable details for invoice rows..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6D4AFF] to-[#8B5CF6] text-white font-semibold shadow-md"
                  >
                    {editingService ? 'Save Changes' : 'Add to Catalog'}
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
