"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import type { UseFormReturn } from "react-hook-form"
import { Search, X } from "lucide-react"
import type { BlogFormValues } from "./blog-post-form"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrandList } from "@/types/ecm"
import { Brand } from "@/types/brand"



export function BrandSelector({ form }: { form: UseFormReturn<BlogFormValues> }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [brands, setBrands] = useState<BrandList>([])
  const [filteredBrands, setFilteredBrands] = useState<BrandList>([])
  const [showResults, setShowResults] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedBrandIds = form.watch("brands") || []
  const selectedBrands = brands.filter((brand:Brand) => selectedBrandIds.includes(brand.title))

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || '';
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS|| '';
    useEffect(() => {
      axios
        .get<Brand>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/read_brand_info/fetch`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
          }
        })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setBrands(response.data)
          setFilteredBrands(response.data)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch brands", error)
      })
  }, [])

  // saved in local storage
  useEffect(() => {
    const savedBrands = localStorage.getItem("selectedBrands")
    if (savedBrands) {
      const parsed = JSON.parse(savedBrands)
      if (Array.isArray(parsed)) {
        form.setValue("brands", parsed)
      }
    }
  }, [form])

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (Array.isArray(values.brands)) {
        localStorage.setItem("selectedBrands", JSON.stringify(values.brands))
      }
    })
  
    return () => subscription.unsubscribe()
  }, [form])
  

  // Filter brands based on search
  useEffect(() => {
    if (searchQuery) {
      setFilteredBrands(
        brands.filter((brand) =>
          brand.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredBrands(brands)
    }
  }, [searchQuery, brands])

  // Detect click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectBrand = (brandId: string) => {
    const currentBrands = form.getValues().brands || []
    if (!currentBrands.includes(brandId)) {
      form.setValue("brands", [...currentBrands, brandId])
    }
    setSearchQuery("")
    setShowResults(false)
  }

  const handleRemoveBrand = (brandId: string) => {
    const currentBrands = form.getValues().brands || []
    form.setValue(
      "brands",
      currentBrands.filter((id: string) => id !== brandId),
    )
  }

  return (
    <FormField
      control={form.control}
      name="brands"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Brands</FormLabel>
          <FormControl>
            <div className="space-y-4" ref={wrapperRef}>
              <div className="relative">
                <div className="flex">
                  <Input
                    placeholder="Search brands..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowResults(true)
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                    }}
                  >
                    {searchQuery ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {showResults && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md">
                    <ScrollArea className="h-[200px]">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectBrand(brand.title)}
                          >
                            <div className="font-medium">{brand.title}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">No brands found</div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>

              {selectedBrands.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBrands.map((brand, index) => (
                    <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1">
                      <span className="mr-1">{brand.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveBrand(brand.title)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
