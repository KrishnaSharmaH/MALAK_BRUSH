import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("neon");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your neon creation.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-neon-image', {
        body: { prompt, style }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Generation Failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast({
          title: "Image Generated!",
          description: "Your neon masterpiece is ready.",
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            MALAK BRUSH
          </h1>
          <p className="text-xl text-muted-foreground">Neon Creative AI — Generate Cyberpunk Art</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6 neon-border bg-card/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Describe Your Vision
                </label>
                <Textarea
                  placeholder="A futuristic cityscape with flying cars..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] bg-input border-border focus:border-primary transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-primary mb-2 block">
                  Art Style
                </label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neon">Neon Cyberpunk</SelectItem>
                    <SelectItem value="anime">Anime Neon</SelectItem>
                    <SelectItem value="cyberpunk">Dark Cyberpunk</SelectItem>
                    <SelectItem value="synthwave">Synthwave</SelectItem>
                    <SelectItem value="vaporwave">Vaporwave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full neon-glow-cyan hover:neon-glow-magenta transition-all duration-300"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6 neon-border bg-card/50 backdrop-blur-sm flex items-center justify-center min-h-[400px]">
            {isGenerating ? (
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Creating your neon masterpiece...</p>
              </div>
            ) : imageUrl ? (
              <div className="w-full animate-scale-in">
                <img
                  src={imageUrl}
                  alt="Generated neon art"
                  className="w-full h-auto rounded-lg neon-border"
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated image will appear here</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;