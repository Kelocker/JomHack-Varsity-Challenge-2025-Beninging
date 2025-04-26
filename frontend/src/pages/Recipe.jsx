import React from 'react';

const Recipe = ({ setPage, recipe, goBack }) => {
  // Hardcoded fallback recipe (for Home page)
  const defaultRecipe = {
    name: "Spaghetti Carbonara",
    imageUrl: "https://www.supermomix.com/wp-content/uploads/2018/03/diary-free-carbonara-1024x1024.jpg",
    description: "A creamy and delicious pasta perfect for a quick meal.",
    ingredients: [
        { name: "Spaghetti", quantity: "200", unit: "g" },
        { name: "Pancetta or Bacon", quantity: "100", unit: "g" },
        { name: "Eggs", quantity: "2", unit: "large" },
        { name: "Parmesan Cheese", quantity: "50", unit: "g" },
        { name: "Garlic", quantity: "2", unit: "cloves" },
        { name: "Salt", quantity: "to", unit: "taste" },
        { name: "Black Pepper", quantity: "to", unit: "taste" },
        { name: "Olive Oil", quantity: "1", unit: "tablespoon" },
      ],      
    instructions: [
      "Cook spaghetti in salted boiling water until al dente. Reserve 1/2 cup pasta water.",
      "In a pan, fry pancetta with garlic until crispy.",
      "In a bowl, whisk eggs and Parmesan together.",
      "Drain spaghetti and immediately toss with pancetta and garlic.",
      "Remove from heat. Quickly mix in the egg and cheese mixture, adding pasta water as needed to create a creamy sauce.",
      "Season with salt and pepper to taste. Serve immediately."
    ]
  };

  const displayRecipe = recipe || defaultRecipe;

  return (
    <div style={{ padding: '1rem' }}>
      {/* Back Button */}
      <button 
        onClick={() => (goBack ? goBack() : setPage('home'))}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#ff6f61',
          marginBottom: '1rem'
        }}
      >
        ← Back
      </button>

      {/* Recipe Image */}
      <img 
        src={displayRecipe.imageUrl} 
        alt={displayRecipe.name} 
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
        {displayRecipe.name}
      </h1>

      {/* Recipe Description */}
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {displayRecipe.description}
      </p>

      {/* Ingredients */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        🛒 Ingredients
      </h2>
      <ul style={{ paddingLeft: '1.2rem', marginBottom: '2rem' }}>
        {displayRecipe.ingredients?.map((item, index) => (
            <li key={index} style={{ marginBottom: '0.5rem', color: '#444' }}>
            {item.name} - {item.quantity} {item.unit}
            </li>
        ))}
    </ul>



      {/* Steps */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        👩‍🍳 Instructions
      </h2>
      <ol style={{ paddingLeft: '1.2rem' }}>
        {displayRecipe.instructions?.map((step, index) => (
          <li key={index} style={{ marginBottom: '1rem', color: '#444' }}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Recipe;
