import React, { useEffect, useState } from 'react';

const Explore = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/recipe');
        const data = await res.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {recipes.map((recipe, index) => (
        <div key={index} style={styles.card}>
          <img src={recipe.imageUrl} alt="Recipe" style={styles.image} />
          <div style={styles.description}>
            <p>{recipe.recipeDescription}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  description: {
    padding: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  loading: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
  }
};

export default Explore;
