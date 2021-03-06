import Image from "next/image";
import { useRouter } from "next/router";
import client from "@utils/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Skeleton } from "@components/skeleton";

export const getStaticPaths = async () => {
  const recipes = await client.getEntries({ content_type: "marmiteNinja" });
  const paths = recipes.items.map((recipe) => ({
    params: { slug: recipe.fields.slug },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context) => {
  const slug = context.params.slug;
  try {
    const recipe = await client.getEntries({
      content_type: "marmiteNinja",
      "fields.slug": slug,
    });
    if (!recipe.items.length) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        recipe: recipe.items[0],
      },
      revalidate: 1,
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

export default function RecipeDetails({ recipe, error }) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Skeleton />;
  }

  const {
    ingredients,
    cookingTime,
    title,
    featuredImage,
    method,
  } = recipe.fields;

  if (error) {
    return <h4>{error}</h4>;
  }

  return (
    <div>
      <div className="banner">
        <Image
          src={`https:${featuredImage.fields.file.url}`}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{title}</h2>
      </div>
      <div className="info">
        <p>Take about {cookingTime} mins to make.</p>
        <h3>Ingredients:</h3>
        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>
      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  );
}
