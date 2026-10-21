import type { Metadata } from "next";

import ProductPage from "@/components/product/product-page";
import { PrioritizeVisual } from "@/components/product/product-visuals";
import { products, siblingsOf } from "@/components/product/products";

const product = products.prioritize;

export const metadata: Metadata = {
  title: product.title,
  description: product.description,
  openGraph: {
    title: product.title,
    description: product.description,
    type: "website",
  },
};

export default function PrioritizePage() {
  return (
    <ProductPage
      job={product.job}
      headline={product.headline}
      lede={product.lede}
      visual={<PrioritizeVisual />}
      capabilities={product.capabilities}
      proof={product.proof}
      next={siblingsOf("prioritize")}
    />
  );
}
