
import { RealEstateDataVisualizations } from '@/components/RealEstateDataVisualizations';

export const PropertyVisualizations = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">Market Intelligence</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Make data-driven decisions with our comprehensive real estate insights and visualizations
          </p>
        </div>
        
        <RealEstateDataVisualizations />
      </div>
    </section>
  );
};
