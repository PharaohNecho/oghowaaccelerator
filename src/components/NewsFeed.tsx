import React, { useState } from 'react';
import {
  Newspaper,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  X,
  Bookmark,
  Sparkles,
  Send,
  CheckCircle2
} from 'lucide-react';
import { NewsArticle } from '../types';
import { NEWS_ARTICLES } from '../data/mockData';

interface NewsFeedProps {
  onBackToHome: () => void;
  onOpenApply: () => void;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({ onBackToHome, onOpenApply }) => {
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);
  const [showPitchStory, setShowPitchStory] = useState<boolean>(false);
  const [storyPitched, setStoryPitched] = useState<boolean>(false);

  const categories = [
    'All',
    'Press Release',
    'Venture Spotlight',
    'Program Updates',
    'Research & Insights'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Newspaper className="w-3.5 h-3.5 text-rose-600" />
            <span>Ecosystem Intelligence & Dispatch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B1E48] tracking-tight">
            Óghowa News & Insights
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Field reports, portfolio funding milestones, venture policy analysis, and founder spotlights from the pulse of African enterprise.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowPitchStory(true)}
              className="px-4 py-2 text-xs font-semibold text-[#0B1E48] bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition"
            >
              Pitch Your Venture Story / Press Release
            </button>
            <button
              onClick={onOpenApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg shadow-2xs transition"
            >
              Apply to Óghowa Cohort
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-10 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, funding rounds, policy reports, or startup spotlights..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#0B1E48]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B1E48] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Big Article (if showing All or matching) */}
        {selectedCategory === 'All' && !searchQuery && (
          <div
            onClick={() => setReadingArticle(featuredArticle)}
            className="mb-12 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={380}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
                  {featuredArticle.category}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredArticle.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E48] group-hover:text-rose-600 transition-colors leading-tight mb-4">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredArticle.author.avatar}
                      alt={featuredArticle.author.name}
                      loading="lazy"
                      decoding="async"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{featuredArticle.author.name}</p>
                      <p className="text-[10px] text-slate-500">{featuredArticle.author.role}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setReadingArticle(article)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={192}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B1E48]/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded backdrop-blur-xs">
                    {article.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B1E48] group-hover:text-rose-600 transition-colors line-clamp-2 mb-2.5 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {article.summary}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400">By {article.author.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL ARTICLE MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-slate-100">
            {/* Cover image & close */}
            <div className="relative h-64 sm:h-80 bg-slate-900">
              <img
                src={readingArticle.coverImage}
                alt={readingArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <button
                onClick={() => setReadingArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mb-2 inline-block">
                  {readingArticle.category}
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
                  {readingArticle.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-10 space-y-6">
              {/* Author & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={readingArticle.author.avatar}
                    alt={readingArticle.author.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{readingArticle.author.name}</p>
                    <p className="text-xs text-slate-500">{readingArticle.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{readingArticle.date}</span>
                  <span>·</span>
                  <span>{readingArticle.readTime}</span>
                  <button
                    onClick={() => alert("Article link copied to clipboard!")}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Story paragraphs */}
              <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                {readingArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {readingArticle.tags.map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Bottom CTA in article */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#0B1E48]">Are you building a scalable venture?</h4>
                  <p className="text-xs text-slate-600">Join the next cohort of high-impact founders at Óghowa.</p>
                </div>
                <button
                  onClick={() => {
                    setReadingArticle(null);
                    onOpenApply();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PITCH YOUR STORY MODAL */}
      {showPitchStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <button
              onClick={() => { setShowPitchStory(false); setStoryPitched(false); }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {storyPitched ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1E48]">Story Pitched Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Our ecosystem editorial desk reviews all founder milestones and press leads within 48 hours.
                </p>
                <button
                  onClick={() => { setShowPitchStory(false); setStoryPitched(false); }}
                  className="mt-5 px-5 py-2 text-xs font-semibold text-white bg-[#0B1E48] rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-5 h-5 text-rose-600" />
                  <h3 className="text-xl font-bold text-[#0B1E48]">Pitch a Story or Milestone</h3>
                </div>
                <p className="text-xs text-slate-600 mb-5">
                  Announcing a funding round, major product launch, or partnership? Get featured in the Óghowa ecosystem dispatch.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStoryPitched(true);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Headline / News Angle</label>
                    <input required placeholder="e.g. EduRide launches fleet tracking in 5 universities" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Startup / Organization</label>
                    <input required placeholder="Your Startup Name" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Key Data & Metrics</label>
                    <textarea rows={3} required placeholder="Share the traction, funding amount, or partnership scope..." className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Founder Contact Email</label>
                    <input type="email" required placeholder="founder@venture.com" className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowPitchStory(false)}
                      className="px-4 py-2 font-medium text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
                    >
                      Send to Editorial Desk
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
