import { useState, useEffect } from 'react';

interface MotivationalQuote {
  text: string;
  author?: string;
}

export const useMotivationalQuotes = () => {
  const [quote, setQuote] = useState<MotivationalQuote>({
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try ZenQuotes API first
      let response = await fetch('https://zenquotes.io/api/random');
      let data = await response.json();
      
      if (data && data[0] && data[0].q) {
        setQuote({
          text: data[0].q,
          author: data[0].a !== 'zenquotes.io' ? data[0].a : undefined
        });
        return;
      }

      // Fallback to Quotable API
      response = await fetch('https://api.quotable.io/random?tags=motivational,inspirational');
      data = await response.json();
      
      if (data && data.content) {
        setQuote({
          text: data.content,
          author: data.author
        });
        return;
      }

      // If both APIs fail, use a backup quote
      throw new Error('No quotes available');
      
    } catch (err) {
      console.error('Error fetching motivational quote:', err);
      setError('Failed to load quote');
      
      // Fallback quotes
      const fallbackQuotes = [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
        { text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.", author: "Unknown" },
        { text: "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.", author: "Steve Jobs" },
        { text: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen" }
      ];
      
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    
    // Update quote every 30 seconds
    const interval = setInterval(fetchQuote, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { quote, isLoading, error, refreshQuote: fetchQuote };
};