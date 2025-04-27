"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface LazyTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T | ((item: T) => React.ReactNode)
    className?: string
  }[]
  initialItemsToShow?: number
  incrementAmount?: number
}

export function LazyTable<T>({ data, columns, initialItemsToShow = 20, incrementAmount = 10 }: LazyTableProps<T>) {
  const [visibleItems, setVisibleItems] = useState(initialItemsToShow)
  const [loading, setLoading] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!tableRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = tableRef.current

    // If we're near the bottom (within 100px)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (!loading && visibleItems < data.length) {
        setLoading(true)

        // Simulate network delay
        setTimeout(() => {
          setVisibleItems((prev) => Math.min(prev + incrementAmount, data.length))
          setLoading(false)
        }, 500)
      }
    }
  }

  useEffect(() => {
    const currentRef = tableRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll)
      return () => currentRef.removeEventListener("scroll", handleScroll)
    }
  }, [visibleItems, loading, data.length])

  const renderCell = (item: T, column: (typeof columns)[0]) => {
    const accessorKey = column.accessorKey
    if (typeof accessorKey === "function") {
      return accessorKey(item)
    } else {
      return item[accessorKey] as React.ReactNode
    }
  }

  return (
    <div ref={tableRef} className="overflow-auto max-h-[600px]">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, visibleItems).map((item, index) => (
            <TableRow key={index}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.className}>
                  {renderCell(item, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {visibleItems < data.length && !loading && (
        <div className="text-center py-2 text-sm text-muted-foreground">Scroll down to load more</div>
      )}
    </div>
  )
}

