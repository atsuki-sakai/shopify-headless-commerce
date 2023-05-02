import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { generateApiUrl, normalizeProduct } from "@shopify/utils";
import useSWR from "swr";
import { Container, ErrorView, LoadingView } from "@components/ui";
import { ProductCard } from "@components/product";
import { ProductConnection } from "@shopify/shema";
import { HOSTING_URL } from "@shopify/const";
import { Link as Scroll } from "react-scroll";
import { Product } from "@shopify/shema";
import idConverter from "@lib/id-converter";
import { firebaseApiUrl } from "@firebase/utils";
import { ProductReviewInfo } from "@firebase/types/review";

const ProductQuery = () => {
  const router = useRouter();
  const query = router.query as any;

  const graphQuery = query.graphQuery as string;

  const categoryName: string | undefined = query.categoryName;

  const [actionType, setActionType] = useState<"NEXT" | "PREV">("NEXT");
  const [cursor, setCursor] = useState("");
  const [reverse, setReverse] = useState(false);
  const [limit, setLimit] = useState(20);

  const searchResultLengthApiUrl = generateApiUrl({
    type: "SEARCH_RESULT_LENGTH",
  });

  const searchResultLengthFetcher = async (
    url: string,
    query: string
  ): Promise<number> => {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        throw Error(e.message);
      });
    return response.data.products.edges.length
      ? response.data.products.edges.length
      : 0;
  };

  const fetcher = async (url: string): Promise<ProductConnection> => {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
    });
    const { data } = await response.json();
    return data.data.products;
  };

  const parameters = `cursor=*${cursor}&query=*${graphQuery}&type=*${actionType}&reverse=*${reverse}&limit=*${limit}`;
  const url = `${HOSTING_URL}/api/products/search/${parameters}`;
  const { data: productsConnect, error } = useSWR(
    url,
    router.isReady ? fetcher : null
  );

  const { data: resultLength } = useSWR(
    [searchResultLengthApiUrl, graphQuery],
    router.isReady ? searchResultLengthFetcher : null
  );

  const getProductReviewInfosFetcher = async (
    url: string,
    products: Product[]
  ) => {
    const productReviewInfos = await Promise.all(
      products.map(async (product) => {
        const response = await fetch(url, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            productId: idConverter({ type: "PRODUCT" }, product.id),
          }),
        });
        const data = await response.json();
        return data.productReviewInfo;
      })
    );
    return productReviewInfos;
  };

  const getProductReviewInfosApiUrl = firebaseApiUrl({
    type: "GET_PRODUCT_REVIEW_INFO",
  });
  const { data: productInfos } = useSWR(
    [
      getProductReviewInfosApiUrl,
      productsConnect?.edges.map(({ node: product }) => product),
    ],
    productsConnect ? getProductReviewInfosFetcher : null
  );

  useEffect(() => {
    return () => {
      setCursor("");
      setActionType("NEXT");
    };
  }, [router.isReady, graphQuery, productInfos]);

  if (error) {
    return <ErrorView message={error.message} />;
  }

  if (!productsConnect) {
    return <LoadingView />;
  }

  if (productsConnect.edges.length === 0) {
    return (
      <Container>
        <div className="px-12 pb-12">
          <div className="py-20">
            {categoryName && (
              <p className="text-lg font-bold">{categoryName}</p>
            )}
            <p className="my-12 text-center text-gray-500">
              検索条件と一致する商品は見つかりませんでした。
            </p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="px-8 mb-12">
        {categoryName && <p className="text-lg font-bold">{categoryName}</p>}
        <div className="w-full flex justify-start mb-2">
          <p className="text-sm">
            <span className="text-lg text-gray-800">{resultLength ?? 0}</span>
            点の商品がヒット
          </p>
        </div>
        <div className="flex justify-end mb-5">
          <div className="bg-blue-100 px-3 py-0.5 rounded-md">
            <button
              className="text-blue-600 text-sm"
              onClick={() => {
                setCursor("");
                setActionType("NEXT");
                setReverse(!reverse);
              }}
            >
              {reverse ? "値段が安い順" : "値段が高い順"}
            </button>
          </div>
        </div>

        <div id="container" className="grid grid-cols-2 gap-3">
          {productsConnect.edges.map(({ node: product }, index) => {
            return (
              <ProductCard
                key={product.id}
                product={normalizeProduct(product)}
                productReviewInfo={productInfos && productInfos[index]}
              />
            );
          })}
        </div>

        <div className="w-full pt-5">
          {
            <div className="mt-8 flex items-center justify-around">
              {productsConnect.pageInfo.hasPreviousPage ? (
                <Scroll
                  to="container"
                  smooth={true}
                  duration={500}
                  offset={-200}
                >
                  <button
                    className="bg-indigo-600 text-indigo-100 px-5 py-0.5 rounded-sm"
                    onClick={() => {
                      setActionType("PREV");
                      setCursor(productsConnect.pageInfo.startCursor!);
                    }}
                  >
                    前へ
                  </button>
                </Scroll>
              ) : null}
              {productsConnect.pageInfo.hasNextPage ? (
                <Scroll
                  to="container"
                  smooth={true}
                  duration={500}
                  offset={-200}
                >
                  <button
                    className="bg-green-600 text-green-100 px-5 py-0.5 rounded-sm"
                    onClick={() => {
                      setActionType("NEXT");
                      setCursor(productsConnect.pageInfo.endCursor!);
                    }}
                  >
                    次へ
                  </button>
                </Scroll>
              ) : null}
            </div>
          }
        </div>
      </div>
    </Container>
  );
};

export default ProductQuery;
