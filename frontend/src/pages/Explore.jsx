import React, { useEffect, useState } from 'react';
import Recipe from './Recipe'; // Make sure you import it

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem('recipes');

    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRecipes(parsed);
        setLoading(false);
      } else {
        fetchRecipes();
      }
    } else {
      fetchRecipes();
    }
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/recipe');
      const data = await res.json();
      setRecipes(data.recipes || []);
      localStorage.setItem('recipes', JSON.stringify(data.recipes || []));
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (selectedRecipe) {
    return <Recipe recipe={selectedRecipe} goBack={() => setSelectedRecipe(null)} />;
  }

  return (
    <div style={styles.container}>
      {recipes.map((recipe, index) => (
        <div key={index} style={styles.card} onClick={() => setSelectedRecipe(recipe)}>
          <img src={recipe.imageUrl} alt="Recipe" style={styles.image} />
          <div style={styles.description}>
            <div style={styles.title}>{recipe.recipeName || "Delicious Recipes"}</div>
            <div style={styles.subtitle}>{recipe.recipeDescription}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1rem',
    margin: 'auto',
    paddingBottom: '2rem',
    boxSizing: 'border-box',
  },  
  card: {
    maxWidth: '400px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  description: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
  },
  loading: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  },
};

export default Explore;
