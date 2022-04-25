import { readdirSync } from "fs";
import { GetStaticProps, NextPage } from "next";
import matter from "gray-matter";
import { unified } from "unified";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import Layout from "@components/layout";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout title={data?.title} seoTitle={data?.title}>
      <div dangerouslySetInnerHTML={{ __html: post }}></div>;
    </Layout>
  );
};

export function getStaticPaths() {
  const files = readdirSync("./posts").map((file) => {
    const [name, extenstion] = file.split(".");
    return { params: { slug: name } };
  });

  return {
    paths: files,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);
  return {
    props: {
      post: value,
      data,
    },
  };
};

export default Post;
