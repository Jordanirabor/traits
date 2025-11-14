import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PersonalityData, savePersonalityData, loadPersonalityData } from "@/lib/storage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BigFiveInput } from "@/components/assessment/BigFiveInput";
import { MBTIInput } from "@/components/assessment/MBTIInput";
import { EnneagramInput } from "@/components/assessment/EnneagramInput";
import { ZodiacInput } from "@/components/assessment/ZodiacInput";
import { ChineseZodiacInput } from "@/components/assessment/ChineseZodiacInput";
import { HumanDesignInput } from "@/components/assessment/HumanDesignInput";
import { AttachmentStyleInput } from "@/components/assessment/AttachmentStyleInput";
import { LoveLanguagesInput } from "@/components/assessment/LoveLanguagesInput";
import { Brain, Users, Heart, Star, Activity, Smile, Sparkles, ArrowLeft, Target, Check, LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";

const Assessment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PersonalityData>({});
  const [layout, setLayout] = useState<"single" | "double">("single");
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const savedData = loadPersonalityData();
    if (savedData) setData(savedData);
  }, []);

  const updateData = (newData: Partial<PersonalityData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    savePersonalityData(updated);
  };

  const handleViewResults = () => {
    if (!data.bigFive && !data.mbti && !data.zodiacSign && !data.attachmentStyle && !data.loveLanguages) {
      toast.error("Please complete at least one assessment");
      return;
    }
    navigate("/results");
  };

  const isFrameworkComplete = (id: string): boolean => {
    switch (id) {
      case "big-five":
        return !!data.bigFive;
      case "mbti":
        return !!data.mbti;
      case "enneagram":
        return !!data.enneagram;
      case "attachment":
        return !!data.attachmentStyle;
      case "love-languages":
        return !!data.loveLanguages;
      case "zodiac":
        return !!data.zodiacSign;
      case "chinese-zodiac":
        return !!data.chineseZodiac;
      case "human-design":
        return !!data.humanDesign;
      default:
        return false;
    }
  };

  const handleAccordionChange = (values: string[]) => {
    if (layout === "double") {
      // Find the newly opened item
      const newlyOpened = values.find(v => !openItems.includes(v));
      if (newlyOpened) {
        const index = frameworks.findIndex(f => f.id === newlyOpened);
        // If it's an even index (left column), also open the next item
        if (index % 2 === 0 && index + 1 < frameworks.length) {
          const pairedItem = frameworks[index + 1].id;
          if (!values.includes(pairedItem)) {
            values = [...values, pairedItem];
          }
        }
        // If it's an odd index (right column), also open the previous item
        else if (index % 2 === 1 && index - 1 >= 0) {
          const pairedItem = frameworks[index - 1].id;
          if (!values.includes(pairedItem)) {
            values = [...values, pairedItem];
          }
        }
      }
    }
    setOpenItems(values);
  };

  const frameworks = [
    { id: "big-five", title: "Big Five Personality Traits", icon: Brain, color: "hsl(210, 100%, 50%)", bgColor: "hsl(210, 100%, 95%)", origin: "Developed by psychologists in the 1980s, the Big Five is the most scientifically validated personality model.", component: <BigFiveInput data={data} onUpdate={updateData} /> },
    { id: "mbti", title: "MBTI Type", icon: Users, color: "hsl(280, 70%, 55%)", bgColor: "hsl(280, 100%, 95%)", origin: "Created by Isabel Myers based on Carl Jung's psychological types, categorizing 16 personality types.", component: <MBTIInput data={data} onUpdate={updateData} /> },
    { id: "enneagram", title: "Enneagram Type", icon: Target, color: "hsl(330, 70%, 55%)", bgColor: "hsl(330, 100%, 95%)", origin: "Ancient personality system with roots in multiple spiritual traditions, describing nine interconnected types with unique motivations.", component: <EnneagramInput data={data} onUpdate={updateData} /> },
    { id: "attachment", title: "Attachment Style", icon: Heart, color: "hsl(142, 71%, 45%)", bgColor: "hsl(142, 100%, 95%)", origin: "Rooted in attachment theory by John Bowlby, describing how early relationships shape bonding patterns.", component: <AttachmentStyleInput data={data} onUpdate={updateData} /> },
    { id: "love-languages", title: "Love Languages", icon: Smile, color: "hsl(350, 80%, 55%)", bgColor: "hsl(350, 100%, 95%)", origin: "Introduced by Gary Chapman in 1992, describing five ways people express and experience love.", component: <LoveLanguagesInput data={data} onUpdate={updateData} /> },
    { id: "zodiac", title: "Zodiac Signs", icon: Star, color: "hsl(45, 100%, 50%)", bgColor: "hsl(45, 100%, 95%)", origin: "Western astrology dates back to ancient Babylon, using celestial positions at birth.", component: <ZodiacInput data={data} onUpdate={updateData} /> },
    { id: "chinese-zodiac", title: "Chinese Zodiac Sign", icon: Activity, color: "hsl(25, 90%, 50%)", bgColor: "hsl(25, 100%, 95%)", origin: "Based on a 12-year cycle in Chinese astrology, each year associated with an animal sign.", component: <ChineseZodiacInput data={data} onUpdate={updateData} /> },
    { id: "human-design", title: "Human Design Type", icon: Sparkles, color: "hsl(170, 80%, 40%)", bgColor: "hsl(170, 100%, 95%)", origin: "Created in 1987 by Ra Uru Hu, combining astrology, I Ching, Kabbalah, and chakras.", component: <HumanDesignInput data={data} onUpdate={updateData} /> },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-10 w-10"><ArrowLeft className="h-5 w-5" /></Button>
            <div><h1 className="text-2xl md:text-3xl font-bold">Personality Assessment</h1><p className="text-sm md:text-base text-muted-foreground mt-1">Complete frameworks you know for personalized insights</p></div>
          </div>
          <ToggleGroup type="single" value={layout} onValueChange={(value) => value && setLayout(value as "single" | "double")}>
            <ToggleGroupItem value="single" aria-label="Single column">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="double" aria-label="Two columns">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Accordion type="multiple" value={openItems} onValueChange={handleAccordionChange} className={layout === "double" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {frameworks.map((f) => { const Icon = f.icon; const isComplete = isFrameworkComplete(f.id); return (<AccordionItem key={f.id} value={f.id} className="border rounded-xl shadow-card bg-card overflow-hidden"><AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline hover:bg-muted/50 transition-smooth"><div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0"><div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: f.bgColor }}><Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: f.color }} /></div><span className="font-semibold text-left text-sm md:text-base">{f.title}</span>{isComplete && <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 ml-2"><Check className="h-3 w-3 text-white" /></div>}</div></AccordionTrigger><AccordionContent className="px-4 md:px-6 pb-6"><div className="pt-4 space-y-4 md:space-y-6"><p className="text-sm text-muted-foreground leading-relaxed">{f.origin}</p>{f.component}</div></AccordionContent></AccordionItem>); })}
        </Accordion>
        <div className="mt-8 flex justify-center"><Button size="lg" onClick={handleViewResults} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12">View My Insights<Sparkles className="ml-2 h-4 w-4" /></Button></div>
      </div>
    </div>
  );
};

export default Assessment;
