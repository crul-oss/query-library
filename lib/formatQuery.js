const prompt = require('prompt-sync')({ sigint: true });

const extractParameters = (query) => {
  const parameterPattern = /\$template.[^\$]+\$/g;

  const parameters = query.match(parameterPattern).map((parameter) => {
    return parameter.split('$').join('');
  });

  return [...new Set(parameters)];;
}

const generateRunTemplateQuery = (name, parameters) => {
  const formattedParameters = parameters.map((parameter) => {
    return `--${parameter} ""`
  })
  const runTemplateQuery = `runTemplate "${name}"\n${formattedParameters.join('\n')}`;

  return runTemplateQuery;
}

const generateFormattedQuery = ({
  tags = [],
  name,
  query,
  description,
  templateSchema,
  usePrompt = true,
} = {}) => {
  // Converts a crul query into a library ready query string
  let parameters = {};
  let runTemplateQuery;

  name = usePrompt ? prompt('Query name (required): ') : name;

  if (!name || name === '') {
    throw new Error('name is required');
  }

  description = usePrompt ? prompt('Query description (required): ') : description;

  if (!description || description === '') {
    throw new Error('description is required');
  }

  query = usePrompt ? prompt('Query (required): ') : query;

  if (!query || query === '') {
    throw new Error('query is required');
  }

  query = query.replace(/\r/g, "\n");

  parameters = extractParameters(query);

  templateSchema = usePrompt ? prompt('Query Template UI Schema (optional): ') : templateSchema;

  if (templateSchema && templateSchema !== '') {
    try {
      JSON.parse(templateSchema);
    } catch (e) {
      throw new Error(`Template is not valid json. ${e}`);
    }
  } else {
    templateSchema = {};
  }

  const formattedQuery = {
    name,
    description,
    query,
    templateSchema,
    parameters,
    runTemplateQuery: generateRunTemplateQuery(name, parameters),
  };

  return formattedQuery;
}

exports.generateRunTemplateQuery = generateRunTemplateQuery;
exports.extractParameters = extractParameters;
exports.generateFormattedQuery = generateFormattedQuery;
