import React from 'react';

const FoodParticles = () => {
    // Food emojis for floating animation
    const foodItems = ['🍕', '🍔', '🍟', '🌮', '🍜', '🍱', '🥗', '🍰', '🍵', '☕'];

    return (
        <div className="food-particles">
            {foodItems.map((food, index) => (
                <div key={index} className="food-particle">
                    {food}
                </div>
            ))}
        </div>
    );
};

export default FoodParticles;
