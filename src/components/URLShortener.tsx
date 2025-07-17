import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Link2, Loader2, Zap, Instagram, Linkedin, Github, Mail } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="container mx-auto max-w-4xl px-4 py-6 flex justify-between items-center border-b border-border/20">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Girish URL Shortener
        </h1>
        <ThemeToggle />
      </header>

      <div className="container mx-auto max-w-4xl p-4">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl mb-6 shadow-glow">
            <Link2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Shorten Your URLs
          </h2>
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

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl px-4 py-12 border-t border-border/20 mt-16">
        <div className="text-center space-y-8">
          <h3 className="text-2xl font-semibold text-foreground">Connect with me</h3>
          
          {/* Social Media Links */}
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.instagram.com/girish_lade_/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Instagram className="h-6 w-6 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="sr-only">Instagram</span>
            </a>
            
            <a
              href="https://www.linkedin.com/in/girish-lade-075bba201/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Linkedin className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="sr-only">LinkedIn</span>
            </a>
            
            <a
              href="https://github.com/girishlade111"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-gray-700/10 to-gray-900/10 border border-gray-600/20 hover:border-gray-600/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Github className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
              <span className="sr-only">GitHub</span>
            </a>
            
            <a
              href="https://codepen.io/Girish-Lade-the-looper"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <svg className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.02.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.034-6.674l-4.473 2.99L2.89 8.362l8.086-5.39V14.28zm-6.33 4.233l-2.582 1.73V10.3l2.582 1.726zm1.857 1.25l4.473 2.99v1.494L2.89 15.69l3.618-2.417zm6.537 2.99l4.474-2.98 3.618 2.414-8.092 5.39v-4.82zm6.33-4.23l2.583-1.72v3.456l-2.583-1.73zm-1.855-1.24L13.042 7.8V6.305l8.092 5.39-3.618 2.415z"/>
              </svg>
              <span className="sr-only">CodePen</span>
            </a>
            
            <a
              href="mailto:girishlade111@gmail.com"
              className="group relative p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <Mail className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="sr-only">Email</span>
            </a>
          </div>
          
          <p className="text-muted-foreground text-sm">
            © 2024 Girish Lade. Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default URLShortener;