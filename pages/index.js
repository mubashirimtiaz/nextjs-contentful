import { RecipeCard } from "../components/recipe/recipe_card";
import client from "../utils/contentful";

export const getStaticProps = async () => {
  try {
    const recipes = await client.getEntries({ content_type: "marmiteNinja" });
    if (!recipes.items.length) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        recipes: recipes.items,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
      revalidate: 1,
    };
  }
};
export default function Recipes({ recipes, error }) {
  if (error) {
    return <h4>{error}</h4>;
  }
  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.sys.id} {...recipe.fields} />
      ))}
      <style jsx>
        {`
          .recipe-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
          }
        `}
      </style>
    </div>
  );
}
