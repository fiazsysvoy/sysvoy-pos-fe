"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Edit, Eye, Trash } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onEdit?: (row: TData) => void
    onView?: (row: TData) => void
    onDelete?: (row: TData) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onEdit,
    onView,
    onDelete,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                <TableCell className="flex gap-2 justify-end">
                                    <button
                                        aria-label="Edit"
                                        onClick={() => onEdit?.(row.original)}
                                        className="p-2 rounded hover:bg-muted inline-flex items-center justify-center"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        aria-label="View"
                                        onClick={() => onView?.(row.original)}
                                        className="p-2 rounded hover:bg-muted inline-flex items-center justify-center"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        aria-label="Delete"
                                        onClick={() => onDelete?.(row.original)}
                                        className="p-2 rounded hover:bg-red-600/10 text-red-600 inline-flex items-center justify-center"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}