"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { createPost, updatePost, type CreatePostInput } from "@/lib/firestore/posts";
import { uploadCoverImage } from "@/lib/storage/uploadImage";
import type { Post, PostStatus } from "@/types/blog";

const RichTextEditor = dynamic(
  () => import("@/components/blog/RichTextEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center text-muted-foreground">
        Cargando editor...
      </div>
    ),
  }
);

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

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return trimmed;
}

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
  const esTitle = form.watch("es.title");

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post);

  useEffect(() => {
    if (!slugManuallyEdited) {
      form.setValue("slug", slugify(esTitle), { shouldValidate: true });
    }
  }, [esTitle, slugManuallyEdited, form]);

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    post?.coverImage ?? null
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleCoverImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      const url = await uploadCoverImage(file);
      form.setValue("coverImage", url, { shouldValidate: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.form.saveErrorTitle,
        description: t.form.coverImageUploadError,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const onSubmit = (data: PostFormValues) => {
    startTransition(async () => {
      const payload: CreatePostInput = {
        slug: data.slug,
        coverImage: data.coverImage,
        youtubeVideoId: data.youtubeVideoId
          ? extractYoutubeId(data.youtubeVideoId)
          : undefined,
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
                  <Input
                    placeholder={t.form.slugPlaceholder}
                    {...field}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>{t.form.slugHint}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel>{t.form.coverImageLabel}</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {coverImagePreview && (
                      <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-md border">
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                        {isUploadingImage && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.form.coverImageUploading}
                      </p>
                    )}
                  </div>
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
          <Button type="submit" disabled={isPending || isUploadingImage}>
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
