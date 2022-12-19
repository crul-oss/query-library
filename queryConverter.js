const prompt = require('prompt-sync')({sigint: true});

// Converts a crul query into a library ready query string
let tags = [];
let name;
let query;
let description = '';
let templateSchema;

name = prompt('Query name (required): ');

if (!name || name === '') {
  throw new Error('name is required');
}

description = prompt('Query description (required): ');

if (!description || description === '') {
  throw new Error('description is required');
}

query = prompt('Query (required): ');

if (!query || query === '') {
  throw new Error('query is required');
}

query = query.replace(/\r/g, "\n");

templateSchema = prompt('Query Template UI Schema (optional): ');

if (templateSchema !== '') {
  try {
    JSON.parse(templateSchema);
  } catch (e) {
    throw new Error(`Template is not valid json. ${e}`);
  }
} else {
  templateSchema = {};
}

const data = {
  name,
  description,
  query,
  templateSchema,
};

console.log(JSON.stringify(data));
