import CategoryCard from "../card";

export default function CategorySlider() {
  const categories = [
    {
      id: 1,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg",
      title: "Category 1",
    },
    {
      id: 2,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg",
      title: "Category 2",
    },
    {
      id: 3,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-category-01.jpg",
      title: "Category 3",
    },
    {
      id: 4,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg",
      title: "Category 4",
    },
    {
      id: 5,
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg",
      title: "Category 5",
    },
  ];

  return (
    <div className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8 text-black">
          Explore Categories
        </h2>
        <div className="flex overflow-x-auto -mx-4">
          {categories.map((category) => (
            <div key={category.id} className="px-4">
              <CategoryCard
                imageSrc={category.imageSrc}
                title={category.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
