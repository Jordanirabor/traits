import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadPersonalityData, clearPersonalityData, PersonalityData } from "@/lib/storage";
import { generateInsights, Insights } from "@/lib/insights";
import { getFrameworkDescription } from "@/lib/frameworkDescriptions";
import { InsightCard } from "@/components/results/InsightCard";
import { ArrowLeft, TrendingUp, Sparkles, Heart, AlertTriangle, RefreshCw, Edit, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Results = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PersonalityData | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);

  useEffect(() => {
    const savedData = loadPersonalityData();
    if (!savedData) { navigate("/assessment"); return; }
    setData(savedData);
    setInsights(generateInsights(savedData));
  }, [navigate]);

  const handleReset = () => {
    if (confirm("Clear all data? This cannot be undone.")) {
      clearPersonalityData();
      toast.success("Data cleared");
      navigate("/");
    }
  };

  if (!data || !insights) return null;

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/assessment")} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Your Insights</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden md:inline">Reset</span>
          </Button>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="insights" className="text-sm md:text-base py-2 md:py-3">Insights</TabsTrigger>
            <TabsTrigger value="profile" className="text-sm md:text-base py-2 md:py-3">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-8 mt-6">
            {insights.selfImprovement.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">Growth Areas</h2>
                </div>
                <div className="space-y-4">
                  {insights.selfImprovement.map((i, idx) => (
                    <InsightCard key={idx} {...i} type="improvement" />
                  ))}
                </div>
              </section>
            )}

            {insights.strengths.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">Strengths</h2>
                </div>
                <div className="space-y-4">
                  {insights.strengths.map((i, idx) => (
                    <InsightCard key={idx} {...i} type="strength" />
                  ))}
                </div>
              </section>
            )}

            {insights.greenFlags.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-success" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">What to Seek</h2>
                </div>
                <div className="space-y-4">
                  {insights.greenFlags.map((i, idx) => (
                    <InsightCard key={idx} {...i} type="greenFlag" />
                  ))}
                </div>
              </section>
            )}

            {insights.redFlags.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">Watch Out For</h2>
                </div>
                <div className="space-y-4">
                  {insights.redFlags.map((i, idx) => (
                    <InsightCard key={idx} {...i} type="redFlag" />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            {data.bigFive && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Big Five Personality Traits</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://en.wikipedia.org/wiki/Big_Five_personality_traits" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {getFrameworkDescription('bigFive', data.bigFive)}
                </p>
                <div className="space-y-3">
                  {Object.entries(data.bigFive).map(([trait, score]) => (
                    <div key={trait}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{trait}</span>
                        <span className="text-muted-foreground">{score}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-smooth" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {data.mbti && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">MBTI Type</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://www.16personalities.com/${data.mbti.toLowerCase()}-personality`} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{data.mbti}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('mbti', data.mbti)}
                </p>
              </Card>
            )}

            {data.enneagram && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Enneagram Type</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://www.enneagraminstitute.com/type-${data.enneagram}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">Type {data.enneagram}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('enneagram', data.enneagram)}
                </p>
              </Card>
            )}

            {data.attachmentStyle && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Attachment Style</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.attachmentproject.com/blog/four-attachment-styles/" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary capitalize mb-3">{data.attachmentStyle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('attachmentStyle', data.attachmentStyle)}
                </p>
              </Card>
            )}

            {data.loveLanguages && data.loveLanguages.length > 0 && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Love Languages</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://5lovelanguages.com/" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {getFrameworkDescription('loveLanguages', data.loveLanguages)}
                </p>
                <div className="space-y-2">
                  {data.loveLanguages.map((lang, idx) => (
                    <div key={lang} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="font-bold text-primary">#{idx + 1}</span>
                      <span className="capitalize font-medium">{lang.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {data.zodiacSign && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Zodiac Sign</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://www.astrology.com/zodiac-signs/${data.zodiacSign.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary mb-3">{data.zodiacSign}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('zodiacSign', data.zodiacSign)}
                </p>
              </Card>
            )}

            {data.chineseZodiac && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Chinese Zodiac</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.travelchinaguide.com/intro/social_customs/zodiac/" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary capitalize mb-3">{data.chineseZodiac}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('chineseZodiac', data.chineseZodiac)}
                </p>
              </Card>
            )}

            {data.humanDesign && (
              <Card className="p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Human Design Type</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.jovianarchive.com/Human_Design/Types" target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate("/assessment")} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary capitalize mb-3">{data.humanDesign.replace('-', ' ')}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getFrameworkDescription('humanDesign', data.humanDesign)}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Results;
