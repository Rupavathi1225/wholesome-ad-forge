import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Leaf } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

const Admin = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [webResults, setWebResults] = useState<WebResult[]>([]);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editingResult, setEditingResult] = useState<WebResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states for new items
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    url: "",
    image_url: "",
    is_featured: false,
  });

  const [newResult, setNewResult] = useState({
    title: "",
    description: "",
    url: "",
    display_order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: adsData, error: adsError } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });

      if (adsError) throw adsError;
      setAds(adsData || []);

      const { data: resultsData, error: resultsError } = await supabase
        .from("web_results")
        .select("*")
        .order("display_order", { ascending: true });

      if (resultsError) throw resultsError;
      setWebResults(resultsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAd = async () => {
    if (!newAd.title || !newAd.description || !newAd.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("ads").insert([newAd]);
      if (error) throw error;

      toast.success("Ad added successfully");
      setNewAd({ title: "", description: "", url: "", image_url: "", is_featured: false });
      fetchData();
    } catch (error) {
      console.error("Error adding ad:", error);
      toast.error("Failed to add ad");
    }
  };

  const handleUpdateAd = async () => {
    if (!editingAd) return;

    try {
      const { error } = await supabase
        .from("ads")
        .update({
          title: editingAd.title,
          description: editingAd.description,
          url: editingAd.url,
          image_url: editingAd.image_url,
          is_featured: editingAd.is_featured,
        })
        .eq("id", editingAd.id);

      if (error) throw error;

      toast.success("Ad updated successfully");
      setEditingAd(null);
      fetchData();
    } catch (error) {
      console.error("Error updating ad:", error);
      toast.error("Failed to update ad");
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      const { error } = await supabase.from("ads").delete().eq("id", id);
      if (error) throw error;

      toast.success("Ad deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("Failed to delete ad");
    }
  };

  const handleAddResult = async () => {
    if (!newResult.title || !newResult.description || !newResult.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("web_results").insert([newResult]);
      if (error) throw error;

      toast.success("Web result added successfully");
      setNewResult({ title: "", description: "", url: "", display_order: 0 });
      fetchData();
    } catch (error) {
      console.error("Error adding result:", error);
      toast.error("Failed to add web result");
    }
  };

  const handleUpdateResult = async () => {
    if (!editingResult) return;

    try {
      const { error } = await supabase
        .from("web_results")
        .update({
          title: editingResult.title,
          description: editingResult.description,
          url: editingResult.url,
          display_order: editingResult.display_order,
        })
        .eq("id", editingResult.id);

      if (error) throw error;

      toast.success("Web result updated successfully");
      setEditingResult(null);
      fetchData();
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("Failed to update web result");
    }
  };

  const handleDeleteResult = async (id: string) => {
    if (!confirm("Are you sure you want to delete this web result?")) return;

    try {
      const { error } = await supabase.from("web_results").delete().eq("id", id);
      if (error) throw error;

      toast.success("Web result deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting result:", error);
      toast.error("Failed to delete web result");
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
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-normal text-foreground">
              Admin Panel - wholesomewellnessway.com
            </h1>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="ads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="ads">Manage Ads</TabsTrigger>
            <TabsTrigger value="results">Manage Web Results</TabsTrigger>
          </TabsList>

          {/* Ads Management */}
          <TabsContent value="ads" className="space-y-6">
            {/* Add New Ad Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Ad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-ad-title">Title *</Label>
                  <Input
                    id="new-ad-title"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    placeholder="Enter ad title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-ad-description">Description *</Label>
                  <Textarea
                    id="new-ad-description"
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    placeholder="Enter ad description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-ad-url">URL *</Label>
                  <Input
                    id="new-ad-url"
                    value={newAd.url}
                    onChange={(e) => setNewAd({ ...newAd, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-ad-image">Image URL</Label>
                  <Input
                    id="new-ad-image"
                    value={newAd.image_url}
                    onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="new-ad-featured"
                    checked={newAd.is_featured}
                    onCheckedChange={(checked) => setNewAd({ ...newAd, is_featured: checked })}
                  />
                  <Label htmlFor="new-ad-featured">Featured (show on home page)</Label>
                </div>
                <Button onClick={handleAddAd} className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ad
                </Button>
              </CardContent>
            </Card>

            {/* Existing Ads */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Existing Ads</h3>
              {ads.map((ad) => (
                <Card key={ad.id} className="border-border">
                  <CardContent className="pt-6">
                    {editingAd?.id === ad.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editingAd.title}
                          onChange={(e) =>
                            setEditingAd({ ...editingAd, title: e.target.value })
                          }
                        />
                        <Textarea
                          value={editingAd.description}
                          onChange={(e) =>
                            setEditingAd({ ...editingAd, description: e.target.value })
                          }
                          rows={3}
                        />
                        <Input
                          value={editingAd.url}
                          onChange={(e) =>
                            setEditingAd({ ...editingAd, url: e.target.value })
                          }
                        />
                        <Input
                          value={editingAd.image_url || ""}
                          onChange={(e) =>
                            setEditingAd({ ...editingAd, image_url: e.target.value })
                          }
                          placeholder="Image URL"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={editingAd.is_featured}
                            onCheckedChange={(checked) =>
                              setEditingAd({ ...editingAd, is_featured: checked })
                            }
                          />
                          <Label>Featured</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateAd} className="bg-primary hover:bg-primary/90 text-white">
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditingAd(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{ad.title}</h4>
                            {ad.is_featured && (
                              <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/20 text-primary mt-1">
                                Featured
                              </span>
                            )}
                            <p className="text-muted-foreground mt-2">{ad.description}</p>
                            <p className="text-sm text-muted-foreground mt-2 truncate">
                              {ad.url}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingAd(ad)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteAd(ad.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Web Results Management */}
          <TabsContent value="results" className="space-y-6">
            {/* Add New Result Form */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Web Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-result-title">Title *</Label>
                  <Input
                    id="new-result-title"
                    value={newResult.title}
                    onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                    placeholder="Enter result title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-result-description">Description *</Label>
                  <Textarea
                    id="new-result-description"
                    value={newResult.description}
                    onChange={(e) =>
                      setNewResult({ ...newResult, description: e.target.value })
                    }
                    placeholder="Enter result description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-result-url">URL *</Label>
                  <Input
                    id="new-result-url"
                    value={newResult.url}
                    onChange={(e) => setNewResult({ ...newResult, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-result-order">Display Order</Label>
                  <Input
                    id="new-result-order"
                    type="number"
                    value={newResult.display_order}
                    onChange={(e) =>
                      setNewResult({ ...newResult, display_order: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                </div>
                <Button onClick={handleAddResult} className="w-full bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Web Result
                </Button>
              </CardContent>
            </Card>

            {/* Existing Results */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Existing Web Results</h3>
              {webResults.map((result) => (
                <Card key={result.id} className="border-border">
                  <CardContent className="pt-6">
                    {editingResult?.id === result.id ? (
                      <div className="space-y-4">
                        <Input
                          value={editingResult.title}
                          onChange={(e) =>
                            setEditingResult({ ...editingResult, title: e.target.value })
                          }
                        />
                        <Textarea
                          value={editingResult.description}
                          onChange={(e) =>
                            setEditingResult({ ...editingResult, description: e.target.value })
                          }
                          rows={3}
                        />
                        <Input
                          value={editingResult.url}
                          onChange={(e) =>
                            setEditingResult({ ...editingResult, url: e.target.value })
                          }
                        />
                        <Input
                          type="number"
                          value={editingResult.display_order}
                          onChange={(e) =>
                            setEditingResult({
                              ...editingResult,
                              display_order: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Display Order"
                        />
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateResult} className="bg-primary hover:bg-primary/90 text-white">
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditingResult(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                #{result.display_order}
                              </span>
                              <h4 className="font-semibold text-lg">{result.title}</h4>
                            </div>
                            <p className="text-muted-foreground mt-2">{result.description}</p>
                            <p className="text-sm text-muted-foreground mt-2 truncate">
                              {result.url}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingResult(result)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteResult(result.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
