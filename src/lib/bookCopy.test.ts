/// <reference types="node" />
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import type { Tables } from "@/integrations/supabase/types";
import { getBookCopyDefaults } from "./bookCopy";

const book: Tables<"books"> = {
  id: "copy-1", organization_id: "school-1", title: "Science", author: "A. Author",
  isbn: "9781234567890", category: "Science", age_rating: "13+", dewey_decimal: "500",
  summary: "A science summary", cover_image_url: "https://example.com/front.jpg",
  back_cover_image_url: "https://example.com/back.jpg", classification_number: "ACC-001",
  vendor_bill: "BILL-1", price: 450, page_count: 320, publisher: "School Press",
  status: "borrowed", borrowed_by: "student-1", borrowed_at: "2026-10-01",
  due_date: "2026-10-08", created_at: "2026-10-01", copy_number: 1,
  is_damaged: true, damage_notes: "Torn page",
};

describe("new scanned copy", () => {
  test("reuses every existing bibliographic detail", () => {
    assert.deepEqual(getBookCopyDefaults(book), {
      title: "Science", author: "A. Author", isbn: "9781234567890", category: "Science",
      ageRating: "13+", deweyDecimal: "500", summary: "A science summary",
      coverUrl: "https://example.com/front.jpg", backCoverUrl: "https://example.com/back.jpg",
      classificationNumber: "", vendorBill: "BILL-1", price: "450", pageCount: "320",
      publisher: "School Press",
    });
  });
  test("leaves the library accession number blank", () => {
    assert.equal(getBookCopyDefaults(book).classificationNumber, "");
    assert.equal(book.classification_number, "ACC-001");
  });
  test("does not inherit borrowing or damage state", () => {
    const defaults = getBookCopyDefaults(book);
    assert.equal("borrowed_by" in defaults, false);
    assert.equal("is_damaged" in defaults, false);
  });
});