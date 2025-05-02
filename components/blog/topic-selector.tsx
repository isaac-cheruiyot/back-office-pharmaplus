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
import { TopicItem, TopicResponse } from "@/types/topics";
import { CategoryTier } from "@/types/category";
import { Label } from "../ui/label";

export function TopicSelector({
  form,
}: {
  form: UseFormReturn<BlogFormValues>;
}) {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [productGroups, setProductGroups] = useState<CategoryTier>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [topicCommandOpen, setTopicCommandOpen] = useState(false);
  const [newTopicDialogOpen, setNewTopicDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [newProductGroup, setNewProductGroup] = useState("");
  const [newTags, setNewTopicTags] = useState<string[]>([]);
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
    "BEAUTY & COSMETICS",
  ];

  useEffect(() => {
    axios
      .get<TopicResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/read_blog_topics/fetch`,
        authHeader
      )
      .then((res) => {
        if (Array.isArray(res.data.content)) {
          setTopics(res.data.content);
        }
      })
      .catch((error) => console.error("Failed to fetch topics", error));
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/read_top_categories/fetch`,
        authHeader
      )
      .then((res) => setProductGroups(res.data))
      .catch((error) => console.error("Failed to fetch categories", error));
  }, []);

  useEffect(() => {
    // Get the selected topic ID from localStorage
    const savedTopicId = localStorage.getItem("selectedTopicId");

    if (savedTopicId) {
      const topicId = parseInt(savedTopicId, 10);
      const topic = topics.find((t) => t.id === topicId);
      if (topic) {
        setSelectedTopic(topic);
        form.setValue("topic_info.topic", topic.topic);
        form.setValue("topic_info.product_group",topic.productGroup );
        form.setValue("topic_info.tags", topic.tags || []);
        form.setValue("topic_info.tags", topic.tags || []); // Set tags as a form field
      }
    }
  }, [topics]);

  const handleSelectTopic = (topicId: number) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
      form.setValue("topic_info.topic_id", topic.id);
      form.setValue("topic_info.topic", topic.topic); // Set topic as a form field
      form.setValue("topic_info.product_group", topic.productGroup); // Set product group as a form field
      form.setValue("topic_info.tags", topic.tags || []); // Set tags as a form field
      setTopicCommandOpen(false);

      // Save the selected topic ID to localStorage
      localStorage.setItem("selectedTopicId", topic.id.toString());
    }
  };

  const handleSaveNewTopic = async () => {
    if (!newTopicName || !newProductGroup) return;

    const validTags = tags && Array.isArray(tags) ? tags : [];

    try {
      const payload = {
        topic: newTopicName,
        product_group: newProductGroup,
        tags,
        id: null,
      };
      console.log(payload);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/write_blog_topics/create_or_update`,
        payload,
        authHeader
      );

      const createdTopic = res.data.topic;
      if (createdTopic) {
        setTopics((prev) => [...prev, createdTopic]);
        setSelectedTopic(createdTopic);
        form.setValue("topic_info.topic_id", createdTopic.id);
        form.setValue("topic_info.topic", createdTopic.topic); // Set topic as a form field
        form.setValue("topic_info.product_group", createdTopic.product_group); // Set product group as a form field
        form.setValue("topic_info.tags", createdTopic.tags || []); // Set tags as a form field
        setNewTopicName("");
        setNewProductGroup("");
        setTags([]);
        setNewTag("");
        setNewTopicDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving new topic:", error);
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
      name="topic_info.topic_id"
      render={() => (
        <FormItem className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base">Topic</FormLabel>
            <Dialog
              open={newTopicDialogOpen}
              onOpenChange={setNewTopicDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div>
                    <FormLabel>Topic Name</FormLabel>
                    <Input
                      placeholder="Enter topic name"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Group</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {newProductGroup || "Select a category..."}
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
                                {allowedProductGroups.map((category, index) => (
                                  <CommandItem
                                    key={index}
                                    onSelect={() => {
                                      setNewProductGroup(category);
                                      setSelectedGroup(category);
                                    }}
                                  >
                                    {category}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

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
                            className="cursor-pointer"
                            onClick={() => {
                              const filteredTags = tags.filter(
                                (t) => t !== tag
                              );
                              setTags(filteredTags);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        placeholder="Enter a tag and press enter to add "
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTag.trim()) {
                            e.preventDefault();
                            setTags((prev) => [...prev, newTag.trim()]);
                            setNewTag("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="mt-4"
                  onClick={handleSaveNewTopic}
                  disabled={!newTopicName || !newProductGroup}
                >
                  Save Topic
                </Button>
              </DialogContent>
            </Dialog>
          </div>

          <Popover open={topicCommandOpen} onOpenChange={setTopicCommandOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setTopicCommandOpen(!topicCommandOpen)}
              >
                {selectedTopic ? selectedTopic.topic : "Select a topic..."}
                <Search className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search topics..."
                  value={searchQuery}
                  onValueChange={(val) => setSearchQuery(val)}
                />

                <CommandList>
                  <CommandEmpty>No topic found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-[200px]">
                      {filteredTopics.map((topic, index) => (
                        <CommandItem
                          key={index}
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
        </FormItem>
      )}
    />
  );
}
