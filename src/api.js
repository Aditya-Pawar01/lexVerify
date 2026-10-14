import { alertFeed, alerts, cases, citationTreatments } from './mock/cases.js';

const delay = (ms = 430) => new Promise((resolve) => setTimeout(resolve, ms));

export const exampleQuestions = [
  'Can a landlord evict a tenant without notice?',
  'What must be proved in a cheque bounce case under Section 138?',
  'Is GST Council recommendation binding law?',
  'Does a GPA sale transfer title to immovable property?',
];

export const mockCases = cases;

const answerTemplates = {
  tenancy: {
    text:
      'Eviction depends on the governing rent statute and proof of statutory grounds. The Supreme Court has held that genuine tenant defences should not be rejected mechanically [1], and that a tenant seeking stay after an eviction decree may be asked to pay reasonable occupation charges [2]. This is research support only, not legal advice.',
    citations: [
      { marker: 1, caseId: 'precision-steel-prem-deva-1982', paragraph: 12 },
      { marker: 2, caseId: 'atma-ram-federal-motors-2005', paragraph: 13 },
    ],
  },
  cheque: {
    text:
      'In Section 138 NI Act matters, the complainant must establish dishonour, demand notice, and non-payment within the statutory period. Once cheque execution is admitted, Section 139 supports a rebuttable presumption of legally enforceable debt [1], while notice objections are assessed practically and not by bare denial alone [2]. This is research support only, not legal advice.',
    citations: [
      { marker: 1, caseId: 'rangappa-sri-mohan-2010', paragraph: 8 },
      { marker: 2, caseId: 'cc-alavi-haji-palapetty-2007', paragraph: 15 },
    ],
  },
  gst: {
    text:
      'GST disputes turn closely on the charging provision, rules, and constitutional framework. The Supreme Court has held that GST Council recommendations are persuasive but not independently binding legislation [1], and that refund or ITC rights remain controlled by the statute [2]. This is research support only, not legal advice.',
    citations: [
      { marker: 1, caseId: 'union-india-mohit-minerals-2022', paragraph: 22 },
      { marker: 2, caseId: 'vkc-footsteps-union-india-2022', paragraph: 24 },
    ],
  },
  property: {
    text:
      'Property title questions usually require the registered conveyance and surrounding documents to be verified. The Supreme Court has held that GPA sale arrangements do not transfer title in immovable property [1], and has emphasized that possession must be tied to a lawful source of entitlement [2]. This is research support only, not legal advice.',
    citations: [
      { marker: 1, caseId: 'suraj-lamp-state-haryana-2012', paragraph: 18 },
      { marker: 2, caseId: 'maria-sequeira-ervas-2012', paragraph: 20 },
    ],
  },
  mixed: {
    text:
      'The matching judgments point to statutory ingredients, procedural safeguards, and later treatment of precedent. Use the cited paragraphs as research anchors and verify whether the proposition remains good law before relying on it [1], [2]. This is research support only, not legal advice.',
    citations: [
      { marker: 1, caseId: 'rangappa-sri-mohan-2010', paragraph: 14 },
      { marker: 2, caseId: 'suraj-lamp-state-haryana-2012', paragraph: 18 },
    ],
  },
};

const normalize = (value = '') => value.toLowerCase();

const classifyQuery = (query) => {
  const q = normalize(query);
  const checks = [
    ['tenancy', ['tenant', 'tenancy', 'landlord', 'evict', 'rent', 'premises']],
    ['cheque', ['cheque', 'check', '138', 'ni act', 'negotiable', 'dishonour', 'bounce']],
    ['gst', ['gst', 'igst', 'cgst', 'tax', 'refund', 'input tax', 'council', 'ocean freight']],
    ['property', ['property', 'gpa', 'title', 'sale deed', 'registration', 'possession', 'immovable']],
  ];
  const matches = checks.filter(([, terms]) => terms.some((term) => q.includes(term))).map(([topic]) => topic);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) return 'mixed';
  return 'none';
};

const filterCases = (items, filters = {}) => {
  let result = [...items];

  if (filters.court && filters.court !== 'all') {
    result = result.filter((item) => item.court === filters.court);
  }

  if (filters.yearRange && filters.yearRange !== 'all') {
    result = result.filter((item) => {
      if (filters.yearRange === 'pre-2000') return item.year < 2000;
      if (filters.yearRange === '2000-2010') return item.year >= 2000 && item.year <= 2010;
      if (filters.yearRange === '2011-2020') return item.year >= 2011 && item.year <= 2020;
      return item.year > 2020;
    });
  }

  if (filters.bench && filters.bench !== 'all') {
    result = result.filter((item) => item.bench === filters.bench);
  }

  if (filters.section && filters.section !== 'all') {
    result = result.filter((item) => item.sections.includes(filters.section));
  }

  if (filters.sort === 'newest') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (filters.sort === 'most-cited') {
    result.sort((a, b) => b.citedBy - a.citedBy);
  }

  return result;
};

export async function searchJudgments(query, filters = {}) {
  await delay();

  const category = classifyQuery(query);
  if (category === 'none') {
    return { query, answer: null, cases: [] };
  }

  const topics = category === 'mixed'
    ? ['tenancy', 'cheque bounce', 'GST', 'property']
    : [category === 'cheque' ? 'cheque bounce' : category];

  const matched = cases.filter((item) => item.topics.some((topic) => topics.includes(topic)));
  const filtered = filterCases(matched, filters);

  return {
    query,
    answer: filtered.length ? answerTemplates[category] : null,
    cases: filtered,
  };
}

export async function getCaseById(caseId) {
  await delay(180);
  const found = cases.find((item) => item.id === caseId);
  if (!found) throw new Error('Case not found');
  return found;
}

export async function getRelatedCases(caseId) {
  await delay(220);
  const found = cases.find((item) => item.id === caseId);
  return found ? found.relatedIds.map((id) => cases.find((item) => item.id === id)).filter(Boolean) : [];
}

export async function askFollowUp(question, currentCaseIds = []) {
  await delay(460);
  const sourceCases = currentCaseIds.length ? currentCaseIds : ['rangappa-sri-mohan-2010'];
  return {
    text: `For “${question || 'that follow-up'}”, verify the statutory ingredient against the cited authority and then test whether the facts support rebuttal or distinction [1]. This is research support only, not legal advice.`,
    citations: [{ marker: 1, caseId: sourceCases[0], paragraph: 8 }],
  };
}

export async function checkCitation(input) {
  await delay();
  const q = normalize(input);
  const found = cases.find((item) => normalize(item.name).includes(q) || normalize(item.citation).includes(q) || q.includes(normalize(item.citation)));
  if (!found) {
    return {
      case: null,
      status: 'Distinguished',
      explanation: 'No exact mock match was found. Try Rangappa, Sadanandan Bhadran, Krishna Janardhan Bhat, Suraj Lamp, or Mohit Minerals.',
      timeline: [],
    };
  }
  return {
    case: found,
    ...(citationTreatments[found.id] || {
      status: found.treatment || 'Good Law',
      explanation: `${found.name} has no negative treatment in the current mock citator dataset.`,
      timeline: [{ year: 2024, caseId: found.id, name: found.name, treatment: 'Followed', note: 'No adverse later treatment in mock data.' }],
    }),
  };
}

export async function findSimilarCases(facts) {
  await delay(620);
  const category = classifyQuery(facts);
  const preferred = category === 'none' ? ['tenancy', 'cheque bounce', 'property', 'GST'] : [category === 'cheque' ? 'cheque bounce' : category];
  return cases
    .filter((item) => item.topics.some((topic) => preferred.includes(topic)))
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      similarity: 94 - index * 5,
      similarFacts: item.topics.includes('property') ? 'Comparable document and possession dispute' : item.topics.includes('GST') ? 'Comparable tax levy and statutory construction' : item.topics.includes('cheque bounce') ? 'Comparable cheque dishonour sequence' : 'Comparable rent-control fact pattern',
      similarQuestion: item.sections[0],
      compare: {
        user: facts || 'Pasted facts will appear here for comparison.',
        case: item.summary.facts,
      },
    }));
}

export async function summarizePastedJudgment(text, length = 'short') {
  await delay(560);
  const detailed = length === 'detailed';
  return {
    facts: detailed ? 'The pasted judgment appears to involve disputed facts, statutory interpretation, and application of precedent to the litigating parties.' : 'Disputed facts and statutory interpretation are central.',
    issue: detailed ? 'The principal issue is whether the statutory ingredients are satisfied on the facts and whether precedent controls the outcome.' : 'Whether statutory ingredients and precedent support relief.',
    arguments: detailed ? 'One side relies on statutory text and prior authority. The other side seeks to distinguish facts, procedural posture, or later treatment.' : 'Both sides rely on text, facts, and precedent.',
    ruling: detailed ? 'The likely ruling section should be verified against the full text; this mock summary extracts only a research scaffold.' : 'Verify the full ruling against the source text.',
  };
}

export async function generateDraft(form) {
  await delay(680);
  const side = form.side || 'petitioner';
  const documentType = form.documentType || 'argument';
  return {
    title: `${documentType[0].toUpperCase()}${documentType.slice(1)} for the ${side}`,
    sections: [
      { heading: 'Questions Presented', body: `Whether the ${side} can rely on the stated facts and sections (${form.sections || 'to be verified'}) to obtain the requested relief.` },
      { heading: 'Brief Facts', body: form.description || 'Insert material facts in chronological order with record references.' },
      { heading: 'Submissions', body: 'The submission should connect each statutory ingredient to the evidence and cite binding Supreme Court authority for the legal test.' },
      { heading: 'Prayer', body: 'For these reasons, the requested relief may be granted, subject to verification of pleadings, record, and citations.' },
    ],
    sources: ['rangappa-sri-mohan-2010', 'precision-steel-prem-deva-1982', 'suraj-lamp-state-haryana-2012'].map((id) => cases.find((item) => item.id === id)),
  };
}

export async function getAlerts() {
  await delay(220);
  return { alerts, feed: alertFeed };
}

export async function createAlert(payload) {
  await delay(320);
  return { id: `alert-${Date.now()}`, enabled: true, frequency: payload.frequency || 'daily', ...payload };
}

export async function loginMock({ email, role }) {
  await delay(320);
  if (!email) throw new Error('Email is required');
  return { name: email.split('@')[0], email, role };
}
