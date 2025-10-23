import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About InsightSphere</h1>
          <p className="text-xl text-gray-600">Your gateway to stories, news, and insights across the world</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 space-y-12">
          {/* Platform Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              InsightSphere is dedicated to bringing you thoughtful analysis and engaging stories 
              across politics, culture, travel, and entertainment. We believe in the power of 
              well-researched content to inform, inspire, and connect people with the world around them.
            </p>
          </section>
          
          {/* What We Cover */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Cover</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">📊 Politics & Government</h3>
                <p className="text-gray-600 text-sm">In-depth analysis of current affairs and policy developments</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎨 Culture & Arts</h3>
                <p className="text-gray-600 text-sm">Exploring creative expressions and cultural trends</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">✈️ Travel & Adventure</h3>
                <p className="text-gray-600 text-sm">Discovering amazing destinations and experiences</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">🎬 Entertainment</h3>
                <p className="text-gray-600 text-sm">Latest in movies, music, and celebrity news</p>
              </div>
            </div>
          </section>

          {/* Developer Information */}
          <section className="bg-gradient-to-r from-primary to-red-800 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">About the Developer</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Aniket Paswan</h3>
                <p className="text-gray-100 mb-4 font-medium">Data Science and Machine Learning Engineer</p>
                <p className="text-gray-100 leading-relaxed mb-4">
                  I built InsightSphere as a full-stack project to showcase modern web development 
                  capabilities. While my primary expertise lies in Data Science and Machine Learning, 
                  I enjoy building complete solutions from data pipelines to user interfaces.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-100">abc@gmail.com</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">Data Science</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">Machine Learning</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">Python</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">SQL Server</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">Data Analytics</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">Next.js</span>
                  <span className="bg-red-700 px-3 py-1 rounded-full text-sm">React</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-red-300 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">🤖</span>
                </div>
                <p className="text-gray-100 text-sm text-center">Data Science & ML Engineer</p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions about the platform or interested in data science collaborations? 
              I'd love to connect and discuss potential opportunities.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Me
            </a>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}