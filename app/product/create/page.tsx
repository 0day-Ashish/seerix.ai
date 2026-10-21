import type { Metadata } from "next";

import ProductPage from "@/components/product/product-page";
import { CreateVisual } from "@/components/product/product-visuals";
import { products, siblingsOf } from "@/components/product/products";

const product = products.create;

export const metadata: Metadata = {
  title: product.title,
  description: product.description,
  openGraph: {
    title: product.title,
    description: product.description,
    type: "website",
  },
};

export default function CreatePage() {
  return (
    <ProductPage
      job={product.job}
      headline={product.headline}
      lede={product.lede}
      visual={<CreateVisual />}
      capabilities={product.capabilities}
      proof={product.proof}
      next={siblingsOf("create")}
    />
  );
}
