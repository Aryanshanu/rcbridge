export const CallToAction = () => {
  return (
    <section className="bg-primary rounded-lg p-6 sm:p-12 text-center text-white">
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8">
        Join RCBridge today and become part of Hyderabad's most innovative property marketplace.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
          Create Your Account
        </button>
        <button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium">
          Schedule a Demo
        </button>
      </div>
    </section>
  );
};