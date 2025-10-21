
import { Check, Clock, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { ValueComparisonTool } from "@/components/3D/ValueComparisonTool";
import { DataVisualizationCard } from "@/components/DataVisualizationCard";

export const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 relative inline-block">
            <span className="absolute -left-6 -top-6 text-5xl text-primary/10">❝</span>
            RC Bridge: A Decade of Excellence in Real Estate 🏡
            <span className="absolute -right-6 -bottom-6 text-5xl text-primary/10">❞</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            With 10+ years of expertise in the real estate market, RC Bridge has built a trusted and 
            well-established presence in the industry. Our deep market knowledge, vast network, and 
            commitment to quality over quantity make us the go-to platform for exclusive and high-value 
            real estate transactions.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div 
            className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
                <Clock className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Expertise</h3>
              <p className="text-gray-600">
                A decade of hands-on experience in real estate trends, valuation, and deal structuring.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
                <Check className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Track Record</h3>
              <p className="text-gray-600">
                Successfully facilitated ₹200+ Crores in transactions while preserving property value.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Trust & Recognition</h3>
              <p className="text-gray-600">
                Well-connected with developers, investors, and real estate professionals.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            variants={itemVariants}
          >
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center shadow-inner">
                <Users className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer-Centric Approach</h3>
              <p className="text-gray-600">
                Personalized property matching, transparent transactions, and zero middlemen fees.
              </p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* 3D Value Comparison Tool */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <ValueComparisonTool />
        </motion.div>
        
        {/* Data Visualization Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <DataVisualizationCard 
              title="Value Retention" 
              description="RC Bridge helps preserve property value by avoiding public listings and mass exposure."
              type="value-retention"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <DataVisualizationCard 
              title="Market Growth" 
              description="Our properties consistently outperform the market average in terms of value growth."
              type="growth"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <DataVisualizationCard 
              title="Investment ROI" 
              description="RC Bridge properties deliver 12%+ annual ROI through our exclusive network."
              type="roi"
            />
          </motion.div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border border-gray-100">
            <p className="text-lg text-gray-800 font-medium italic">
              RC Bridge isn't just a platform—it's a revolution in real estate, ensuring buyers, sellers, and investors get the best deals with maximum value retention. 🚀
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
