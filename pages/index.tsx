import React, { useEffect, useState } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getProductsPagination } from "@shopify/products";
import { MetaHead } from "@components/common";
import { Container, Hero } from "@components/ui";
import { CollectionSlide, ProductCard } from "@components/product";
import { generateApiUrl, normalizeProduct } from "@shopify/utils";
import { getAllProductsReviewInfo } from "@firebase/firestore/review";
import type { Product, ProductEdge } from "@shopify/shema";
import { ProductReviewInfo } from "@shopify/types/review";
import useSWR from "swr";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import { microcmsClient } from "service/micro-cms";
import { truncate } from "@lib/truncate";
import { collectionFeatcher } from "@shopify/products/collection";
import Link from "next/link";

const feachProductLength = 10;

const images = [
  "/images/top-banner-1.png",
  "/images/top-banner-2.png",
  "/images/top-banner-3.png",
];
const collectionHandle = "women";
const collection2Handle = "men";
const collection3Handle = "sale";

export const getStaticProps: GetStaticProps = async () => {
  const featureProductsInfo = await getProductsPagination(feachProductLength);
  const featureProducts: Product[] = featureProductsInfo.products.edges.map(
    ({ node: product }) => product
  );
  const productReviewInfos = await getAllProductsReviewInfo(featureProducts);

  const newsList = await microcmsClient.get({
    endpoint: "news",
    queries: { limit: 10 },
  });

  return {
    props: {
      featureProductsInfo,
      productReviewInfos,
      newsList: newsList.contents,
    },
    revalidate: 4 * 60 * 60,
  };
};

const Home = ({
  featureProductsInfo,
  productReviewInfos,
  newsList,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const featureProducts: Product[] = featureProductsInfo.products.edges.map(
    (product: ProductEdge) => product.node
  );
  const [featureProductReviewInfos, setFeatureProductReviewInfos] =
    useState<ProductReviewInfo[]>(productReviewInfos);

  const getCollectionByHandleApiUrl = generateApiUrl({
    type: "GET_COLLECTION_BY_HANDLE",
  });

  const { data: collection } = useSWR(
    [getCollectionByHandleApiUrl, collectionHandle],
    collectionFeatcher
  );
  const { data: collection2 } = useSWR(
    [getCollectionByHandleApiUrl, collection2Handle],
    collectionFeatcher
  );
  const { data: collection3 } = useSWR(
    [getCollectionByHandleApiUrl, collection3Handle],
    collectionFeatcher
  );

  return (
    <>
      <MetaHead />
      <Container>
        <div className="w-full h-fit flex justify-center items-center max-w-[72rem] mx-auto px-4">
          <Splide
            aria-label="おすすめ商品情報"
            options={{
              autoplay: true,
              interval: 6000,
              speed: 2000,
              type: "loop",
              arrows: false,
              gap: "12px",
            }}
          >
            {images.map((src: any, index) => {
              return (
                <SplideSlide
                  key={index}
                  className="relative flex items-cecnter justify-center rounded-md"
                >
                  <Image
                    className="object-fill rounded-md shadow-md overflow-hidden"
                    src={src}
                    width={1440}
                    height={810}
                    alt="image"
                  />
                </SplideSlide>
              );
            })}
          </Splide>
        </div>
        <div>
          <div className="px-8 py-12 max-w-[72rem] mx-auto">
            <p className="font-bold text-lg md:text-xll mb-3">
              売れ筋ランキング
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-center">
              {featureProducts.map((product, index) => {
                return (
                  <div key={product.id} className="relative">
                    <div className="absolute top-0 left-0 h-7 w-7 bg-blue-500 rounded-full border shadow-sm z-20">
                      <div className="h-full w-full flex justify-center items-center">
                        <p className="text-white text-center font-bold">
                          {index + 1}
                        </p>
                      </div>
                    </div>
                    <ProductCard
                      productReviewInfo={featureProductReviewInfos[index]}
                      product={normalizeProduct(product)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="py-12">
          <div className="relative flex items-cecnter justify-center">
            <Image
              className="object-fill shadow-sm overflow-hidden"
              src={"/images/top-banner-1.png"}
              width={1440}
              height={810}
              alt="image"
            />
          </div>
          <div className="relative flex items-cecnter justify-center pt-3">
            <Image
              className="object-fill shadow-sm overflow-hidden"
              src={"/images/top-banner-2.png"}
              width={1440}
              height={810}
              alt="image"
            />
          </div>
          <div className="relative flex items-cecnter justify-center pt-3">
            <Image
              className="object-fill shadow-sm overflow-hidden"
              src={"/images/top-banner-3.png"}
              width={1440}
              height={810}
              alt="image"
            />
          </div>
        </div>
        <div className="px-8 py-12 max-w-[72rem] mx-auto">
          {collection ? (
            <div className="">
              <p className="text-lg">{collection.title}</p>
              <p className="text-sm text-gray-500">{collection.description}</p>
              <div className="grid grid-cols-2 gap-4 w-full pt-3">
                {collection.products.edges.map(({ node: product }) => {
                  return (
                    <div key={product.handle}>
                      <Link href={`/products/${product.handle}`}>
                        <div className="w-full h-fit relative">
                          <Image
                            className="object-center object-cover rounded-md overflow-hidden"
                            src={product.images.edges[0].node.url}
                            width={500}
                            height={300}
                            alt="Product Image"
                          />
                        </div>
                      </Link>
                      <p className="text-xs py-2 text-center">
                        {truncate(product.title, 15)}
                      </p>
                      <p className="text-center flex items-center  justify-end text-xs text-red-500 tracking-[1px]">
                        <span className="text-lg block px-1">
                          ¥
                          {
                            product.priceRange.minVariantPrice.amount.split(
                              "."
                            )[0]
                          }
                        </span>
                        税込
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <Splide
          aria-label="おすすめ商品情報"
          options={{
            autoplay: true,
            interval: 6000,
            speed: 2000,
            type: "loop",
            arrows: false,
            gap: "12px",
          }}
        >
          {images.map((src: any, index) => {
            return (
              <SplideSlide
                key={index}
                className="relative flex items-cecnter justify-center rounded-md"
              >
                <Image
                  className="object-fill rounded-md shadow-md overflow-hidden"
                  src={src}
                  width={1440}
                  height={810}
                  alt="image"
                />
              </SplideSlide>
            );
          })}
        </Splide>
        <div className="py-12 px-8 max-w-[72rem]">
          <div className="h-full w-full space-y-1">
            {collection2 ? <CollectionSlide collection={collection2} /> : null}
            {collection3 ? <CollectionSlide collection={collection3} /> : null}
          </div>
        </div>
        <div className="px-8 max-w-[72rem mx-auto] py-12">
          <Hero
            text={"丹波篠山　黒枝豆"}
            subTitle={"まぼろし屋の思い"}
            subText={
              "当店ではその時期、その場所でしか手に入らないような旬の地域特産物を取り扱っています。普段市場に出回ることのない「まぼろし」の食品を地元の方以外にも味わっていただきたい！そんな思いから私たちのお店が始まりました。"
            }
            imageUrl={"/images/top-bg.jpg"}
          />
        </div>
        <div className="py-12 px-8 max-w-[72rem] mx-auto">
          <div className="w-full flex items-center justify-center mb-8">
            <p className="tracking-[1px] text-lg md:text-xl">
              お知らせ
              <span className="ml-2 text-sm md:text-base text-gray-500">
                / News
              </span>{" "}
            </p>
          </div>
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsList.map((news: any) => {
              return (
                <div key={news.id} className=" border-b mb-12 p-2">
                  <div className="w-full flex items-center justify-between tracking-[2px]">
                    <p className="text-sm text-gray-500">
                      {news.createdAt.split("T")[0].replaceAll("-", "/")}
                    </p>
                    <div className="px-6 py-1 rounded-full border border-indigo-500 text-center mb-2 w-fit">
                      <p className="text-sm text-indigo-500 tracking-[2px]">
                        {news.category.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-bold tracking-[1px]">
                    {news.title}
                  </p>
                  <div className="text-xs md:text-sm tracking-[1px] bg-white p-2 rounded-md my-2">
                    <p>
                      {truncate(news.content.replace(/(<([^>]+)>)/gi, ""), 120)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
