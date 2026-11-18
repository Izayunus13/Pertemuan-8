const trainingData = require('./training-data.json');
const MODEL_VERSION = 'tfidf-multinomial-nb-id-v1';
const stopwords = new Set('saya aku yang dan di ke dari untuk dengan karena sehingga pada itu ini ada harus sedang tidak dapat telah akan dalam oleh sebagai'.split(' '));

function tokenize(text) {
  return text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((word) => word.length > 2 && !stopwords.has(word));
}

// A small educational supervised model. Training examples are synthetic, not student records.
function train(examples) {
  const frequency = new Map();
  const documents = examples.map(({ text, label }) => {
    const tokens = tokenize(text);
    for (const token of new Set(tokens)) frequency.set(token, (frequency.get(token) ?? 0) + 1);
    return { tokens, label };
  });
  const idf = new Map([...frequency].map(([token, count]) => [token, Math.log((1 + documents.length) / (1 + count)) + 1]));
  const labels = [...new Set(examples.map((row) => row.label))];
  const counts = new Map(labels.map((label) => [label, { documents: 0, total: 0, tokens: new Map() }]));
  for (const { tokens, label } of documents) {
    const group = counts.get(label);
    group.documents++;
    for (const token of tokens) {
      const weight = idf.get(token);
      group.tokens.set(token, (group.tokens.get(token) ?? 0) + weight);
      group.total += weight;
    }
  }
  return { idf, counts, documentCount: documents.length };
}
const model = train(trainingData);

function classify(reason) {
  if (typeof reason !== 'string' || reason.trim().length < 10 || reason.length > 2000) throw new Error('Alasan harus berisi 10–2000 karakter.');
  const tokens = tokenize(reason).filter((token) => model.idf.has(token));
  if (new Set(tokens).size < 2) return { category: 'Perlu pemeriksaan manual', modelVersion: MODEL_VERSION };
  const scores = [...model.counts].map(([label, group]) => ({
    label,
    value: Math.log(group.documents / model.documentCount) + tokens.reduce((score, token) => score + model.idf.get(token) * Math.log(((group.tokens.get(token) ?? 0) + 1) / (group.total + model.idf.size)), 0),
  })).sort((a, b) => b.value - a.value);
  // Abstain on ambiguous input. The score is deliberately not presented as calibrated confidence.
  const category = scores[0].value - scores[1].value < 1.5 ? 'Perlu pemeriksaan manual' : scores[0].label;
  return { category, modelVersion: MODEL_VERSION };
}
module.exports = { classify, tokenize, MODEL_VERSION };
