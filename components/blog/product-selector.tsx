"use client "
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, ProductList } from "@/types/products";
import { Card } from "../ui/card";
import { BlogFormValues } from "./blog-post-form";
import { UseFormReturn } from "react-hook-form";

export function ProductSelector({
  form,
}: {
  form: UseFormReturn<BlogFormValues>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
  const storedProducts = localStorage.getItem("selectedProducts");
  return storedProducts ? JSON.parse(storedProducts) : [];
  });
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [scrollPosition, setScrollPosition] = useState(0); // To track scroll position

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";

  useEffect(() => {
    axios
      .get<ProductList>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/read_products/fetch`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
        }
      )
      .then((response) => {
        if (response.data.content) {
          setProducts(response.data.content);
          setFilteredProducts(response.data.content);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_code.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products); // reset to full list when search is cleared
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false); // Close dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const handleSelectProduct = (productCode: string) => {
    const selectedProduct = filteredProducts.find(
      (product) => product.product_code === productCode
    );
    if (
      selectedProduct &&
      !selectedProducts.some((product) => product.product_code === productCode)
    ) {
      const updatedSelectedProducts = [...selectedProducts, selectedProduct];
      setSelectedProducts(updatedSelectedProducts);
      localStorage.setItem("selectedProducts", JSON.stringify(updatedSelectedProducts));

      // Update the form value with the selected product codes
      const currentProductCodes = form.getValues("product_codes");
      form.setValue("product_codes", [...currentProductCodes, productCode]);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRemoveProduct = (productCode: string) => {
    const updatedSelectedProducts = selectedProducts.filter(
      (product) => product.product_code !== productCode
    );
    setSelectedProducts(updatedSelectedProducts);
    localStorage.setItem("selectedProducts", JSON.stringify(updatedSelectedProducts));

    // Update the form value after product is removed
    const currentProductCodes = form.getValues("product_codes");
    form.setValue(
      "product_codes",
      currentProductCodes.filter((code) => code !== productCode)
    );
  };

  // Keyboard navigation handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) => {
        const nextIndex = Math.min(filteredProducts.length - 1, prevIndex + 1);
        return nextIndex;
      });
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      const selectedProduct = filteredProducts[focusedIndex];
      handleSelectProduct(selectedProduct.product_code);
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && resultsRef.current) {
      const focusedElement = resultsRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [focusedIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop); // Track scroll position
    }
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
                    onKeyDown={handleKeyDown} // Attach keyboard event listener
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0"
                    onClick={() => {
                      setSearchQuery(""); // Reset searchQuery
                      setFilteredProducts([]); // Reset filtered products to empty
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
                  <div
                    className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-md"
                    ref={resultsRef}
                  >
                    <ScrollArea
                      className="h-[200px]"
                      ref={scrollRef}
                      onScroll={handleScroll} // Track scroll
                    >
                      <div ref={resultsRef}>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                          <div
                            key={product.product_code}
                            className={`p-2 hover:bg-muted cursor-pointer ${
                              focusedIndex === index ? "bg-muted" : ""
                            }`}
                            onClick={() =>
                              handleSelectProduct(product.product_code)
                            }
                            ref={resultsRef}
                            onMouseEnter={() => setFocusedIndex(index)} // Change focus on mouse enter
                          >
                            <div className="font-medium">{product.item_name}</div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>{product.product_code}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          No products found
                        </div>
                      )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>

              {selectedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full mt-2">
                  {selectedProducts.map((product) => (
                    <Card
                      key={product.product_code}
                      className="p-2 relative gap-4 w-full border-primary grid grid-cols-6"
                    >
                      <div className="overflow-hidden rounded-sm shadow">
                        <img
                          src={product.image_urls[0]}
                          alt={product.name}
                          className="product-image h-20 w-20 object-contain bg-gray-50"
                        />
                      </div>
                      <div className="col-span-4">
                        <span className="mr-1 font-semibold">
                          {product.item_name}
                        </span>
                        <p className="line-clamp-1 text-xs pt-1 text-gray-500">
                          {product.description}
                        </p>
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
