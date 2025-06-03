"use client";
import { searchArticle } from "@/actions/searchArticle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchInput = () => {
  const params = useSearchParams();
  
  return (
    <form action={searchArticle}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          defaultValue={params.get("search") || ""} //"whatever search will be stored in the URL
          placeholder="Search articles..."
          className="pl-10 w-48 focus-visible:ring-1"
        />
      </div>
    </form>
  );
};

export default SearchInput;