import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Globe } from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: string;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
}

interface WebResult {
  id: string;
  title: string;
  description: string;
  url: string;
  display_order: number;
}

const AdsPage = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch non-featured ads (4 ads for the grid)
      const { data: adsData, error: adsError } = await supabase
        .from("ads")
        .select("*")
        .eq("is_featured", false)
        .limit(4);

      if (adsError) throw adsError;
      setAds(adsData || []);

      // Fetch web results
      const { data: resultsData, error: resultsError } = await supabase
        .from("web_results")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(3);

      if (resultsError) throw resultsError;
      setWebResults(resultsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const extractDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-normal text-foreground">
              wholesomewellnessway.com
            </h1>
            <button className="px-4 py-2 text-sm text-muted-foreground hover:bg-muted rounded">
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Ads List */}
        <div className="space-y-6 mb-8">
          {ads.map((ad) => (
            <div key={ad.id} className="ad-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-white/70 mb-1">Sponsored</div>
                  <div className="text-sm text-white/80">{extractDomain(ad.url)}</div>
                </div>
              </div>

              <h2 className="text-xl font-normal mb-4 text-white">
                {ad.title}
              </h2>

              <div className="space-y-2 mb-6">
                {ad.description.split('.').filter(s => s.trim()).map((line, idx) => (
                  <p key={idx} className="text-white/90 text-sm leading-relaxed">
                    {line.trim()}.
                  </p>
                ))}
              </div>

              <button
                onClick={() => window.open(ad.url, "_blank")}
                className="ad-button"
              >
                <ChevronRight className="w-4 h-4" />
                Visit Website
              </button>
            </div>
          ))}
        </div>

        {/* Web Results Section */}
        {webResults.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-normal text-muted-foreground border-b border-border pb-2">
              Web Results
            </h3>
            <div className="space-y-8">
              {webResults.map((result) => (
                <a
                  key={result.id}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="web-result-url mb-1">
                        {extractDomain(result.url)}
                      </div>
                      <h4 className="web-result-title mb-2 group-hover:underline">
                        {result.title}
                      </h4>
                      <p className="web-result-desc">
                        {result.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdsPage;
