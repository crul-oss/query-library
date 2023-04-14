/* eslint-env mocha */
const assert = require('assert');
const {
  generateFormattedQuery,
  extractParameters,
  generateRunTemplateQuery,
} = require('./formatQuery');

describe('formatQuery', function setup() {
  this.timeout(0);
  const name = 'test';
  const description = 'test description';
  const query = `addcolumn query "$template.query$"
|| urlencode query
|| api post $template.host$/services/search/jobs
--headers '{"Content-Type": "x-www-form-urlencoded"}'
--data "search=$query$"
--verifySSL false
--serializer xml
|| api post $template.host$/services/search/jobs/$response.sid.0$
--verifySSL false
--serializer xml
--while 'entry.content.0.s:dict.0.s:key.6.textContent != "DONE"'
|| api get $entry.id.0$/results?output_mode=json
--verifySSL false
--serializer json
|| table results.*
|| normalize results`;
  before(async () => {
  });
  after(async () => {
  });
  describe('extractParameters', () => {
    it('successfully extracts parameters', () => {
      const parameters = extractParameters(query);
      assert.equal('template.query', parameters[0], 'first parameter extracted');
      assert.equal('template.host', parameters[1], 'second parameter extracted');
    });
  });
  describe('generateRunTemplateQuery', () => {
    it('successfully generates runTemplate query', () => {
      const parameters = extractParameters(query);
      const expectedRunTemplateQuery = `runTemplate "test"
--template.query ""
--template.host ""`;
      const runTemplateQuery = generateRunTemplateQuery(name, parameters);
      assert.equal(runTemplateQuery, expectedRunTemplateQuery, 'correctly generated runTemplate query');
    });
  });
  describe('generateFormattedQuery', () => {
    it('successfully generates formatted query', () => {
      const formattedQuery = generateFormattedQuery({ name, description, query, usePrompt: false });
      const parameters = extractParameters(query);
      const runTemplateQuery = generateRunTemplateQuery(name, parameters);
      assert.equal(formattedQuery.name, name, 'name correct');
      assert.equal(formattedQuery.description, description, 'description correct');
      assert.equal(formattedQuery.parameters[0], parameters[0], 'parameters correct');
      assert.equal(formattedQuery.parameters[1], parameters[1], 'parameters correct');
      assert.equal(formattedQuery.runTemplateQuery, runTemplateQuery, 'runTemplateQuery correct');
    });
  });
});
