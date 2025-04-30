import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { UseFormReturn } from "react-hook-form";
import { Search, X } from "lucide-react";
import type { BlogFormValues } from "./blog-post-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, ProductList } from "@/types/products";
import { Card } from "../ui/card";

export function ProductSelector({
  form,
}: {
  form: UseFormReturn<BlogFormValues>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Correctly type filtered products
  const [showResults, setShowResults] = useState(false);

  // Set initial products state to an empty array
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]); // Correctly type selected products

  const wrapperRef = useRef<HTMLDivElement>(null);

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";

  // Fetch products from API
  useEffect(() => {
    axios
      .get<ProductList>(
        "https://web.pharmaplus.co.ke/ecmws/read_products/fetch",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      )
      .then((response) => {
        if (response.data.content) {
          setFilteredProducts(response.data.content); // Set the product list
        }
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      });
  }, []);

  // Handle search query and filtering products
  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product.item_name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.product_code
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  // Close results when clicking outside the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Select product
  const handleSelectProduct = (productCode: string) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.product_code === productCode
    );
    if (
      selectedProduct &&
      !selectedProducts.some((product) => product.product_code === productCode)
    ) {
      setSelectedProducts((prevProducts) => [...prevProducts, selectedProduct]);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  // Remove product from selection
  const handleRemoveProduct = (productCode: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.product_code !== productCode)
    );
  };

  return (
    <FormField
      control={form.control}
      name="product_codes"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Products</FormLabel>
          <FormControl>
            <div className="space-y-4" ref={wrapperRef}>
              <div className="relative">
                <div className="flex">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                  >
                    {searchQuery ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {showResults && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md">
                    <ScrollArea className="h-[200px]">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product.product_code}
                            className="p-2 hover:bg-muted cursor-pointer"
                            onClick={() =>
                              handleSelectProduct(product.product_code)
                            }
                          >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>{product.category}</span>
                              <span>{product.product_code}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          No products found
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full mt-2">
                  {selectedProducts.map((product) => (
                    <Card
                      key={product.product_code}
                      className="p-2 relative gap-4 w-full border-primary grid grid-cols-6 "
                    >
                        {/* product image */}
                      <div className="overflow-hidden rounded-sm shadow">
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="product-image h-20 w-20 object-contain bg-gray-50"
                        />
                      </div>
                      {/* product desc */}
                      <div className="col-span-4">
                        {/* Product name */}
                        <span className="mr-1 font-semibold">
                          {product.item_name}
                        </span>

                        {/* Product description */}
                        <p className="line-clamp-1 text-xs pt-1 text-gray-500">
                          {product.description}
                        </p>

                        {/* Price and stock status */}
                        <p className="text-sm pt-1 text-gray-800">
                          Price:{" "}
                          <span className="font-bold">${product.price}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 absolute top-2 right-2 w-4 ml-1 hover:bg-transparent"
                        onClick={() =>
                          handleRemoveProduct(product.product_code)
                        }
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
