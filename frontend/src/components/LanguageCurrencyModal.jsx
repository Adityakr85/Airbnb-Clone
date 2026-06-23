import { useState } from "react";
import { X } from "lucide-react";

import currencies from "../data/currencies";
import {
  suggestedLanguages,
  allLanguages,
} from "../data/languages";

function LanguageCurrencyModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("language");

  const [translationEnabled, setTranslationEnabled] =
    useState(true);

  const [selectedLanguage, setSelectedLanguage] =
    useState(
      localStorage.getItem("language") ||
        "English (India)"
    );

  const [selectedCurrency, setSelectedCurrency] =
    useState(
      localStorage.getItem("currency") || "INR"
    );

  const handleLanguageSelect = (item) => {
    const value = `${item.language} (${item.region})`;

    setSelectedLanguage(value);

    localStorage.setItem("language", value);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency.code);

    localStorage.setItem(
      "currency",
      currency.code
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-6xl h-[85vh] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div className="flex gap-8">
            <button
              onClick={() =>
                setActiveTab("language")
              }
              className={`pb-2 ${
                activeTab === "language"
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Language and region
            </button>

            <button
              onClick={() =>
                setActiveTab("currency")
              }
              className={`pb-2 ${
                activeTab === "currency"
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Currency
            </button>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(85vh-70px)] p-8">
          {activeTab === "language" && (
            <>
              {/* Translation */}
              <div className="border rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    Translation
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Automatically translate
                    descriptions and reviews.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setTranslationEnabled(
                      !translationEnabled
                    )
                  }
                  className={`w-14 h-8 rounded-full ${
                    translationEnabled
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              {/* Suggested */}
              <h2 className="text-3xl font-semibold mt-12 mb-8">
                Suggested languages and regions
              </h2>

              <div className="grid grid-cols-5 gap-6">
                {suggestedLanguages.map(
                  (item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleLanguageSelect(item)
                      }
                      className="cursor-pointer"
                    >
                      <h3 className="font-medium">
                        {item.language}
                      </h3>

                      <p className="text-gray-500">
                        {item.region}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* All Languages */}
              <h2 className="text-3xl font-semibold mt-16 mb-8">
                Choose a language and region
              </h2>

              <div className="grid grid-cols-5 gap-6">
                {allLanguages.map(
                  (item, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleLanguageSelect(item)
                      }
                      className={`border rounded-xl p-4 cursor-pointer hover:border-black ${
                        selectedLanguage ===
                        `${item.language} (${item.region})`
                          ? "border-black"
                          : ""
                      }`}
                    >
                      <h3>{item.language}</h3>

                      <p className="text-gray-500">
                        {item.region}
                      </p>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {activeTab === "currency" && (
            <>
              <h2 className="text-3xl font-semibold mb-8">
                Choose a currency
              </h2>

              <div className="grid grid-cols-4 gap-4">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    onClick={() =>
                      handleCurrencySelect(
                        currency
                      )
                    }
                    className={`border rounded-xl p-5 cursor-pointer hover:border-black ${
                      selectedCurrency ===
                      currency.code
                        ? "border-black"
                        : ""
                    }`}
                  >
                    <h3 className="font-semibold">
                      {currency.name}
                    </h3>

                    <p className="text-gray-500">
                      {currency.code} ·{" "}
                      {currency.symbol}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LanguageCurrencyModal;