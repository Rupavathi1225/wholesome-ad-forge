import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink, Leaf } from "lucide-react";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-wellness flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wholesome Wellness Way
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Ads Grid */}
        <div className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className="glass rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {ad.image_url && (
                  <div className="rounded-xl overflow-hidden mb-4">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-foreground">
                    {ad.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {ad.description}
                  </p>
                  <Button
                    onClick={() => window.open(ad.url, "_blank")}
                    className="w-full gradient-wellness hover:opacity-90 transition-opacity text-white font-semibold py-5 rounded-xl"
                  >
                    Visit Website
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Web Results Section */}
        {webResults.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              Web Results
            </h3>
            <div className="space-y-4">
              {webResults.map((result, index) => (
                <a
                  key={result.id}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] group"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <h4 className="text-lg font-semibold text-primary group-hover:text-secondary transition-colors mb-2">
                    {result.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                    {result.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 truncate">
                    {result.url}
                  </p>
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
