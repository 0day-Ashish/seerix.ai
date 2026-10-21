import type { Metadata } from "next";

import ProductPage from "@/components/product/product-page";
import { DiagnoseVisual } from "@/components/product/product-visuals";
import { products, siblingsOf } from "@/components/product/products";

const product = products.diagnose;

export const metadata: Metadata = {
  title: product.title,
  description: product.description,
  openGraph: {
    title: product.title,
    description: product.description,
    type: "website",
  },
};

export default function DiagnosePage() {
  return (
    <ProductPage
      job={product.job}
      headline={product.headline}
      lede={product.lede}
      visual={<DiagnoseVisual />}
      capabilities={product.capabilities}
      steps={product.steps}
      proof={product.proof}
      next={siblingsOf("diagnose")}
    />
  );
}
