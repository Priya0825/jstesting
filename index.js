const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const operationHistory = [];

app.get('/', (req, res) => {
  res.send('Welcome to the calculator API!');
});

app.get('/history', (req, res) => {
  // Create a copy of operationHistory without the /history entry
  const historyWithoutHistoryEntry = operationHistory.filter(entry => entry.equation !== 'images/icons/gear.png');
  res.json({ history: historyWithoutHistoryEntry });
});

app.get('/:url*', (req, res) => {
  const fullUrl = req.params.url + req.params[0];

  if (fullUrl === 'history') {
    res.json({ history: operationHistory });
    return;
  }

  const segments = fullUrl.split('/');
  let result = parseFloat(segments[0]);
  let operator;

  const numbers = [];
  const operators = [];

  segments.forEach((segment, index) => {
    if (index % 2 === 0) {
      numbers.push(parseFloat(segment));
    } else {
      operators.push(segment);
    }
  });

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === 'into') {
      numbers[i] *= numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    } else if (operators[i] === 'divide') {
      numbers[i] /= numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    }
  }

  result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === 'plus') {
      result += numbers[i + 1];
    } else if (operators[i] === 'minus') {
      result -= numbers[i + 1];
    }
  }

  operationHistory.push({ equation: fullUrl, result });

  res.json({ result });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
