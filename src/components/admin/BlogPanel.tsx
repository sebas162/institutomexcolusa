"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { getAllPostsForAdmin, deletePost } from "@/lib/firestore/posts";
import type { Post, PostStatus } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import PostForm from "./PostForm";

const STATUS_BADGE_CLASSES: Record<PostStatus, string> = {
  draft: "bg-gray-500/20 text-gray-700 border-gray-500/30",
  scheduled: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  published: "bg-green-500/20 text-green-700 border-green-500/30",
};

function DeleteButton({
  postId,
  onDeleted,
}: {
  postId: string;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].adminBlog;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(postId);
      if (result.success) {
        toast({ title: t.toast.deleteSuccessTitle, description: result.success });
        onDeleted(postId);
      } else {
        toast({
          variant: "destructive",
          title: t.toast.deleteErrorTitle,
          description: result.error,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.actions.deleteDialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.actions.deleteDialogDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.actions.deleting}
              </>
            ) : (
              t.actions.delete
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function BlogPanel() {
  const { language } = useLanguage();
  const t = translations[language].adminBlog;

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const loadPosts = () => {
    setPostsLoading(true);
    getAllPostsForAdmin().then((fetchedPosts) => {
      setPosts(fetchedPosts);
      setPostsLoading(false);
    });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setView("create");
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setView("edit");
  };

  const handleSaved = () => {
    setView("list");
    setEditingPost(null);
    loadPosts();
  };

  const handleCancel = () => {
    setView("list");
    setEditingPost(null);
  };

  return (
    <div>
      {view === "list" && (
        <div className="mb-6">
          <Button onClick={handleNewPost}>{t.newPost}</Button>
        </div>
      )}

      {view !== "list" ? (
        <Card>
          <CardContent className="pt-6">
            <PostForm
              post={editingPost ?? undefined}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.table.coverHeader}</TableHead>
                  <TableHead>{t.table.titleHeader}</TableHead>
                  <TableHead>{t.table.statusHeader}</TableHead>
                  <TableHead>{t.table.dateHeader}</TableHead>
                  <TableHead className="text-right">
                    {t.table.actionsHeader}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-12 w-12 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-16 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : posts.length > 0 ? (
                  posts.map((post) => {
                    const date = post.publishAt ?? post.createdAt;
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                            {post.coverImage && (
                              <Image
                                src={post.coverImage}
                                alt={post.es.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {post.es.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={STATUS_BADGE_CLASSES[post.status]}
                          >
                            {t.status[post.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{date.toLocaleDateString()}</TableCell>
                        <TableCell className="flex justify-end items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                          >
                            {t.actions.edit}
                          </Button>
                          <DeleteButton postId={post.id} onDeleted={handleDeleted} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t.table.noPosts}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
