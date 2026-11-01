import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/book";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Newspaper,
  GraduationCap,
  Atom,
  Landmark,
  Cpu,
  User,
  Layers,
  Feather,
  FlaskConical,
  Scroll,
  Globe2,
  Palette,
  Music,
  Trophy,
  Heart,
  Sparkles,
  Rocket,
  Calculator,
  Scale,
  Languages,
  UtensilsCrossed,
  Briefcase,
  BookMarked,
  Ghost,
  type LucideIcon,
} from "lucide-react";

interface CategoryTheme {
  icon: LucideIcon;
  /** HSL triplets (no hsl() wrapper) */
  primary: string;
  deep: string;
  pattern: (c: string) => string;
}

// Distinct color themes + icons per genre. Custom categories fall back by keyword.
const THEME_MAP: Record<string, CategoryTheme> = {
  fiction: {
    icon: Feather,
    primary: "350 65% 47%",
    deep: "350 70% 32%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 22 Q11 11 22 22 Q33 33 44 22' fill='none' stroke='hsl(${encodeURIComponent(c)}/.30)' stroke-width='2'/%3E%3Cpath d='M0 33 Q11 22 22 33 Q33 44 44 33' fill='none' stroke='hsl(${encodeURIComponent(c)}/.20)' stroke-width='1.5'/%3E%3Cpath d='M0 11 Q11 0 22 11 Q33 22 44 11' fill='none' stroke='hsl(${encodeURIComponent(c)}/.14)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  "non-fiction": {
    icon: Newspaper,
    primary: "200 60% 40%",
    deep: "205 65% 28%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='32' height='32' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='12' height='12' rx='2' fill='hsl(${encodeURIComponent(c)}/.08)' stroke='hsl(${encodeURIComponent(c)}/.26)' stroke-width='1.5'/%3E%3Crect x='18' y='18' width='12' height='12' rx='2' fill='hsl(${encodeURIComponent(c)}/.05)' stroke='hsl(${encodeURIComponent(c)}/.20)' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  textbooks: {
    icon: GraduationCap,
    primary: "262 52% 47%",
    deep: "262 58% 34%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='10' x2='40' y2='10' stroke='hsl(${encodeURIComponent(c)}/.24)' stroke-width='1.5'/%3E%3Cline x1='0' y1='20' x2='40' y2='20' stroke='hsl(${encodeURIComponent(c)}/.24)' stroke-width='1.5'/%3E%3Cline x1='0' y1='30' x2='40' y2='30' stroke='hsl(${encodeURIComponent(c)}/.24)' stroke-width='1.5'/%3E%3Cline x1='8' y1='0' x2='8' y2='40' stroke='hsl(${encodeURIComponent(c)}/.14)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  science: {
    icon: Atom,
    primary: "174 62% 34%",
    deep: "174 70% 24%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24' cy='24' r='8' fill='none' stroke='hsl(${encodeURIComponent(c)}/.26)' stroke-width='1.5'/%3E%3Ccircle cx='24' cy='24' r='16' fill='none' stroke='hsl(${encodeURIComponent(c)}/.16)' stroke-width='1'/%3E%3Ccircle cx='24' cy='24' r='3' fill='hsl(${encodeURIComponent(c)}/.22)'/%3E%3Cline x1='24' y1='8' x2='24' y2='16' stroke='hsl(${encodeURIComponent(c)}/.14)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  history: {
    icon: Landmark,
    primary: "32 70% 42%",
    deep: "28 75% 30%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L20 20 L40 0' fill='none' stroke='hsl(${encodeURIComponent(c)}/.26)' stroke-width='1.5'/%3E%3Cpath d='M0 20 L20 40 L40 20' fill='none' stroke='hsl(${encodeURIComponent(c)}/.16)' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  technology: {
    icon: Cpu,
    primary: "217 70% 45%",
    deep: "222 75% 32%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='36' height='36' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='4' y='4' width='10' height='10' fill='hsl(${encodeURIComponent(c)}/.14)'/%3E%3Crect x='22' y='4' width='10' height='10' fill='hsl(${encodeURIComponent(c)}/.09)'/%3E%3Crect x='4' y='22' width='10' height='10' fill='hsl(${encodeURIComponent(c)}/.09)'/%3E%3Crect x='22' y='22' width='10' height='10' fill='hsl(${encodeURIComponent(c)}/.14)'/%3E%3Cline x1='14' y1='9' x2='22' y2='9' stroke='hsl(${encodeURIComponent(c)}/.18)' stroke-width='1'/%3E%3Cline x1='18' y1='14' x2='18' y2='22' stroke='hsl(${encodeURIComponent(c)}/.18)' stroke-width='1'/%3E%3C/svg%3E")`,
  },
  biography: {
    icon: User,
    primary: "16 60% 45%",
    deep: "14 65% 32%",
    pattern: (c) =>
      `url("data:image/svg+xml,%3Csvg width='44' height='44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 4 C28 10 36 14 36 22 C36 30 28 36 22 40 C16 36 8 30 8 22 C8 14 16 10 22 4Z' fill='hsl(${encodeURIComponent(c)}/.08)' stroke='hsl(${encodeURIComponent(c)}/.26)' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
};

// Keyword fallbacks for custom categories added by the librarian
const KEYWORD_THEMES: Array<[RegExp, CategoryTheme]> = [
  [/poet/i, { icon: Feather, primary: "300 45% 45%", deep: "300 50% 32%", pattern: THEME_MAP.fiction.pattern }],
  [/mystery|thriller|crime/i, { icon: Ghost, primary: "260 30% 35%", deep: "260 35% 24%", pattern: THEME_MAP["non-fiction"].pattern }],
  [/fantasy|magic/i, { icon: Sparkles, primary: "280 60% 50%", deep: "280 65% 36%", pattern: THEME_MAP.fiction.pattern }],
  [/sci-?fi|science fiction|space|robot|dystopia|utopia/i, { icon: Rocket, primary: "210 75% 45%", deep: "215 80% 30%", pattern: THEME_MAP.technology.pattern }],
  [/historic|ancient|myth|legend/i, { icon: Scroll, primary: "38 60% 42%", deep: "34 65% 30%", pattern: THEME_MAP.history.pattern }],
  [/linguist|grammar|language|hindi|english|french|marathi|sanskrit/i, { icon: Languages, primary: "185 60% 40%", deep: "190 65% 28%", pattern: THEME_MAP.textbooks.pattern }],
  [/management|business|commerce|econom|finance/i, { icon: Briefcase, primary: "220 35% 42%", deep: "225 40% 30%", pattern: THEME_MAP.textbooks.pattern }],
  [/reference|encyclop|dictionar|atlas/i, { icon: BookMarked, primary: "35 55% 40%", deep: "30 60% 28%", pattern: THEME_MAP.history.pattern }],
  [/religio|spirit|theolog|philosoph/i, { icon: Landmark, primary: "265 40% 45%", deep: "270 45% 32%", pattern: THEME_MAP.history.pattern }],
  [/self.?help|motivation|wellness|health|medic|yoga/i, { icon: Heart, primary: "0 60% 50%", deep: "0 65% 36%", pattern: THEME_MAP.science.pattern }],
  [/math/i, { icon: Calculator, primary: "190 70% 38%", deep: "195 75% 26%", pattern: THEME_MAP.textbooks.pattern }],
  [/geograph|travel|world/i, { icon: Globe2, primary: "160 55% 38%", deep: "165 60% 26%", pattern: THEME_MAP.history.pattern }],
  [/art|paint|draw|craft/i, { icon: Palette, primary: "340 70% 50%", deep: "340 75% 36%", pattern: THEME_MAP.biography.pattern }],
  [/music/i, { icon: Music, primary: "45 85% 42%", deep: "40 90% 30%", pattern: THEME_MAP.fiction.pattern }],
  [/sport|game/i, { icon: Trophy, primary: "100 45% 40%", deep: "105 50% 28%", pattern: THEME_MAP.technology.pattern }],
  [/cook|food|recipe/i, { icon: UtensilsCrossed, primary: "20 75% 48%", deep: "18 80% 34%", pattern: THEME_MAP.biography.pattern }],
  [/law|legal/i, { icon: Scale, primary: "230 40% 45%", deep: "235 45% 32%", pattern: THEME_MAP["non-fiction"].pattern }],
  [/classic|literature/i, { icon: BookMarked, primary: "35 55% 40%", deep: "30 60% 28%", pattern: THEME_MAP.history.pattern }],
  [/lab|experiment|chemist|physics|biolog/i, { icon: FlaskConical, primary: "150 55% 36%", deep: "155 60% 24%", pattern: THEME_MAP.science.pattern }],
];

const FALLBACK_THEME: CategoryTheme = {
  icon: Layers,
  primary: "215 20% 45%",
  deep: "220 25% 32%",
  pattern: (c) =>
    `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='2' fill='hsl(${encodeURIComponent(c)}/.24)'/%3E%3C/svg%3E")`,
};

const getTheme = (name: string): CategoryTheme => {
  const key = name.trim().toLowerCase();
  if (THEME_MAP[key]) return THEME_MAP[key];
  for (const [re, theme] of KEYWORD_THEMES) {
    if (re.test(key)) return theme;
  }
  return FALLBACK_THEME;
};

interface CategoryTilesProps {
  books: Book[];
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export function CategoryTiles({ books }: CategoryTilesProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("book_categories")
      .select("id, name, icon, color")
      .order("name");
    if (data) setCategories(data);
  };

  const getBookCount = (categoryName: string) => {
    return books.filter(
      (b) => b.category?.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const getAvailableCount = (categoryName: string) => {
    return books.filter(
      (b) =>
        b.category?.toLowerCase() === categoryName.toLowerCase() &&
        b.status === "available"
    ).length;
  };

  // Show every category that exists in the library, plus any book category
  // that has no matching category record yet.
  const knownNames = new Set(categories.map((c) => c.name.toLowerCase()));
  const unknownCategories = [
    ...new Set(
      books
        .map((b) => b.category)
        .filter((c) => c && !knownNames.has(c.toLowerCase()))
    ),
  ] as string[];

  const renderTile = (name: string, key: string) => {
    const theme = getTheme(name);
    const IconComp = theme.icon;
    const count = getBookCount(name);
    const available = getAvailableCount(name);

    return (
      <Card
        key={key}
        className="cursor-pointer group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden relative"
        onClick={() => navigate(`/category/${encodeURIComponent(name)}`)}
        style={{
          background: `${theme.pattern(theme.primary)}, linear-gradient(150deg, hsl(${theme.primary} / 0.22) 0%, hsl(${theme.primary} / 0.08) 55%, hsl(${theme.deep} / 0.16) 100%)`,
        }}
      >
        {/* Deep corner accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-[3.5rem] transition-all duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(225deg, hsl(${theme.deep} / 0.28), hsl(${theme.deep} / 0.08))`,
          }}
        />
        {/* Bottom edge tint */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, hsl(${theme.primary} / 0.55), hsl(${theme.deep} / 0.55))`,
          }}
        />
        <CardContent className="p-6 flex flex-col items-center text-center gap-3 relative z-[1]">
          <div
            className="p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg"
            style={{
              background: `linear-gradient(145deg, hsl(${theme.primary}), hsl(${theme.deep}))`,
              color: "hsl(0 0% 100%)",
              boxShadow: `0 4px 14px hsl(${theme.primary} / 0.35)`,
            }}
          >
            <IconComp className="h-8 w-8" />
          </div>
          <div>
            <h3
              className="font-semibold"
              style={{ color: `hsl(${theme.deep})` }}
            >
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {count} {count === 1 ? "book" : "books"}
            </p>
            <p className="text-xs text-muted-foreground">
              {available} available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((cat) => renderTile(cat.name, cat.id))}
      {unknownCategories.map((catName) => renderTile(catName, `unknown-${catName}`))}
    </div>
  );
}
