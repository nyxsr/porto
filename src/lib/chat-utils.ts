// Multi-language intent detection system
// Supports: English, Indonesian, Spanish, French, German, Portuguese, Japanese, Korean, Chinese

interface LanguagePatterns {
  skillTerms: RegExp[];
  askVerbs: RegExp[];
  subjectTerms: RegExp[];
  interrogatives: RegExp[];
  introPatterns: string[];
  negativePatterns: RegExp[];
  listIntents: RegExp[];
  resumePatterns: RegExp[];
  summaryPatterns: RegExp[];
}

// Language-specific patterns
const LANGUAGE_PATTERNS: Record<string, LanguagePatterns> = {
  en: {
    skillTerms: [
      /\bskills?\b/,
      /\bskill[-\s]?set\b/,
      /\bexpertise\b/,
      /\babilities\b/,
      /\bcapabilities\b/,
      /\bspecialt(y|ies)\b/,
      /\bareas?\s+of\s+expertise\b/,
      /\bcompetenc(y|ies)\b/,
      /\bproficienc(y|ies)\b/,
      /\btalents?\b/,
      /\bstrengths?\b/,
    ],
    askVerbs: [
      /\b(what|which)\b/,
      /\blist\b/,
      /\bshow\b/,
      /\btell\b/,
      /\bdescribe\b/,
      /\bshare\b/,
      /\bprovide\b/,
      /\bgive\b/,
      /\bexplain\b/,
      /\bdetail\b/,
    ],
    subjectTerms: [/\b(your|you|sahrul|his|her|their)\b/],
    interrogatives: [/\?$/, /^(what|which|how|can|do|does|are|is|could|would)\b/],
    introPatterns: [
      'who is sahrul',
      'about sahrul',
      'tell me about sahrul',
      'introduce sahrul',
      'who are you',
      'introduce yourself',
    ],
    negativePatterns: [
      /\b(good|nice|strong|solid|great|excellent|amazing)\s+(skill[-\s]?set|skills?)\b/,
      /\b(is|are|was|were|am)\s+(he|she|they|you|sahrul)\s+(skilled|talented|capable)\b/,
      /\b(skilled|skillful|talented|gifted|capable)\b(?!.*\b(what|which|how)\b)/,
    ],
    listIntents: [
      /\b(list|show|enumerate|outline|detail)\b.*\b(skills?|skill[-\s]?set|abilities)\b/,
      /\b(skills?|skill[-\s]?set|abilities)\b.*\b(list|show|enumerate|outline|detail)\b/,
    ],
    resumePatterns: [
      // direct nouns
      /\b(resume|cv|curriculum\s+vitae|portfolio|bio|profile)\b/,
      // actions around resume
      /\b(view|see|show|open|download|share|send|attach|link|provide|give|upload|fetch)\b.*\b(resume|cv|curriculum\s+vitae|portfolio|profile)\b/,
      /\b(resume|cv|curriculum\s+vitae|portfolio|profile)\b.*\b(link|url|pdf|file|doc|version|copy)\b/,
      // possession / about Sahrul
      /\b(sahrul|his|your)\b.*\b(resume|cv|curriculum\s+vitae|portfolio|profile)\b/,
      /\b(resume|cv|curriculum\s+vitae)\b.*\b(of|for)\b.*\b(sahrul|him|you)\b/,
      // freshness
      /\b(updated|latest|newest|recent)\b.*\b(resume|cv)\b/,
      /\b(resume|cv)\b.*\b(updated|latest|newest|recent)\b/,
    ],
    summaryPatterns: [
      /\b(summary|overview|synopsis|abstract|recap|digest|tl;dr|tldr|brief|short version|in a nutshell)\b/,
      /\b(summariz(e|e)|summaris(e|e)|sum\s*up|condense|boil\s*down|give\s+me\s+the\s+gist)\b/,
    ],
  },

  id: {
    skillTerms: [
      /\bskill\b/,
      /\bkeahlian\b/,
      /\bkemampuan\b/,
      /\bspesialisasi\b/,
      /\bbidang\b/,
      /\bkompetensi\b/,
      /\bketerampilan\b/,
      /\btalenta\b/,
      /\bkeunggulan\b/,
      /\bkepakaran\b/,
    ],
    askVerbs: [
      /\bapa\b/,
      /\btolong\b/,
      /\bsebutkan\b/,
      /\btampilkan\b/,
      /\bdaftar(kan)?\b/,
      /\bjelaskan\b/,
      /\bceritakan\b/,
      /\btunjukkan\b/,
      /\buraikan\b/,
      /\bpaparkan\b/,
    ],
    subjectTerms: [/\b(kamu|mu|sahrul|dia|anda|beliau|nya)\b/],
    interrogatives: [/\?$/, /^(apa|bagaimana|bisa|apakah|siapa|kenapa|mengapa|dimana|kapan)\b/],
    introPatterns: [
      'siapa sahrul',
      'siapa sih sahrul',
      'tentang sahrul',
      'ceritakan tentang sahrul',
      'perkenalkan sahrul',
      'siapa kamu',
      'perkenalkan diri',
      'kamu tahu sahrul',
    ],
    negativePatterns: [
      /\b(bagus|baik|hebat|mantap|keren|oke)\s+(skill|keahlian|kemampuan)\b/,
      /\b(apakah|apa)\s+(dia|sahrul|kamu)\s+(jago|hebat|pintar|skilled)\b/,
      /\b(kemampuan|skill|keahlian)\b\s*(nya)?\s*(bagus|oke|mantap|hebat)\b\??/,
    ],
    listIntents: [
      /\b(daftar(kan)?|tampilkan|sebutkan|uraikan)\b.*\b(skill|keahlian|kemampuan)\b/,
      /\b(skill|keahlian|kemampuan)\b.*\b(daftar(kan)?|tampilkan|sebutkan|uraikan)\b/,
    ],
    resumePatterns: [
      /\b(resume|cv|curriculum\s+vitae|profil|portofolio)\b/,
      /\b(lihat|tampilkan|perlihatkan|buka|unduh|download|bagikan|kirim|lampirkan|tautkan|berikan)\b.*\b(resume|cv|curriculum\s+vitae|profil|portofolio)\b/,
      /\b(resume|cv|profil|portofolio)\b.*\b(tautan|link|pdf|berkas|file|versi|salinan)\b/,
      /\b(resume|cv|profil|portofolio)\b.*\b(sahrul)\b|\\b(sahrul)\b.*\b(resume|cv|profil|portofolio)\b/,
      /\b(terbaru|terkini|terupdate|paling\s+baru)\b.*\b(resume|cv)\b/,
      /\b(resume|cv)\b.*\b(terbaru|terkini|terupdate|paling\s+baru)\b/,
    ],
    summaryPatterns: [
      /\b(ringkas|diringkas|ringkasan|rangkuman|simpulkan|kesimpulan|intisari|versi\s+singkat)\b/,
      // NOTE: "resume" in Indonesian often means summary; we’ll disambiguate in code
      /\b(resume)\b/,
    ],
  },

  es: {
    skillTerms: [
      /\bhabilidades?\b/,
      /\bcompetencias?\b/,
      /\bcapacidades?\b/,
      /\bexperiencia\b/,
      /\bespecialidades?\b/,
      /\btalentos?\b/,
      /\bconocimientos?\b/,
    ],
    askVerbs: [
      /\b(que|cual|cuales)\b/,
      /\blistar\b/,
      /\bmostrar\b/,
      /\bdecir\b/,
      /\bdescribir\b/,
      /\bcompartir\b/,
      /\bexplicar\b/,
    ],
    subjectTerms: [/\b(tu|tus|sahrul|su|sus)\b/],
    interrogatives: [/\?$/, /^(que|cual|cuales|como|puedes|puede)\b/],
    introPatterns: ['quien es sahrul', 'sobre sahrul', 'cuentame sobre sahrul', 'presenta sahrul'],
    negativePatterns: [
      /\b(buenas|excelentes|increibles)\s+habilidades\b/,
      /\b(es|esta|tiene)\s+(muy\s+)?(habil|talentoso|capaz)\b/,
    ],
    listIntents: [
      /\b(listar|mostrar|enumerar)\b.*\bhabilidades\b/,
      /\bhabilidades\b.*\b(listar|mostrar|enumerar)\b/,
    ],
    resumePatterns: [
      /\b(curr[ií]culum\s*(vitae)?|cv|perfil|portafolio|hoja\s+de\s+vida)\b/,
      /\b(ver|mostrar|abrir|descargar|compartir|enviar|adjuntar|vincular|proveer|dar)\b.*\b(curr[ií]culum|cv|perfil|portafolio|hoja\s+de\s+vida)\b/,
      /\b(curr[ií]culum|cv|perfil|portafolio)\b.*\b(enlace|link|pdf|archivo|versi[oó]n|copia)\b/,
      /\b(sahrul|su|t[uú])\b.*\b(curr[ií]culum|cv|perfil|portafolio|hoja\s+de\s+vida)\b/,
      /\b(actualizado|reciente|[úu]ltimo)\b.*\b(curr[ií]culum|cv)\b/,
      /\b(curr[ií]culum|cv)\b.*\b(actualizado|reciente|[úu]ltimo)\b/,
    ],
    summaryPatterns: [
      /\b(resumen|resumir|sintesis|sinopsis|vision\s+general|en\s+breve|version\s+corta)\b/,
    ],
  },

  fr: {
    skillTerms: [
      /\bcompetences?\b/,
      /\bcapacites?\b/,
      /\bexpertises?\b/,
      /\btalents?\b/,
      /\bspecialites?\b/,
      /\bsavoir[-\s]?faire\b/,
    ],
    askVerbs: [
      /\b(que|quel|quels|quelle|quelles)\b/,
      /\blister\b/,
      /\bmontrer\b/,
      /\bdire\b/,
      /\bdecrire\b/,
      /\bpartager\b/,
      /\bexpliquer\b/,
    ],
    subjectTerms: [/\b(tes|vos|sahrul|ses)\b/],
    interrogatives: [/\?$/, /^(que|quel|quels|quelle|quelles|comment|peux|peut)\b/],
    introPatterns: [
      'qui est sahrul',
      'a propos de sahrul',
      'parle moi de sahrul',
      'presente sahrul',
    ],
    negativePatterns: [
      /\b(bonnes|excellentes|incroyables)\s+competences\b/,
      /\b(est|a)\s+(tres\s+)?(competent|talentueux|capable)\b/,
    ],
    listIntents: [
      /\b(lister|montrer|enumerer)\b.*\bcompetences\b/,
      /\bcompetences\b.*\b(lister|montrer|enumerer)\b/,
    ],
    resumePatterns: [
      /\b(cv|curriculum\s+vitae|profil|portfolio|dossier)\b/,
      /\b(voir|montrer|ouvrir|t[eé]l[eé]charger|partager|envoyer|joindre|lier|fournir|donner)\b.*\b(cv|curriculum\s+vitae|profil|portfolio|dossier)\b/,
      /\b(cv|profil|portfolio)\b.*\b(lien|pdf|fichier|version|copie)\b/,
      /\b(sahrul|son|ton|votre)\b.*\b(cv|profil|portfolio)\b/,
      /\b(mis\s+à\s+jour|r[eé]cent|dernier|derni[eè]re)\b.*\b(cv)\b/,
      /\b(cv)\b.*\b(mis\s+à\s+jour|r[eé]cent|dernier|derni[eè]re)\b/,
    ],
    summaryPatterns: [
      /\b(resume|re?sume|synthese|synopsis|aper[u|cu]|vue\s+densemble|en\s+bref|version\s+courte)\b/,
    ],
  },

  de: {
    skillTerms: [
      /\bfahigkeiten\b/,
      /\bkompetenzen\b/,
      /\bfertigkeiten\b/,
      /\bexpertise\b/,
      /\bspezialisierungen?\b/,
      /\btalente?\b/,
      /\bstarken\b/,
    ],
    askVerbs: [
      /\b(was|welche)\b/,
      /\bauflisten\b/,
      /\bzeigen\b/,
      /\berzahlen\b/,
      /\bbeschreiben\b/,
      /\bteilen\b/,
      /\berklaren\b/,
    ],
    subjectTerms: [/\b(deine|ihre|sahrul|seine)\b/],
    interrogatives: [/\?$/, /^(was|welche|wie|konnen|kannst|kann)\b/],
    introPatterns: ['wer ist sahrul', 'uber sahrul', 'erzahl mir uber sahrul', 'stelle sahrul vor'],
    negativePatterns: [
      /\b(gute|ausgezeichnete|unglaubliche)\s+fahigkeiten\b/,
      /\b(ist|hat)\s+(sehr\s+)?(fahig|talentiert|kompetent)\b/,
    ],
    listIntents: [
      /\b(auflisten|zeigen|aufzahlen)\b.*\bfahigkeiten\b/,
      /\bfahigkeiten\b.*\b(auflisten|zeigen|aufzahlen)\b/,
    ],
    resumePatterns: [
      /\b(lebenslauf|cv|profil|portfolio|werdegang)\b/,
      /\b(ansehen|zeigen|[öo]ffnen|herunterladen|teilen|senden|anh[aä]ngen|verlinken|bereitstellen|geben)\b.*\b(lebenslauf|cv|profil|portfolio|werdegang)\b/,
      /\b(lebenslauf|cv|profil|portfolio)\b.*\b(link|pdf|datei|version|kopie)\b/,
      /\b(sahrul|sein|dein|ihr)\b.*\b(lebenslauf|cv|profil|portfolio)\b/,
      /\b(aktualisiert|neueste|j[üu]ngste|aktuell)\b.*\b(lebenslauf|cv)\b/,
      /\b(lebenslauf|cv)\b.*\b(aktualisiert|neueste|j[üu]ngste|aktuell)\b/,
    ],
    summaryPatterns: [
      /\b(zusammenfassung|kurzfassung|kurzuebersicht|kurzfassung|ueberblick|überblick|kurz\s+und\s+knapp)\b/,
    ],
  },

  pt: {
    skillTerms: [
      /\bhabilidades?\b/,
      /\bcompetencias?\b/,
      /\bcapacidades?\b/,
      /\bexperiencia\b/,
      /\bespecialidades?\b/,
      /\btalentos?\b/,
      /\bconhecimentos?\b/,
    ],
    askVerbs: [
      /\b(o\s+que|que|quais)\b/,
      /\blistar\b/,
      /\bmostrar\b/,
      /\bcontar\b/,
      /\bdescrever\b/,
      /\bcompartilhar\b/,
      /\bexplicar\b/,
    ],
    subjectTerms: [/\b(suas|tuas|sahrul|dele|dela)\b/],
    interrogatives: [/\?$/, /^(o\s+que|que|quais|como|pode|podes)\b/],
    introPatterns: ['quem e sahrul', 'sobre sahrul', 'conte sobre sahrul', 'apresente sahrul'],
    negativePatterns: [
      /\b(boas|excelentes|incriveis)\s+habilidades\b/,
      /\b(e|tem|esta)\s+(muito\s+)?(habil|talentoso|capaz)\b/,
    ],
    listIntents: [
      /\b(listar|mostrar|enumerar)\b.*\bhabilidades\b/,
      /\bhabilidades\b.*\b(listar|mostrar|enumerar)\b/,
    ],
    resumePatterns: [
      /\b(curr[ií]culo|cv|perfil|portf[oó]lio)\b/,
      /\b(ver|mostrar|abrir|baixar|download|compartilhar|enviar|anexar|vincular|fornecer|dar)\b.*\b(curr[ií]culo|cv|perfil|portf[oó]lio)\b/,
      /\b(curr[ií]culo|cv|perfil|portf[oó]lio)\b.*\b(link|liga[cç][aã]o|pdf|arquivo|vers[aã]o|c[oó]pia)\b/,
      /\b(sahrul|seu|sua|dele|dela|teu|tua)\b.*\b(curr[ií]culo|cv|perfil|portf[oó]lio)\b/,
      /\b(atualizado|mais\s+recente|[uú]ltimo)\b.*\b(curr[ií]culo|cv)\b/,
      /\b(curr[ií]culo|cv)\b.*\b(atualizado|mais\s+recente|[uú]ltimo)\b/,
    ],
    summaryPatterns: [
      /\b(resumo|resumir|sinopse|vis[aã]o\s+geral|em\s+poucas\s+palavras|vers[aã]o\s+curta)\b/,
    ],
  },

  ja: {
    skillTerms: [/スキル/, /技能/, /能力/, /専門性/, /特技/, /得意/, /技術/],
    askVerbs: [/何/, /どんな/, /教えて/, /見せて/, /説明/, /紹介/],
    subjectTerms: [/あなた/, /サフルル/, /彼/, /君/],
    interrogatives: [/？$/, /^(何|どんな|どの|どう)/],
    introPatterns: ['サフルルとは誰', 'サフルルについて', 'サフルルを紹介', 'あなたは誰'],
    negativePatterns: [/いい(スキル|技能)/, /上手/, /得意/],
    listIntents: [/(リスト|一覧).*スキル/, /スキル.*(リスト|一覧)/],
    resumePatterns: [
      /(履歴書|職務経歴書|プロフィール|ポートフォリオ|CV)/,
      /(見せて|表示|開いて|ダウンロード|共有|送って|添付|リンク|提供|ください).*(履歴書|職務経歴書|プロフィール|ポートフォリオ|CV)/,
      /(履歴書|職務経歴書|プロフィール|ポートフォリオ|CV).*(リンク|PDF|ファイル|最新版|更新版|コピー)/,
      /(サフルル|あなた|彼).*(履歴書|職務経歴書|プロフィール|ポートフォリオ|CV)/,
      /(最新|更新).*(履歴書|職務経歴書|CV)/,
      /(履歴書|職務経歴書|CV).*(最新|更新)/,
    ],
    summaryPatterns: [/(要約|概要|まとめ|ダイジェスト|簡潔|短く|要点|概要を教えて)/, /tl;?dr/i],
  },

  ko: {
    skillTerms: [/스킬/, /기술/, /능력/, /전문성/, /특기/, /역량/],
    askVerbs: [/무엇/, /어떤/, /알려/, /보여/, /설명/, /소개/],
    subjectTerms: [/당신/, /사흘룰/, /그/, /너/],
    interrogatives: [/\?$/, /^(무엇|어떤|어느|어떻게)/],
    introPatterns: ['사흘룰은 누구', '사흘룰에 대해', '사흘룰 소개', '당신은 누구'],
    negativePatterns: [/좋은\s*(스킬|기술)/, /잘하/, /뛰어나/],
    listIntents: [/(목록|리스트).*스킬/, /스킬.*(목록|리스트)/],
    resumePatterns: [
      /(이력서|경력기술서|프로필|포트폴리오|CV)/,
      /(보여줘|보기|열기|다운로드|공유|보내|첨부|링크|제공).*(이력서|경력기술서|프로필|포트폴리오|CV)/,
      /(이력서|경력기술서|프로필|포트폴리오|CV).*(링크|pdf|파일|버전|사본)/,
      /(사흘룰|당신|그).*(이력서|경력기술서|프로필|포트폴리오|CV)/,
      /(최신|업데이트|최근).*(이력서|CV)/,
      /(이력서|CV).*(최신|업데이트|최근)/,
    ],
    summaryPatterns: [/(요약|개요|한줄\s*요약|간단히|핵심만|요점)/, /tl;?dr/i],
  },

  zh: {
    skillTerms: [/技能/, /能力/, /专长/, /专业/, /特长/, /技术/, /本领/],
    askVerbs: [/什么/, /哪些/, /告诉/, /说说/, /介绍/, /展示/],
    subjectTerms: [/你/, /萨鲁尔/, /他/, /您/],
    interrogatives: [/？$/, /^(什么|哪些|怎么|如何)/],
    introPatterns: ['萨鲁尔是谁', '关于萨鲁尔', '介绍萨鲁尔', '你是谁'],
    negativePatterns: [/很好的(技能|能力)/, /擅长/, /厉害/],
    listIntents: [/(列表|清单).*技能/, /技能.*(列表|清单)/],
    resumePatterns: [
      /(简历|履历|个人简介|个人资料|作品集|档案|CV)/,
      /(查看|看看|显示|打开|下载|分享|发送|附上|链接|提供).*(简历|履历|个人简介|作品集|CV)/,
      /(简历|履历|个人简介|作品集|CV).*(链接|PDF|文件|版本|副本)/,
      /(萨鲁尔|你|他|您).*(简历|履历|个人简介|作品集|CV)/,
      /(最新|更新|最近).*(简历|CV)/,
      /(简历|CV).*(最新|更新|最近)/,
    ],
    summaryPatterns: [/(摘要|概要|概述|总?結|总?结|简述|简要|要点|简明)/, /tl;?dr/i],
  },
};

// Detect primary language of content
export function detectLanguage(content: string): string {
  const normalized = normalize(content);

  // Language detection heuristics
  const languageScores: Record<string, number> = {};

  Object.entries(LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
    let score = 0;

    // Check for language-specific patterns
    patterns.askVerbs.forEach((pattern) => {
      if (pattern.test(normalized)) score += 2;
    });

    patterns.skillTerms.forEach((pattern) => {
      if (pattern.test(normalized)) score += 2;
    });

    patterns.interrogatives.forEach((pattern) => {
      if (pattern.test(normalized)) score += 1;
    });

    patterns.subjectTerms.forEach((pattern) => {
      if (pattern.test(normalized)) score += 1;
    });

    languageScores[lang] = score;
  });

  // Return language with highest score, default to English
  const detectedLang = Object.entries(languageScores).sort(([, a], [, b]) => b - a)[0]?.[0];

  return detectedLang && languageScores[detectedLang] > 0 ? detectedLang : 'en';
}

export function detectIntroductionInquiry(content: string): boolean {
  const normalized = normalize(content);
  const language = detectLanguage(content);
  const patterns = LANGUAGE_PATTERNS[language]?.introPatterns || LANGUAGE_PATTERNS.en.introPatterns;

  // introPatterns is string[]; match by substring
  return patterns.some((phrase) => normalized.includes(phrase));
}

// Enhanced multi-language skills inquiry detector
export function detectSkillsInquiry(content: string, threshold = 3): boolean {
  if (!content) return false;

  const normalized = normalize(content);
  const language = detectLanguage(content);
  const patterns = LANGUAGE_PATTERNS[language] || LANGUAGE_PATTERNS.en;

  // Early exit for negative patterns
  if (patterns.negativePatterns.some((pattern) => pattern.test(normalized))) {
    return false;
  }

  let score = 0;

  // Must contain at least one skill term
  if (patterns.skillTerms.some((pattern) => pattern.test(normalized))) {
    score += 2;
  } else {
    return false;
  }

  // Add score for explicit ask verbs
  if (patterns.askVerbs.some((pattern) => pattern.test(normalized))) {
    score += 2;
  }

  // Add score if clearly referencing subject
  if (patterns.subjectTerms.some((pattern) => pattern.test(normalized))) {
    score += 1;
  }

  // Add score for interrogative form
  if (patterns.interrogatives.some((pattern) => pattern.test(normalized))) {
    score += 1;
  }

  // Bonus for list intents
  if (patterns.listIntents.some((pattern) => pattern.test(normalized))) {
    score += 1;
  }

  return score >= threshold;
}

export function detectSummaryInquiry(content: string, threshold = 2): boolean {
  if (!content) return false;

  const normalized = normalize(content);
  const language = detectLanguage(content);
  const patterns = LANGUAGE_PATTERNS[language] || LANGUAGE_PATTERNS.en;

  // --- Indonesian disambiguation ---
  // In Indonesian, "resume" commonly means "summary".
  // If user says "resume" WITHOUT clear CV cues, treat it as summary.
  let idResumeAsSummary = false;
  if (language === 'id' && /\bresume\b/.test(normalized)) {
    const cvCues =
      /\b(cv|curriculum\s+vitae|portofolio|profil|lamaran|pekerjaan|pdf|file|berkas|tautan|link)\b/;
    idResumeAsSummary = !cvCues.test(normalized);
  }

  let score = 0;

  // Must contain at least one explicit summary indicator OR the ID special case above
  if (idResumeAsSummary || patterns.summaryPatterns.some((re) => re.test(normalized))) {
    score += 2;
  } else {
    return false;
  }

  // Asking verbs help but aren’t required
  if (patterns.askVerbs.some((re) => re.test(normalized))) score += 1;

  // Referencing subject (you/Sahrul/his) adds confidence
  if (patterns.subjectTerms.some((re) => re.test(normalized))) score += 1;

  // Interrogative form (question marks / question words) adds a bit
  if (patterns.interrogatives.some((re) => re.test(normalized))) score += 1;

  return score >= threshold;
}

export function detectResumeInquiry(content: string, threshold = 3): boolean {
  if (!content) return false;

  const normalized = normalize(content);
  const language = detectLanguage(content);
  const patterns = LANGUAGE_PATTERNS[language] || LANGUAGE_PATTERNS.en;

  // In Indonesian, plain "resume" is usually summary. Require CV cues.
  if (language === 'id' && /\bresume\b/.test(normalized)) {
    const cvCues =
      /\b(cv|curriculum\s+vitae|portofolio|profil|lamaran|pekerjaan|pdf|file|berkas|tautan|link)\b/;
    if (!cvCues.test(normalized)) return false;
  }

  // Early exit for negative patterns (keeps symmetry with skills)
  if (patterns.negativePatterns.some((re) => re.test(normalized))) {
    return false;
  }

  let score = 0;

  if (patterns.resumePatterns.some((re) => re.test(normalized))) score += 2;
  else return false;

  if (patterns.askVerbs.some((re) => re.test(normalized))) score += 2;
  if (patterns.subjectTerms.some((re) => re.test(normalized))) score += 1;
  if (patterns.interrogatives.some((re) => re.test(normalized))) score += 1;
  if (patterns.listIntents.some((re) => re.test(normalized))) score += 1;

  return score >= threshold;
}

// Helper function to normalize text
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[""'']/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Utility function to get supported languages
export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_PATTERNS);
}

// Test function to check detection results
export function testDetection(content: string): {
  detectedLanguage: string;
  isIntroInquiry: boolean;
  isSkillsInquiry: boolean;
  confidence: number;
} {
  const language = detectLanguage(content);
  const isIntro = detectIntroductionInquiry(content);
  const isSkills = detectSkillsInquiry(content);

  // Calculate confidence based on pattern matches
  const patterns = LANGUAGE_PATTERNS[language] || LANGUAGE_PATTERNS.en;
  const normalized = normalize(content);
  let confidence = 0;

  patterns.skillTerms.forEach((p) => {
    if (p.test(normalized)) confidence += 0.2;
  });
  patterns.askVerbs.forEach((p) => {
    if (p.test(normalized)) confidence += 0.2;
  });
  patterns.interrogatives.forEach((p) => {
    if (p.test(normalized)) confidence += 0.1;
  });

  return {
    detectedLanguage: language,
    isIntroInquiry: isIntro,
    isSkillsInquiry: isSkills,
    confidence: Math.min(confidence, 1.0),
  };
}
