import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Article, deleteArticle } from "@/api/articles.api";
import { toast } from "sonner";
import { Loader2, Edit3, Trash2 } from "lucide-react";

type RecentArticlesProps = {
  articles: Article[];
  onArticleDeleted: (id: string) => void;
};

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles, onArticleDeleted }) => {
  return (
    <Card className="mb-8 border bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Your Articles</CardTitle>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {articles.length} total
          </span>
        </div>
      </CardHeader>
      {!articles.length ? (
        <CardContent className="text-center py-12 text-muted-foreground">
          No articles found. Start writing by clicking "New Article"!
        </CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => {
                const articleId = article.id || (article as any)._id;
                return (
                  <TableRow key={articleId}>
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link
                        to={`/articles/${articleId}`}
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">
                        {article.category}
                      </span>
                    </TableCell>
                    <TableCell>{article.comments?.length || 0}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/dashboard/articles/${articleId}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Edit3 className="h-3.5 w-3.5" /> Edit
                          </Button>
                        </Link>
                        <DeleteButton
                          articleId={articleId}
                          onDeleted={() => onArticleDeleted(articleId)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default RecentArticles;

type DeleteButtonProps = {
  articleId: string;
  onDeleted: () => void;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ articleId, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteArticle(articleId);
      toast.success("Article deleted successfully");
      onDeleted();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      disabled={isDeleting}
      variant="destructive"
      size="sm"
      className="gap-1"
      onClick={handleDelete}
    >
      {isDeleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </>
      )}
    </Button>
  );
};
