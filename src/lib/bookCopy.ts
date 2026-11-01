import type { Tables } from "@/integrations/supabase/types";

// Only bibliographic fields are reused; circulation and condition belong to a copy.
export function getBookCopyDefaults(book: Tables<"books">) {
  return {
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    ageRating: book.age_rating ?? "",
    deweyDecimal: book.dewey_decimal ?? "",
    summary: book.summary ?? "",
    coverUrl: book.cover_image_url ?? "",
    backCoverUrl: book.back_cover_image_url ?? "",
    classificationNumber: "",
    vendorBill: book.vendor_bill ?? "",
    price: book.price == null ? "" : String(book.price),
    pageCount: book.page_count == null ? "" : String(book.page_count),
    publisher: book.publisher ?? "",
  };
}