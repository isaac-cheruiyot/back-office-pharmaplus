import React, { useState, useEffect } from 'react'
import { Topic } from "@/types/ecm"
import { CategoryItem } from '@/types/category'
import axios from 'axios'

const AddTopic = () => {
    const [topics, setTopics] = useState<Topic | null>(null)  // Initialize with null
    const [categories, setCategories] = useState<CategoryItem[]>([])  // Initialize as an empty array
    const [tags, setTags] = useState<string[]>([])  // Assuming you want tags as an array of strings
    const [searchTerm, setSearchTerm] = useState<string>('')  // State to store the search term for categories

    const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER || ""
    const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS || ""

    // Function to fetch categories based on search term
    const fetchCategories = async (search: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/read_top_categories/fetch`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                },
                params: { search }
            })
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    useEffect(() => {
        if (searchTerm) {
            fetchCategories(searchTerm)
        } else {
            setCategories([])  // Clear categories if no search term is provided
        }
    }, [searchTerm])  // Re-fetch categories whenever the search term changes

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(','))  // Assuming tags are comma-separated
    }

    // Topic input change handler
    const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (topics) {
            setTopics({ ...topics, topic: e.target.value })  // Update the topic field of the topic object
        }
    }

    return (
        <div>
            {/* Topic Input */}
            <label>
                Topic
                <input
                    type="text"
                    value={topics?.topic || ''}
                    onChange={handleTopicChange}
                />
            </label>
            
            {/* Category Search Input */}
            <label>
                Search Categories
                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..."
                />
            </label>

            {/* Categories List (search results) */}
            <div>
                {categories.map((category) => (
                    <div key={category.name}>
                        <label>
                            <input type="checkbox" />
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>

            {/* Tags Input */}
            <label>
                Tags
                <input
                    type="text"
                    value={tags.join(', ')}
                    onChange={handleTagChange}
                    placeholder="Enter tags, separated by commas"
                />
            </label>
        </div>
    )
}

export default AddTopic
