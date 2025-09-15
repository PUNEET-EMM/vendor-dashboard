import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../Layout/Layout';

const Support = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsSubmitting(true);
    try {
      // Your submit logic here
      console.log('Submitting query:', query);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuery('');
      // You could show a success message here
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const faqsData = [
  //   // --- General Questions ---
  //   {
  //     section: "General Questions",
  //     items: [
  //       {
  //         q: "What is SuperrApp?",
  //         a: "SuperrApp is a B2B platform for Products & Services, that simplifies and streamlines all corporate needs, from sourcing and ordering to approvals and invoicing, all in one place."
  //       },
  //       {
  //         q: "Who is SuperrApp for?",
  //         a: "SuperrApp is for corporate admins and anyone responsible for managing office needs, whether for lean start-ups or large enterprises."
  //       },
  //       {
  //         q: "How does SuperrApp work?",
  //         a: "SuperrApp consolidates all your office needs onto a single platform. You can find Products and Services, place orders, get approvals, and handle payments and invoices without juggling multiple channels like WhatsApp, email, or phone calls."
  //       },
  //       {
  //         q: "How do I get started with SuperrApp?",
  //         a: "You can sign up on the platform by entering your company details. That's it! The process is quick, with no long forms or paperwork."
  //       },
  //       {
  //         q: "Is SuperrApp a mobile app or a website?",
  //         a: "SuperrApp is available as a mobile app and is also accessible on the web."
  //       },
  //       {
  //         q: "What is the cost of using SuperrApp?",
  //         a: "SuperrApp is a free-to-use platform for corporate admins. There are no subscription fees."
  //       },
  //       {
  //         q: "Where does SuperrApp currently operate?",
  //         a: "SuperrApp is currently operational only in the Delhi-NCR region. We will be expanding to other cities soon."
  //       }
  //     ]
  //   },

  //   // --- Functionality & Features ---
  //   {
  //     section: "Functionality & Features",
  //     items: [
  //       {
  //         q: "What kind of products and services can I get through SuperrApp?",
  //         a: "You can get a wide range of products and services, including office supplies, housekeeping tools, pantry stock, electronics, event management, and various other facility and IT services. And more are on their way!"
  //       },
  //       {
  //         q: "How do I place an order?",
  //         a: "You can browse and select the products and services you need directly on the platform."
  //       },
  //       {
  //         q: "Can I track my orders?",
  //         a: "Yes, you can track the entire process from a quote request to delivery online."
  //       },
  //       {
  //         q: "What about approvals?",
  //         a: "The platform includes a built-in approvals system that allows you to manage and track pending and completed approvals for orders."
  //       },
  //       {
  //         q: "How does invoicing work?",
  //         a: "SuperrApp provides a centralized dashboard where you can access and manage all your invoices in one place, eliminating the need to chase multiple vendors."
  //       },
  //       {
  //         q: "What is SuperWallet?",
  //         a: "SuperWallet is a feature within the app that helps you manage credits. You can consume your credits during the checkout process."
  //       },
  //       {
  //         q: "Can I integrate SuperrApp with our existing systems?",
  //         a: "Yes, the platform can be integrated with your ERP for automated workflows. The feature will be rolled out soon."
  //       }
  //     ]
  //   },

  //   // --- Security & Support ---
  //   {
  //     section: "Security & Support",
  //     items: [
  //       {
  //         q: "How is my company's data protected on SuperrApp?",
  //         a: "SuperrApp uses enterprise-grade security to protect your data. All data is encrypted both in transit and at rest to ensure it is secure."
  //       },
  //       {
  //         q: "Does SuperrApp share my data with third parties?",
  //         a: "No, SuperrApp does not share your company's data with any third parties without your explicit consent. Your data is used only to provide and improve the services on the platform."
  //       },
  //       {
  //         q: "What if I have an issue with an order?",
  //         a: "The platform has a dedicated support section to help you with any issues or escalations."
  //       },
  //       {
  //         q: "How do I contact support?",
  //         a: "You can use the query box above or email us at support@superapp.com."
  //       }
  //     ]
  //   }
  // ];

  return (
    <Layout>
      <div className="w-full min-h-screen">
        <div className=" mx-auto ">

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold  mb-6 sm:mb-8">
            Support
          </h1>
          {/* Query Section */}
          <section className="bg-blue-50/40 border border-blue-100 rounded-xl shadow-md p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Feel free to write us your query
            </h2>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your query here..."
              className="w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none text-gray-800 text-sm sm:text-base lg:text-lg"
            />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !query.trim()}
              className="mt-4 w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white text-sm sm:text-base lg:text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Query'}
            </button>
          </section>

          {/* <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {faqsData.map((group, gIdx) => (
                <div key={gIdx}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-700 mb-3 sm:mb-4 border-b border-gray-200 pb-2">
                    {group.section}
                  </h3>

                  <div className="space-y-2 sm:space-y-3">
                    {group.items.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group border border-gray-200 rounded-lg p-3 sm:p-4 cursor-pointer shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200"
                      >
                        <summary className="font-semibold text-blue-600 text-sm sm:text-base lg:text-lg cursor-pointer outline-none list-none flex items-center justify-between">
                          <span className="pr-4">{faq.q}</span>
                          <span className="text-blue-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0">
                            ▼
                          </span>
                        </summary>
                        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* Footer spacing */}
          <div className="h-6 sm:h-8"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;