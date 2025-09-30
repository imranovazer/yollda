import Link from "next/link";
import { i18n, useTranslation } from "next-i18next";
import React, { useState } from "react";
import { trimText } from "../../hooks/trimText";
import ArrowDown from "../ui/icons/ArrowDown";
import Pagination from "../ui/Pagination";
import { useRouter } from "next/router";
import { formatDate } from "../../hooks/formatDate";

function Articles({ articlesData, blogsCategories }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale } = router;
  const [blogsList, setBlogsList] = useState(articlesData?.results || []);
  const [blogsCategoriesList] = useState(blogsCategories?.results || []);

  const [currentPage, setCurrentPage] = useState(
    articlesData?.current_page || 1
  ); // Default from SSR
  const [totalFound, setTotalFound] = useState(articlesData?.total); // Default from SSR
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(articlesData?.last_page || 1); // Total number of items

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]); // Assuming you will fetch subcategories later
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);

  const fetchSubCategories = async (id) => {
    setIsSubCategoryOpen(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/blog-categories/${id}`
      );
      const data = await response.json();

      setSubCategories(data?.subcategories);
    } catch (error) {}
  };

  // Function to fetch data for a specific page
  const fetchBlogs = async (page, perPage, category) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/web/blogs/?page=${page}&per_page=${perPage}&category=${category}`,
        {
          headers: {
            "Content-Type": "application/json",
            Country: "AZ", // Default to AZ if language is not recognized,
            "Accept-Language": i18n.language, // Use the current language from i18n
          },
        }
      );
      const data = await response.json();

      setCurrentPage(data.current_page);
      setTotalFound(data.total);
      setBlogsList(data.results); // Update newsList with new results
      setTotalItems(data?.last_page); // Update total items based on the last page
    } catch (error) {
      console.error("Error fetching s:", error);
    }
  };

  // Handle page change
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);

    await fetchBlogs(
      pageNumber,
      itemsPerPage,
      selectedSubCategory?.slug || selectedCategory?.slug || null
    );
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);

    if (category?.has_subcategory) {
      await fetchSubCategories(category.id);
    } else {
      await fetchBlogs(1, itemsPerPage, category?.slug);

      setSubCategories([]); // Clear subcategories if no subcategory exists
      setSelectedSubCategory(null); // Reset selected subcategory
    }
  };

  const handleSubCategoryChange = (category) => {
    setSelectedSubCategory(category);
    setIsSubCategoryOpen(false);
    fetchBlogs(1, itemsPerPage, category?.slug);
  };

  return (
    <div className="space-y-8 mt-10 md:mt-20">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10 lg:mt-20">
        {/* Category Filter */}
        <div className="relative  w-full md:w-1/2 ">
          <button
            onClick={() => {
              setIsCategoryOpen((prevState) => !prevState);
              setIsSubCategoryOpen(false); // Close subcategory dropdown when category is opened
            }}
            className="w-full bg-light-green/10 border border-light-green/20  px-4 py-3 text-left flex items-center justify-between text-green-dark hover:bg-light-green/20 rounded-xl transition-colors duration-200"
          >
            <span className="text-span-responsive font-medium">
              {selectedCategory?.title || t("buttons.select")}
            </span>
            <ArrowDown
              strokeColor={`stroke-gray-500`}
              className={`transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-y-auto max-h-[300px] custom-contact-scrollbar">
              {blogsCategoriesList.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-span-responsive first:rounded-t-lg last:rounded-b-lg"
                >
                  {category.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Region Filter */}
        {subCategories?.length > 0 && (
          <div className="relative  w-full md:w-1/2 animate-fade-in transition-all duration-200">
            <button
              onClick={() => {
                setIsSubCategoryOpen((prevState) => !prevState);
                setIsCategoryOpen(false);
              }}
              className="w-full bg-light-green/10 border border-light-green/20 rounded-xl px-4 py-3 text-left flex items-center justify-between text-green-dark hover:bg-light-green/20 rounded-xl transition-colors duration-200"
            >
              <span className="text-span-responsive font-medium">
                {selectedSubCategory?.title || t("buttons.select")}
              </span>
              <ArrowDown
                strokeColor={`stroke-gray-500`}
                className={`transition-transform duration-200 ${
                  isSubCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSubCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-y-auto max-h-[300px] custom-contact-scrollbar">
                {subCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => handleSubCategoryChange(subCategory)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 text-span-responsive first:rounded-t-lg last:rounded-b-lg"
                  >
                    {subCategory.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-4">
        <p className="text-span-responsive text-gray-700">
          {totalFound || "0"} {t("results_found")}
        </p>
      </div>
      {/* Singlie blog  */}
      <div className="flex flex-wrap gap-2 md:gap-1 md:space-s-4">
        {blogsList?.[0]?.tags?.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-span-responsive cursor-default font-medium rounded-full transition-all duration-200 text-green-dark bg-light-green/20`}
          >
            {tab}
          </button>
        ))}
      </div>

      {blogsList?.[0] && (
        <article className="!mb-16 rounded-2xl">
          <div className="flex items-center">
            <img src="/calendar.svg" className="me-2" alt="calendar icon" />
            <span className="text-span-small-responsive text-gray-500">
              {formatDate(blogsList[0]?.created_at, locale)}
            </span>
          </div>

          <h6 className="text-h6-responsive font-medium text-gray-900 leading-relaxed mt-4">
            {trimText(blogsList[0]?.title, 240)}
          </h6>
          <div
            className="lg:w-[80%]
                        prose-h1:text-h1-responsive prose-h1:mt-12 prose-h1:mb-8 
                        prose-h2:text-h2-responsive prose-h2:mt-12 prose-h2:mb-8 
                        prose-h3:text-h3-responsive prose-h3:mt-8 prose-h3:mb-6
                        prose-h4:text-h4-responsive prose-h4:mt-8 prose-h4:mb-6
                        prose-h5:text-h5-responsive prose-h5:mt-6 prose-h5:mt-4
                        prose-h6:text-h6-responsive prose-h6:mt-4 prose-h6:mt-0

                        prose-headings:text-green-dark prose-headings:!font-bold
                        prose-p:text-gray-500
                        prose-a:text-gray-800 prose-a:underline
                        prose-strong:text-gray-800

                        prose-hr:my-5
                        prose-hr:h-[2px]
                        prose-hr:bg-gray-200
                        prose-hr:border-0

                        prose-ul:text-gray-500 prose-ol:text-gray-500
                        prose-ul:list-disc
                        prose-li:list-inside
                        prose-li:marker:text-gray-500
                        prose-li:marker:-pr-20
                        "
            dangerouslySetInnerHTML={{ __html: blogsList[0]?.short_content }}
          />

          <a
            href={`/blogs/${blogsList[0]?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex bg-green-dark text-light-green px-6 py-3 mt-6 md:mt-9 rounded-2xl text-button-responsive transition-all duration-200 transform hover:scale-105"
          >
            {t("continue_reading")}
          </a>
        </article>
      )}

      {/* Patterned blog layout */}
      {(() => {
        const pattern = [1, 2, 3]; // repeating group sizes
        const blogRows = [];
        let i = 1; // start from second blog (first is handled separately)
        let patternIndex = 0;

        while (i < blogsList.length) {
          const groupSize = pattern[patternIndex % pattern.length];
          const group = blogsList.slice(i, i + groupSize);

          if (group.length === 0) break;

          // Choose layout based on group size
          if (groupSize === 1) {
            blogRows.push(
              <div key={i} className="space-y-8">
                {group.map((article) => (
                  <Link
                    href={`/blogs/${article?.slug}`}
                    key={article?.id}
                    className="inline-flex w-full group cursor-pointer bg-white hover:bg-gray-50 rounded-2xl transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="md:w-80 h-[200px] md:h-80 rounded-t-xl md:rounded-xl md:rounded-r-none overflow-hidden">
                          <img
                            src={article?.banner}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-4 mt-auto mb-auto p-4 md:p-6 md:pl-0">
                        <div className="inline-block">
                          <span className="text-light-green rounded-full text-span-small-responsive font-medium">
                            {article?.category?.title}
                          </span>
                        </div>
                        <h5 className="text-h5-responsive lg:w-[90%] font-bold text-gray-700 leading-tight group-hover:text-green-dark transition-colors duration-200">
                          {trimText(article?.title, 100)}
                        </h5>
                        <div className="flex items-center text-span-small-responsive text-gray-500">
                          {formatDate(article?.created_at, locale)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          } else if (groupSize === 2) {
            blogRows.push(
              <div key={i} className="grid lg:grid-cols-2 gap-8">
                {group.map((article) => (
                  <Link
                    href={`/blogs/${article?.slug}`}
                    key={article?.id}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                      <div className="h-[200px] md:h-[400px] overflow-hidden">
                        <img
                          src={article?.banner}
                          alt={article?.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-6 py-16">
                        <div className="inline-block mb-3">
                          <span className="bg-white text-light-green rounded-full text-span-small-responsive font-medium">
                            {article?.category?.title}
                          </span>
                        </div>
                        <h5 className="text-h5-responsive md:w-[90%] font-semibold text-gray-700 leading-tight mb-3 group-hover:text-green-dark transition-colors duration-200">
                          {article?.title}
                        </h5>
                        <div className="flex items-center text-span-small-responsive text-gray-500">
                          <span>{formatDate(article?.created_at, locale)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          } else if (groupSize === 3) {
            blogRows.push(
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {group.map((article) => (
                  <Link
                    href={`/blogs/${article?.slug}`}
                    key={article?.id}
                    className="group cursor-pointer"
                  >
                    <div className="bg-green-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
                      <div className="overflow-hidden h-[250px] lg:h-[350px]">
                        <img
                          src={article?.banner}
                          alt={article?.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="inline-block mb-2">
                          <span className="bg-light-green text-white px-2 py-1 rounded-xl text-span-small-responsive font-medium">
                            {article?.category?.title}
                          </span>
                        </div>
                        <h5 className="text-h5-responsive font-semibold leading-tight">
                          {article?.title}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          i += groupSize;
          patternIndex++;
        }

        return blogRows;
      })()}

      <Pagination
        totalPages={totalItems}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        className="!mt-10 lg:!mt-20"
      />
    </div>
  );
}

export default Articles;
