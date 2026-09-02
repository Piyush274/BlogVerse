import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useNavigate } from "react-router-dom";

interface ArticleSearchInputProps {
  onSearchChange?: (text: string) => void;
}

const ArticleSearchInput: React.FC<ArticleSearchInputProps> = ({ onSearchChange }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchText = searchParams.get("search") || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    if (onSearchChange) {
      onSearchChange(search);
    } else {
      navigate(search ? `/articles?search=${encodeURIComponent(search)}` : "/articles");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          name="search"
          defaultValue={searchText}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-6 text-lg rounded-xl bg-background/70 border-border/80"
        />
      </div>
    </form>
  );
};

export default ArticleSearchInput;
