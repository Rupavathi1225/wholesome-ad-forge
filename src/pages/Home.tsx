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
  is_featured: boolean;
}

interface WebResult {
  id: string;
  title: string;
  description: string;
  url: string;
  display_order: number;
}

const Home = () => {
  const [featuredAd, setFeaturedAd] = useState<Ad | null>(null);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured ad
      const { data: adData, error: adError } = await supabase
        .from("ads")
        .select("*")
        .eq("is_featured", true)
        .limit(1)
        .single();

      if (adError) throw adError;
      setFeaturedAd(adData);

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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Ad with Banner */}
        {featuredAd && (
          <div className="mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Banner Image */}
            {featuredAd.image_url && (
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={featuredAd.image_url}
                  alt={featuredAd.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Ad Card */}
            <div className="glass rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {featuredAd.title}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {featuredAd.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open(featuredAd.url, "_blank")}
                  className="w-full sm:w-auto gradient-wellness hover:opacity-90 transition-opacity text-white font-semibold py-6 px-8 rounded-xl"
                  size="lg"
                >
                  Visit Website
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Web Results Section */}
        {webResults.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
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
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
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

export default Home;
