import React, { useState, useEffect } from 'react';

const Planner = ({ lang, setPage }) => {
  // State to track active tab and filter values
  const [activeTab, setActiveTab] = useState('meals');
  const [peopleCount, setPeopleCount] = useState(1);
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  
  // State for data from backend
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Derived data from planData
  const daysUntilNextGrocery = planData?.overallDaysLeft || 5;
  const mealPlan = planData?.mealPlan || [
    {"date":"2025-04-26","meals":[{"ingredientsUsed":["Beef","Garlic","Soy sauce"],"mealName":"Stir-Fried Beef with Garlic Sauce"},{"ingredientsUsed":["Bananas","Sugar"],"mealName":"Banana Smoothie"}]},
    {"date":"2025-04-27","meals":[{"ingredientsUsed":["Pasta","Olive Oil","Garlic"],"mealName":"Pasta Aglio e Olio"},{"ingredientsUsed":["Apple"],"mealName":"Apple Salad"}]},
    {"date":"2025-04-28","meals":[{"ingredientsUsed":["Beef","Garlic"],"mealName":"Beef Stir-Fry with Vegetables"},{"ingredientsUsed":["Bananas","Sugar"],"mealName":"Banana Pancakes"}]},
    {"date":"2025-04-29","meals":[{"ingredientsUsed":["Pasta","Tomato Sauce"],"mealName":"Pasta Primavera"},{"ingredientsUsed":["Apple","Sugar"],"mealName":"Apple Crisp"}]}
  ];
  const problems = planData?.problems || [
    {"foodName":"Soy sauce","issue":"Expiring soon","suggestion":"Use more soy sauce in meals to avoid wastage"}
  ];
  
  // Function to fetch meal plan data from backend
  const fetchMealPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          peopleCount: peopleCount,
          mealsPerDay: mealsPerDay
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPlanData(data);
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError('Failed to load meal plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch initial data on component mount
  useEffect(() => {
    fetchMealPlan();
  }, []);

  // Determine color based on days remaining
  const getColorForDays = (days) => {
    if (days <= 3) return '#FF5252'; // Red for few days
    if (days <= 5) return '#FFC107'; // Yellow for medium
    return '#4CAF50'; // Green for many days
  };

  const dayColor = getColorForDays(daysUntilNextGrocery);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: '#f5f5f5',
      padding: '16px'
    }}>
      {/* Filter Controls - Expandable/Collapsible */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header with toggle button */}
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
          onClick={() => setSettingsExpanded(!settingsExpanded)}
        >
          <h3 style={{ 
            fontSize: '1.1rem', 
            color: '#333',
            margin: 0
          }}>
            Meal Planning Settings
          </h3>
          <div style={{
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2196F3',
            fontSize: '1.2rem',
            transition: 'transform 0.3s ease'
          }}>
            {settingsExpanded ? '▲' : '▼'}
          </div>
        </div>
        
        {/* Collapsible content */}
        <div style={{
          maxHeight: settingsExpanded ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease',
          opacity: settingsExpanded ? 1 : 0,
          paddingTop: settingsExpanded ? '16px' : '0',
          marginTop: settingsExpanded ? '16px' : '0'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'flex-end'
          }}>
            {/* Number of People Filter */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: '180px'
            }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '500',
                marginBottom: '8px',
                color: '#555'
              }}>
                Number of People
              </label>
              <div style={{ 
                display: 'flex',
                alignItems: 'center'
              }}>
                <button 
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e1f5fe',
                    border: '1px solid #b3e5fc',
                    borderRadius: '4px 0 0 4px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#0288d1'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPeopleCount(Math.max(1, peopleCount - 1));
                  }}
                >
                  -
                </button>
                <div style={{
                  width: '40px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  border: '1px solid #b3e5fc',
                  borderLeft: 'none',
                  borderRight: 'none',
                  fontSize: '0.95rem'
                }}>
                  {peopleCount}
                </div>
                <button 
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e1f5fe',
                    border: '1px solid #b3e5fc',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#0288d1'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPeopleCount(peopleCount + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Meals Per Day Filter */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              minWidth: '180px'
            }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '500',
                marginBottom: '8px',
                color: '#555'
              }}>
                Meals Per Day
              </label>
              <div style={{ 
                display: 'flex',
                alignItems: 'center'
              }}>
                <button 
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e1f5fe',
                    border: '1px solid #b3e5fc',
                    borderRadius: '4px 0 0 4px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#0288d1'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMealsPerDay(Math.max(1, mealsPerDay - 1));
                  }}
                >
                  -
                </button>
                <div style={{
                  width: '40px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  border: '1px solid #b3e5fc',
                  borderLeft: 'none',
                  borderRight: 'none',
                  fontSize: '0.95rem'
                }}>
                  {mealsPerDay}
                </div>
                <button 
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e1f5fe',
                    border: '1px solid #b3e5fc',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#0288d1'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMealsPerDay(Math.min(5, mealsPerDay + 1));
                  }}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Apply Button */}
            <div style={{ 
              marginLeft: 'auto'
            }}>
              <button 
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  height: '32px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.7 : 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  fetchMealPlan();
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Apply Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Top Part - Days Until Next Grocery */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '10px',
            width: '100%',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <h2 style={{ 
          fontSize: '1rem', 
          fontWeight: 'normal',
          color: '#666',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Estimated Days Until Next Grocery Trip
        </h2>
        
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 0'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0e0e0',
              borderTopColor: '#2196F3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ color: '#666' }}>Loading meal plan...</p>
          </div>
        ) : (
          <>
            <div style={{
              position: 'relative',
              width: '120px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '10px 0'
            }}>
              {/* Circle background */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `8px solid ${dayColor}`,
                opacity: 0.2
              }}></div>
              
              {/* Progress circle - adjust the dasharray and dashoffset for different progress levels */}
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute' }}>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  fill="none" 
                  stroke={dayColor} 
                  strokeWidth="8"
                  strokeDasharray="339.29"
                  strokeDashoffset={(339.29 * (1 - daysUntilNextGrocery/7))}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              
              {/* Number display */}
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: dayColor
              }}>
                {daysUntilNextGrocery}
              </div>
            </div>
            
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#666',
              textAlign: 'center',
              marginTop: '5px'
            }}>
              {daysUntilNextGrocery <= 3 
                ? 'Time to plan your grocery trip!' 
                : 'Your supplies are looking good'}
            </p>
            
            {planData?.expectedFinishDate && (
              <p style={{ 
                fontSize: '0.85rem', 
                color: '#666',
                textAlign: 'center',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                Expected finish date: {new Date(planData.expectedFinishDate).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Bottom Part - Tabbed Interface */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: '500px' // Make it vertically longer
      }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '16px'
        }}>
          <button 
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'meals' ? '3px solid #2196F3' : 'none',
              color: activeTab === 'meals' ? '#2196F3' : '#666',
              fontWeight: activeTab === 'meals' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1rem',
              marginRight: '10px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveTab('meals')}
          >
            Meals
          </button>
          <button 
            style={{
              padding: '10px 20px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'problems' ? '3px solid #2196F3' : 'none',
              color: activeTab === 'problems' ? '#2196F3' : '#666',
              fontWeight: activeTab === 'problems' ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveTab('problems')}
          >
            Problems
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Meals Tab Content */}
          {activeTab === 'meals' && (
            <div>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#333',
                marginBottom: '16px'
              }}>
                Meal Suggestions
              </h3>
              
              {loading ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 0'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e0e0e0',
                    borderTopColor: '#2196F3',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                  }}></div>
                  <p style={{ color: '#666' }}>Loading meal suggestions...</p>
                </div>
              ) : error ? (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              ) : mealPlan.length === 0 ? (
                <div style={{
                  backgroundColor: '#e3f2fd',
                  color: '#0d47a1',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  No meal suggestions available. Try adjusting your settings.
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  {mealPlan.map((day, index) => (
                    <div key={index} style={{
                      marginBottom: '20px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      overflow: 'hidden'
                    }}>
                      {/* Enhanced date header with stronger visual presence */}
                      <div style={{ 
                        backgroundColor: '#e8f4fd', 
                        padding: '12px 16px',
                        borderBottom: '1px solid #d0e8f9'
                      }}>
                        <h4 style={{ 
                          fontSize: '1.1rem', 
                          fontWeight: 'bold',
                          color: '#1976D2',
                          margin: 0
                        }}>
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </h4>
                      </div>
                      <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9' }}>
                        {day.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} style={{
                            padding: '16px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            marginBottom: mealIndex < day.meals.length - 1 ? '12px' : '0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <div style={{ 
                              fontWeight: 'bold', 
                              marginBottom: '8px',
                              fontSize: '1.05rem',
                              color: '#333'
                            }}>
                              {meal.mealName}
                            </div>
                            <div style={{ 
                              fontSize: '0.9rem', 
                              color: '#666', 
                              marginBottom: '12px',
                              lineHeight: '1.4'
                            }}>
                              <span style={{ fontWeight: '500' }}>Ingredients:</span> {meal.ingredientsUsed.join(', ')}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                              <button 
                                style={{
                                  backgroundColor: '#2196F3',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '8px 14px',
                                  fontSize: '0.85rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  transition: 'background-color 0.2s ease'
                                }}
                                onClick={() => alert(`Details for ${meal.mealName}`)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Problems Tab Content */}
          {activeTab === 'problems' && (
            <div>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#333',
                marginBottom: '16px'
              }}>
                Potential Issues
              </h3>
              
              {loading ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 0'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e0e0e0',
                    borderTopColor: '#FFC107',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                  }}></div>
                  <p style={{ color: '#666' }}>Loading issues...</p>
                </div>
              ) : error ? (
                <div style={{
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              ) : problems.length === 0 ? (
                <div style={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  No issues found with your food items!
                </div>
              ) : (
                <div>
                  {problems.map((item, index) => (
                    <div key={index} style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ 
                        backgroundColor: '#fff8e1', 
                        padding: '12px 16px',
                        borderBottom: '1px solid #ffe082',
                        borderLeft: '4px solid #FFC107'
                      }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '1.05rem',
                          color: '#795548'
                        }}>
                          {item.foodName} - {item.issue}
                        </div>
                      </div>
                      <div style={{ 
                        padding: '16px',
                        backgroundColor: '#fffdf5'
                      }}>
                        <div style={{ 
                          fontSize: '0.95rem', 
                          marginBottom: '16px', 
                          color: '#555',
                          lineHeight: '1.4'
                        }}>
                          {item.suggestion}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button 
                            style={{
                              backgroundColor: '#FFC107',
                              color: '#333',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '8px 14px',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'background-color 0.2s ease'
                            }}
                            onClick={() => alert(`Action for ${item.foodName}`)}
                          >
                            View more
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Back button */}
      <button 
        style={{
          marginTop: '20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        onClick={() => setPage('home')}
      >
        Back to Home
      </button>
    </div>
  );
};

export default Planner;