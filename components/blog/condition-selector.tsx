"use client";

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
import { Condition } from "@/types/ecm"; // Make sure the import points to the correct type for conditions

export function ConditionSelector({
  form,
}: {
  form: UseFormReturn<BlogFormValues>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedConditionIds = form.watch("conditions") || []; // Renamed from brands to conditions
  const selectedConditions = conditions.filter((condition) =>
    selectedConditionIds.includes(condition.title)
  );

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";

  useEffect(() => {
    axios
      .get<Condition[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/read_conditions_info/fetch`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${username}:${password}`
            ).toString("base64")}`,
          },
        }
      )
      .then((response) => {
        if (Array.isArray(response.data)) {
          setConditions(response.data);
          setFilteredConditions(response.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch conditions", error);
      });
  }, []);

  // Filter conditions based on search
  useEffect(() => {
    if (searchQuery) {
      setFilteredConditions(
        conditions.filter((condition) =>
          condition.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredConditions(conditions);
    }
  }, [searchQuery, conditions]);

  useEffect(() => {
    const savedConditions = localStorage.getItem("selectedConditions");
    if (savedConditions) {
      const parsed = JSON.parse(savedConditions);
      if (Array.isArray(parsed)) {
        form.setValue("conditions", parsed);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (Array.isArray(values.conditions)) {
        localStorage.setItem(
          "selectedConditions",
          JSON.stringify(values.conditions)
        );
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Detect click outside to close results
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

  const handleSelectCondition = (conditionTitle: string) => {
    const currentConditions = form.getValues().conditions || [];
    if (!currentConditions.includes(conditionTitle)) {
      form.setValue("conditions", [...currentConditions, conditionTitle]);
    }
    setSearchQuery("");
    setShowResults(false);
  };

  const handleRemoveCondition = (conditionTitle: string) => {
    const currentConditions = form.getValues().conditions || [];
    form.setValue(
      "conditions",
      currentConditions.filter((title: string) => title !== conditionTitle)
    );
  };

  const maxVisibleItems = 5; // Set the max number of visible items before scrolling is necessary

  const dynamicHeight =
    filteredConditions.length > maxVisibleItems
      ? 200
      : filteredConditions.length * 40; // Adjust height per item, 40px per item

  return (
    <FormField
      control={form.control}
      name="conditions"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Conditions</FormLabel>
          <FormControl>
            <div className="space-y-4" ref={wrapperRef}>
              <div className="relative">
                <div className="flex">
                  <Input
                    placeholder="Search conditions..."
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
                    <ScrollArea
                      style={{ height: `${dynamicHeight}px` }}
                      className="overflow-auto"
                    >
                      {filteredConditions.length > 0 ? (
                        filteredConditions.map((condition, index) => (
                          <div
                            key={index}
                            className={`p-2 hover:bg-muted cursor-pointer ${
                              selectedConditionIds.includes(condition.title)
                                ? "cursor-not-allowed text-red-300"
                                : ""
                            }`}
                            onClick={() =>
                              !selectedConditionIds.includes(condition.title) &&
                              handleSelectCondition(condition.title)
                            }
                          >
                            <div className="font-medium">{condition.title}</div>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          No conditions found
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                )}
              </div>

              {selectedConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedConditions.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="pl-2 pr-1 py-1"
                    >
                      <span className="mr-1">{condition.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-transparent"
                        onClick={() => handleRemoveCondition(condition.title)}
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
  );
}
