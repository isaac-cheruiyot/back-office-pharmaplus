"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UseFormReturn } from "react-hook-form";
import { PlusCircle, Search, X } from "lucide-react";
import { BlogFormValues } from "./blog-post-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "../ui/card";
import { TopicItem, TopicResponse } from "@/types/topics";
import { CategoryGroup, CategoryItem, CategoryTier } from "@/types/category";

export function TopicSelector({
  form,
}: {
  form: UseFormReturn<BlogFormValues>;
}) {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [productGroups, setProductGroups] = useState<CategoryTier>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>(""); // Store the selected group
  const [topicCommandOpen, setTopicCommandOpen] = useState(false);
  const [newTopicDialogOpen, setNewTopicDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || "";
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || "";
  const authHeader = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
        "base64"
      )}`,
    },
  };

  const allowedProductGroups = [
    "PHARMA", 
    "VITAMINS & SUPP", 
    "VETERINARY PRODUCTS", 
    "BODY BUILDING", 
    "STATIONARY", 
    "LIFESTYLE", 
    "GENERAL", 
    "NON-PHARMA", 
    "BEAUTY & COSMETICS"
  ];
  
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get<TopicResponse>(
          "https://web.pharmaplus.co.ke/ecmws/read_blog_topics/fetch",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${Buffer.from(
                `${username}:${password}`
              ).toString("base64")}`,
            },
          }
        );

        if (Array.isArray(res.data.content)) {
          setTopics(res.data.content);
          console.log("Fetched topics: ", res.data.content);
        }
      } catch (error) {
        console.error("Failed to fetch topics", error);
      }
    };

    fetchTopics();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get<CategoryGroup[]>(
        "https://web.pharmaplus.co.ke/ecmws/read_top_categories/fetch",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${username}:${password}`
            ).toString("base64")}`,
          },
        }
      );

      const data = res.data;
      if (Array.isArray(data)) {
        // Now we directly set the fetched data as CategoryGroup[]
        setProductGroups(data);
        console.log("Mapped Category Groups:", data);
        console.log("Fetched categories: ", data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectTopic = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      form.setValue("topic_id", topic.id);
      form.setValue("new_topic", undefined);
      setTopicCommandOpen(false);
    }
  };

  const handleCreateNewTopic = () => {
    form.setValue("topic_id", "");
    form.setValue("new_topic", {
      topic: "",
      product_group: selectedGroup || "",
      tags: [],
    });
    setNewTag("");
    setNewTopicDialogOpen(true);
  };

  const handleSaveNewTopic = async () => {
    const newTopicData = form.getValues().new_topic;
    if (!newTopicData?.topic) return;
  
    try {
      // Prepare the new tags array
      const newTags = newTag ? [...tags, newTag] : tags; // Simply append the new tag
  
      // Create the payload (combine newTopicData with the newTags)
      const payload = {
        ...newTopicData, // Spread the properties of newTopicData
        tags: newTags,
        id: null, // Add the tags
      };
  
      // Log the payload to the console
      console.log('Payload to be sent:', payload);
  
      // Send the POST request with the payload
      const res = await axios.post(
        "https://web.pharmaplus.co.ke/ecmws/write_blog_topics/create_or_update",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(
              `${username}:${password}`
            ).toString("base64")}`,
          },
        }
      );
  
      console.log('Response:', res.data); // Handle response if needed
  
      // Assuming the response returns the newly created topic, set it as the selected topic
      const createdTopic = res.data.topic; // Adjust this based on the actual response structure
      if (createdTopic) {
        setSelectedTopic(createdTopic);
        form.setValue("topic_id", createdTopic.id); // Set the form value to the created topic ID
        form.setValue("new_topic", {
          topic:"",
          product_group:"",
          tags:[],
        }); // Reset the new topic form
        setNewTag(""); // Reset the new tag input
        setNewTopicDialogOpen(false); // Close the new topic dialog
      }
    } catch (error) {
      console.error("Error saving new topic:", error);
      // Handle error appropriately
    }
  };
  
  
  

  const filteredTopics = searchQuery
    ? topics.filter((t) =>
        t.topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topics;

  return (
    <FormField
      control={form.control}
      name="topic_id"
      render={() => (
        <FormItem className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Topic</FormLabel>

            <Dialog
              open={newTopicDialogOpen}
              onOpenChange={setNewTopicDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateNewTopic}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Topic
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Topic Name Field */}
                  <FormField
                    control={form.control}
                    name="new_topic.topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter topic name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Selection */}
                  <FormField
                    control={form.control}
                    name="new_topic.product_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Group</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                              role="combobox"
                            >
                              {field.value || "Select a category..."}
                              <Search className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  <ScrollArea className="h-[200px]">
                                    {/* {productGroups.map((category, index) => (
                                      <CommandItem
                                        key={index} // You can use `category.category` here if it's guaranteed to be unique
                                        onSelect={() => {
                                          field.onChange(category.category); // Update selected category
                                          setSelectedGroup(category.category); // Update state for selected category
                                        }}
                                      >
                                        {category.category}{" "}
                                       
                                      </CommandItem>
                                    ))} */}
                                    {allowedProductGroups.map((category, index) => (
                                      <CommandItem
                                        key={index} // You can use `category.category` here if it's guaranteed to be unique
                                        onSelect={() => {
                                          field.onChange(category); // Update selected category
                                          setSelectedGroup(category); // Update state for selected category
                                        }}
                                      >
                                        {category}{" "}
                                        {/* Render the category name */}
                                      </CommandItem>
                                    ))}
                                  </ScrollArea>
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />

                  {/* Tags Section */}
                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() =>
                              setTags((prev) =>
                                prev.filter((t) => t.index !== tag.index)
                              )
                            }
                          />
                        </Badge>
                      ))}
                    </div>

                    <Input
                      className="mt-3"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Type and press enter to add"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.trim()) {
                          e.preventDefault();
                          setTags((prevTags) => [
                            ...prevTags,
                            newTag,
                          ]);
                          setNewTag("");
                        }
                      }}
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNewTopic}>Save Topic</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <FormControl>
            <Popover open={topicCommandOpen} onOpenChange={setTopicCommandOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedTopic?.topic || "Select a topic..."}
                  <div className="flex items-center">
                    {selectedTopic && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          form.setValue("topic_id", null);
                          setSelectedTopic(null);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <Search className="h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search topics..."
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No topics found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[200px]">
                        {filteredTopics.map((topic) => (
                          <CommandItem
                            key={topic.id}
                            onSelect={() => handleSelectTopic(topic.id)}
                          >
                            {topic.topic}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
