interface CategoryCardProps {
  imageSrc: string;
  title: string;
}

export default function CategoryCard({ imageSrc, title }: CategoryCardProps) {
  return (
    <div className="group relative flex items-center justify-center w-80 h-80 bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 ease-in-out">
      <img
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out opacity-70 group-hover:opacity-90"
        src={imageSrc}
        alt=""
      />
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-500 ease-in-out"></div>
      <div className="relative z-10 text-center">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </div>
  );
}
