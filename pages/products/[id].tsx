import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Chat, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import client from "@libs/server/client";
interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

interface ChatResponse {
  ok: boolean;
  chat: Chat;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const { user, isLoading } = useUser();
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { handleSubmit } = useForm();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const [createChat, { data: chatData, loading: chatLoading }] =
    useMutation<ChatResponse>(`/api/products/${router.query.id}/chat`);
  const onFavClick = () => {
    toggleFav({});
    if (!data) return;
    boundMutate({ ...data, isLiked: !data.isLiked }, false);
  };
  const onValid = () => {
    if (chatLoading) return;
    createChat({});
  };
  useEffect(() => {
    if (chatData && chatData.ok) {
      router.push(`/chats/${chatData.chat.id}`);
    }
  }, [chatData]);

  if (router.isFallback) {
    return (
      <Layout title="Loading Page">
        <span>Loading...</span>
      </Layout>
    );
  }
  return (
    <Layout canGoBack seoTitle="Product Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          {/* TODO */}
          <img src={``} className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {/* TODO */}
            <img
              src={``}
              className="w-12 h-12 rounded-full bg-slate-300"
            />{" "}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <Link href={`/users/profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <span className="text-2xl block mt-3 text-gray-900">
              ${product.price}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <form onSubmit={handleSubmit(onValid)} className="w-full">
                <Button
                  large
                  text={chatLoading ? "Loading" : "Talk to seller"}
                />
              </form>
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  isLiked
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="red"
                    viewBox="0 0 24 24"
                    stroke="red"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product) => (
              <div key={product?.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product?.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  {product?.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx?.params?.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = Boolean(false);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
    revalidate: 20,
  };
};

export default ItemDetail;
