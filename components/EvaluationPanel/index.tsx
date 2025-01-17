"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BookmarkSimple, BookOpen, Check, X } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

import { api } from "@/lib/axios";

import { useToast } from "@/hooks/use-toast";

import { handleSignIn } from "@/components/AuthOptionButtons";
import { Avatar } from "@/components/Avatar";
import { type Rating } from "@/components/PopularBooks";
import { RatingStars } from "@/components/RatingStars";
import { StarRating } from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import GitHubIcon from "@/assets/icons/github-icon.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";

const ratingFormSchema = z.object({
  description: z.string().max(450),
  rate: z
    .number()
    .min(1, { message: "Para continuar, é necessário atribuir uma nota." })
    .max(5),
});

type RatingFormData = z.infer<typeof ratingFormSchema>;

interface ApiErrorResponse {
  code:
    | "ALREADY_RATED"
    | "BOOK_ID_MISSING"
    | "CHECK_RATING_ERROR"
    | "USER_ID_MISSING";
  error: string;
}

interface BookDataRating extends Rating {
  user: {
    id: string;
    name: string;
    email: string | null;
    avatar_url: string;
    created_at: string;
  };
}

interface BookDataCategories {
  book_id: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface BookReviewedData {
  hasRated: boolean;
}

interface BookData {
  book: {
    id: string;
    name: string;
    author: string;
    summary: string;
    cover_url: string;
    total_pages: number;
    created_at: Date;
    categories: BookDataCategories[];
    ratings: BookDataRating[];
    avgRating: number;
  };
}

interface EvaluationPanelProps {
  id: string | null;
  onClosed: () => void;
}

export function EvaluationPanel({ id, onClosed }: EvaluationPanelProps) {
  const { data: session, status: sessionStatus } = useSession();

  const [authDiagloOpen, setAuthDiagloOpen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isRatingFormVisible, setIsRatingFormVisible] = useState(false);

  const { toast } = useToast();

  const maxLength = 450;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      description: "",
      rate: 0,
    },
  });

  const { data: bookReviewed, isLoading: bookReviewedLoading } =
    useQuery<BookReviewedData>({
      queryKey: ["book-has-reviewed", session?.user.id],
      queryFn: async () => {
        const response = await api.get(`/books/details/${id}/has-reviewed`, {
          params: {
            userId: session?.user.id,
          },
        });

        return response.data;
      },
      enabled: !!session?.user.id && !!id,
    });

  const { data, isLoading } = useQuery<BookData>({
    queryKey: ["book-detail", id],
    queryFn: async () => {
      const response = await api.get(`/books/details/${id}`);

      return response.data;
    },
    enabled: !!id,
  });

  function handleResetState() {
    reset();
    setIsRatingFormVisible(false);
    onClosed();
  }

  async function handleRateBook(data: RatingFormData) {
    const { description, rate } = data;

    try {
      await api.post(`/books/${id}/rate`, {
        userId: session?.user.id,
        description,
        rate,
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;

      if (error.response?.data?.code === "ALREADY_RATED") {
        toast({
          variant: "destructive",
          title: "Ops!",
          description: "Você já avaliou esse livro",
        });
      }
    }

    handleResetState();
  }

  return (
    <>
      <SheetContent className="custom-scrollbar w-full overflow-y-auto border-gray-800 bg-gray-800 p-12 sm:max-w-[660px]">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-gray-100">
            Detalhes do livro
          </SheetTitle>
          <SheetDescription className="text-base text-gray-100">
            Você pode avaliar e acompanhar outras avaliações de outros usuários
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 flex flex-col gap-10">
          {isLoading || !data ? (
            <>
              <Skeleton className="h-[400px] w-full rounded-md bg-gray-500" />

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-sm bg-gray-500" />

                  <Skeleton className="h-4 w-16 rounded-sm bg-gray-500" />
                </div>

                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-40 w-full rounded-md bg-gray-500"
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md bg-gray-700 px-8 py-6">
                <div className="flex gap-8 border-b border-b-gray-600 pb-10">
                  <Image
                    src={data.book.cover_url}
                    width={170}
                    height={242}
                    alt={data.book.name}
                    className="h-60 w-40"
                  />

                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{data.book.name}</h3>
                      <h4 className="text-base text-gray-300">
                        {data.book.author}
                      </h4>
                    </div>

                    <div>
                      <RatingStars rate={data.book.avgRating} />
                      <p className="text-sm text-gray-400">
                        {data.book.ratings.length} avaliações
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-start gap-14 px-0 py-6">
                  <div className="flex items-center gap-4">
                    <BookmarkSimple size={24} className="text-green-100" />

                    <div>
                      <h5 className="text-sm text-gray-300">Categoria</h5>

                      <p className="text-base font-bold">
                        {data.book.categories
                          .map((category) => category.category.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <BookOpen size={24} className="text-green-100" />

                    <div>
                      <h5 className="text-sm text-gray-300">Páginas</h5>

                      <p className="text-base font-bold">
                        {data.book.total_pages}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm text-gray-200">Avaliações</h2>

                  {bookReviewedLoading ? (
                    <Skeleton className="h-4 w-16 rounded-sm bg-gray-500" />
                  ) : (
                    <>
                      {!bookReviewed?.hasRated && (
                        <button
                          type="button"
                          className="text-base font-bold text-purple-100"
                          onClick={() => {
                            if (sessionStatus === "unauthenticated") {
                              setAuthDiagloOpen(true);
                            }

                            if (sessionStatus === "authenticated") {
                              setIsRatingFormVisible(true);
                            }
                          }}
                        >
                          Avaliar
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {isRatingFormVisible && (
                    <div className="flex w-full flex-col gap-6 rounded-md bg-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar
                            image={session?.user.avatar_url ?? undefined}
                            size="sm"
                          />

                          <h5 className="text-base font-bold">
                            {session?.user.name}
                          </h5>
                        </div>

                        <StarRating onRate={(rate) => setValue("rate", rate)} />
                      </div>

                      <form
                        onSubmit={handleSubmit(handleRateBook)}
                        className="flex flex-col items-end gap-3"
                      >
                        <div className="relative w-full rounded-sm border-gray-500 bg-gray-800">
                          <Textarea
                            placeholder="Escreva sua avaliação"
                            maxLength={maxLength}
                            className="custom-scrollbar min-h-32 border-0 bg-transparent text-sm text-gray-200"
                            {...register("description")}
                            onChange={(event) => {
                              setCharCount(event.target.value.length);
                            }}
                          />

                          <span className="absolute bottom-2 right-3 text-xs text-[#7C7C8A]">
                            {charCount}/{maxLength}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            className="h-10 w-10 bg-gray-600"
                            onClick={handleResetState}
                          >
                            <X size={24} className="text-purple-100" />
                          </Button>

                          <Button
                            type="submit"
                            className="h-10 w-10 bg-gray-600"
                            disabled={isSubmitting}
                          >
                            <Check size={24} className="text-green-100" />
                          </Button>
                        </div>

                        <p className="text-sm text-red-500">
                          {errors.rate?.message}
                        </p>
                      </form>
                    </div>
                  )}

                  {data.book.ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex flex-col gap-5 rounded-md bg-gray-700 p-6"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar image={rating.user.avatar_url} size="sm" />

                          <div>
                            <h5 className="text-base font-bold">
                              {rating.user.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                              {dayjs().to(dayjs(rating.created_at))}
                            </p>
                          </div>
                        </div>

                        <RatingStars rate={rating.rate} />
                      </div>

                      <p className="text-sm text-gray-300">
                        {rating.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      <AlertDialog open={authDiagloOpen} onOpenChange={setAuthDiagloOpen}>
        <AlertDialogContent className="max-w-2xl rounded-md border-gray-700 bg-gray-700 px-16 py-14">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-xl font-bold">
              Faça login para deixar sua avaliação
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-base text-gray-100">
              Escolha uma das opções abaixo
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mb-5 mt-10 flex flex-col gap-4">
            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
              onClick={() => handleSignIn("google")}
            >
              <Image src={GoogleIcon} alt="" />
              Entrar com Google
            </button>

            <button
              type="button"
              className="flex items-center gap-5 rounded-lg bg-gray-600 px-6 py-5 transition-all duration-300 hover:bg-gray-700"
              onClick={() => handleSignIn("github")}
            >
              <Image src={GitHubIcon} alt="" />
              Entrar com GitHub
            </button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-gray-100">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
