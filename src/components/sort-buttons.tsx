'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/use-translations";
import { Button } from "@/components/ui/button";

export function SortButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslations();

  const currentSort = searchParams.get("sort") || "newest";

  const handleSort = (sort: "newest" | "oldest") => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={currentSort === "newest" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSort("newest")}
        className="select-none"
      >
        {t('sortNewest')}
      </Button>
      <Button
        variant={currentSort === "oldest" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSort("oldest")}
        className="select-none"
      >
        {t('sortOldest')}
      </Button>
    </div>
  );
}
