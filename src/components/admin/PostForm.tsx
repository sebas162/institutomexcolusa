"use client";

import { useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/blog/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { createPost, updatePost, type CreatePostInput } from "@/lib/firestore/posts";
import type { Post, PostStatus } from "@/types/blog";

interface PostFormProps {
  post?: Post;
  onSaved: () => void;
  onCancel: () => void;
}

type AdminBlogTranslations = (typeof translations)["es"]["adminBlog"];

function createPostSchema(t: AdminBlogTranslations) {
  const contentSchema = z.object({
    title: z.string().min(3, { message: t.form.validation.titleMin }),
    excerpt: z.string().min(10, { message: t.form.validation.excerptMin }),
    content: z.string().min(20, { message: t.form.validation.contentMin }),
  });

  return z
    .object({
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          message: t.form.validation.slugInvalid,
        }),
      coverImage: z
        .string()
        .url({ message: t.form.validation.coverImageInvalid }),
      youtubeVideoId: z.string().optional(),
      status: z.enum(["draft", "scheduled", "published"]),
      publishAt: z.string().optional(),
      es: contentSchema,
      en: contentSchema,
    })
    .refine(
      (data) => (data.status === "scheduled" ? !!data.publishAt : true),
      {
        message: t.form.validation.publishAtRequired,
        path: ["publishAt"],
      }
    );
}

type PostFormValues = z.infer<ReturnType<typeof createPostSchema>>;

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PostForm({ post, onSaved, onCancel }: PostFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language].adminBlog;

  const schema = useMemo(() => createPostSchema(t), [t]);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: post?.slug ?? "",
      coverImage: post?.coverImage ?? "",
      youtubeVideoId: post?.youtubeVideoId ?? "",
      status: post?.status ?? "draft",
      publishAt: post?.publishAt ? toDatetimeLocalValue(post.publishAt) : "",
      es: {
        title: post?.es.title ?? "",
        excerpt: post?.es.excerpt ?? "",
        content: post?.es.content ?? "",
      },
      en: {
        title: post?.en.title ?? "",
        excerpt: post?.en.excerpt ?? "",
        content: post?.en.content ?? "",
      },
    },
  });

  const status = form.watch("status") as PostStatus;

  const onSubmit = (data: PostFormValues) => {
    startTransition(async () => {
      const payload: CreatePostInput = {
        slug: data.slug,
        coverImage: data.coverImage,
        youtubeVideoId: data.youtubeVideoId || undefined,
        status: data.status,
        publishAt:
          data.status === "scheduled" && data.publishAt
            ? new Date(data.publishAt)
            : null,
        es: {
          title: data.es.title,
          excerpt: data.es.excerpt,
          content: data.es.content,
          images: post?.es.images ?? [],
        },
        en: {
          title: data.en.title,
          excerpt: data.en.excerpt,
          content: data.en.content,
          images: post?.en.images ?? [],
        },
      };

      const result = post
        ? await updatePost(post.id, payload)
        : await createPost(payload);

      if (result.success) {
        toast({
          title: post ? t.form.updateSuccessTitle : t.form.createSuccessTitle,
          description: result.success,
        });
        onSaved();
      } else {
        toast({
          variant: "destructive",
          title: t.form.saveErrorTitle,
          description: result.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">
          {post ? t.form.editTitle : t.form.createTitle}
        </h2>

        <Tabs defaultValue="es" className="w-full">
          <TabsList>
            <TabsTrigger value="es">{t.form.tabEs}</TabsTrigger>
            <TabsTrigger value="en">{t.form.tabEn}</TabsTrigger>
          </TabsList>

          <TabsContent value="es" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="es.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.titleLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.form.titlePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="es.excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.excerptLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.form.excerptPlaceholder}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="es.content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.contentLabel}</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="en" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="en.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.titleLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.form.titlePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="en.excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.excerptLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t.form.excerptPlaceholder}
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="en.content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.contentLabel}</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="space-y-4 border-t pt-6">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.form.slugLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={t.form.slugPlaceholder} {...field} />
                </FormControl>
                <FormDescription>{t.form.slugHint}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.form.coverImageLabel}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.form.coverImagePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtubeVideoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.form.youtubeLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={t.form.youtubePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.form.statusLabel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.form.statusPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">{t.status.draft}</SelectItem>
                    <SelectItem value="scheduled">
                      {t.status.scheduled}
                    </SelectItem>
                    <SelectItem value="published">
                      {t.status.published}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {status === "scheduled" && (
            <FormField
              control={form.control}
              name="publishAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.form.publishAtLabel}</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            {t.form.cancelButton}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.form.saving}
              </>
            ) : (
              t.form.saveButton
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
