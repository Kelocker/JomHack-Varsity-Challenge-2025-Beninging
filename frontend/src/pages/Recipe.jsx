import React from 'react';

const Recipe = ({ setPage }) => {
  // Hardcoded recipe data
  const recipe = {
    name: "Spaghetti Carbonara",
    imageUrl: "https://www.supermomix.com/wp-content/uploads/2018/03/diary-free-carbonara-1024x1024.jpg",
    description: "A creamy and delicious pasta perfect for a quick meal.",
    ingredients: [
      "200g spaghetti",
      "100g pancetta or bacon",
      "2 large eggs",
      "50g grated Parmesan cheese",
      "2 cloves garlic, minced",
      "Salt & black pepper",
      "Olive oil"
    ],
    steps: [
      "Cook spaghetti in salted boiling water until al dente. Reserve 1/2 cup pasta water.",
      "In a pan, fry pancetta with garlic until crispy.",
      "In a bowl, whisk eggs and Parmesan together.",
      "Drain spaghetti and immediately toss with pancetta and garlic.",
      "Remove from heat. Quickly mix in the egg and cheese mixture, adding pasta water as needed to create a creamy sauce.",
      "Season with salt and pepper to taste. Serve immediately."
    ]
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Back Button */}
      <button onClick={() => setPage('home')} style={{
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#ff6f61',
        marginBottom: '1rem'
      }}>
        ← Back
      </button>

      {/* Recipe Image */}
      <img 
        src={recipe.imageUrl} 
        alt={recipe.name} 
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '15px',
          marginBottom: '1rem'
        }}
      />

      {/* Recipe Title */}
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {recipe.name}
      </h1>

      {/* Recipe Description */}
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {recipe.description}
      </p>

      {/* Ingredients */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        🛒 Ingredients
      </h2>
      <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem' }}>
        {recipe.ingredients.map((item, index) => (
          <li key={index} style={{ marginBottom: '0.5rem', color: '#444' }}>
            {item}
          </li>
        ))}
      </ul>

      {/* Steps */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        👩‍🍳 Instructions
      </h2>
      <ol style={{ paddingLeft: '1.2rem' }}>
        {recipe.steps.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem', color: '#444' }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Recipe;
