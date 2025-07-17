import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Link2, Loader2, Zap } from 'lucide-react';

const TINYURL_API_KEY = "hI8x8EyAEyMCrMTkWPvVDS2YPargueTHT6l2Y7FPGTsDLGWQUznhXQMhmv6K";

interface ShortenedURL {
  original: string;
  shortened: string;
  timestamp: Date;
}

const URLShortener = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedURL[]>([]);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://api.tinyurl.com/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TINYURL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          domain: 'tinyurl.com',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const newShortenedUrl: ShortenedURL = {
        original: url,
        shortened: data.data.tiny_url,
        timestamp: new Date(),
      };

      setShortenedUrls(prev => [newShortenedUrl, ...prev]);
      setUrl('');
      
      toast({
        title: "Success!",
        description: "URL shortened successfully!",
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard.",
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl mb-6 shadow-glow">
            <Link2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            URL Shortener
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform long URLs into clean, shareable links instantly. Fast, reliable, and secure.
          </p>
        </div>

        {/* Main Card */}
        <Card className="mb-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-foreground">
              Shorten Your URL
            </CardTitle>
            <CardDescription className="text-base">
              Enter any long URL below and get a shortened version instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 text-base border-2 focus:border-primary/50 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && shortenUrl()}
                />
              </div>
              <Button
                onClick={shortenUrl}
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-loading-dots"></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-loading-dots" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-loading-dots" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {shortenedUrls.length > 0 && (
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Recent URLs
              </CardTitle>
              <CardDescription>
                Your shortened URLs are ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shortenedUrls.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-xl bg-gradient-accent transition-all duration-200 hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Original URL */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Original URL:
                      </p>
                      <p className="text-sm text-foreground/80 break-all">
                        {item.original}
                      </p>
                    </div>

                    {/* Shortened URL */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Shortened URL:
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                        <code className="flex-1 text-primary font-mono text-sm">
                          {item.shortened}
                        </code>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(item.shortened)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUrl(item.shortened)}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-muted-foreground">
                      Created: {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-0 bg-card/60 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Get your shortened URLs in milliseconds with our optimized API
            </p>
          </Card>

          <Card className="text-center p-6 border-0 bg-card/60 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Reliable Links</h3>
            <p className="text-sm text-muted-foreground">
              Powered by TinyURL's trusted infrastructure for maximum uptime
            </p>
          </Card>

          <Card className="text-center p-6 border-0 bg-card/60 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
              <Copy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">
              One-click copy and share functionality for seamless distribution
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default URLShortener;