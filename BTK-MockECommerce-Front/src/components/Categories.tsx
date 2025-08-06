import { Headphones, Watch, Smartphone, Camera, Laptop, Speaker } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'Audio',
      icon: Headphones,
      count: 45,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 2,
      name: 'Watches',
      icon: Watch,
      count: 32,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 3,
      name: 'Phones',
      icon: Smartphone,
      count: 28,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 4,
      name: 'Cameras',
      icon: Camera,
      count: 19,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 5,
      name: 'Laptops',
      icon: Laptop,
      count: 24,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 6,
      name: 'Speakers',
      icon: Speaker,
      count: 15,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Shop by
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
              Category
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of premium products across different categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-large">
                  {/* Dynamic gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className="relative z-10 mb-4 flex justify-center">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${category.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="relative z-10">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.count} products
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <button className="hero-button px-8 py-3 rounded-lg font-semibold transition-all duration-300">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;