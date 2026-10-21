import type { Metadata } from "next";

import ProductPage from "@/components/product/product-page";
import { WatchVisual } from "@/components/product/product-visuals";
import { products, siblingsOf } from "@/components/product/products";

const product = products.watch;

export const metadata: Metadata = {
  title: product.title,
  description: product.description,
  openGraph: {
    title: product.title,
    description: product.description,
    type: "website",
  },
};

export default function WatchPage() {
  return (
    <ProductPage
      job={product.job}
      headline={product.headline}
      lede={product.lede}
      visual={<WatchVisual />}
      capabilities={product.capabilities}
      proof={product.proof}
      next={siblingsOf("watch")}
    />
  );
}
