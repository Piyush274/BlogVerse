import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SearchInput: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    if (search.trim()) {
      navigate(`/articles?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/articles");
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          defaultValue={searchParams.get("search") || ""}
          placeholder="Search articles..."
          className="pl-10 w-48 focus-visible:ring-1"
        />
      </div>
    </form>
  );
};

export default SearchInput;
