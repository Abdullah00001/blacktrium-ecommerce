const fs = require('fs');
const path = require('path');

const postmanFile = path.join(__dirname, '../docs/BLACKTRIUM _ HIDGIBOD_v1_postman_collection.json');
const modulesDir = path.join(__dirname, '../server/src/app/modules');

let postmanData = JSON.parse(fs.readFileSync(postmanFile, 'utf8'));

// 1. Walk routes
const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) filelist = walkSync(dirFile, filelist);
    else if (file.endsWith('.routes.ts')) filelist.push(dirFile);
  });
  return filelist;
};

// 2. Extract Zod Schema (works for both Body and Query schemas)
const extractZodSchemaMock = (moduleDir, schemaName) => {
  const schemaFiles = fs.readdirSync(moduleDir).filter(f => f.endsWith('.schemas.ts'));
  if (schemaFiles.length === 0) return null;
  const content = fs.readFileSync(path.join(moduleDir, schemaFiles[0]), 'utf8');
  
  const regex = new RegExp(`(?:export\\s+)?const\\s+${schemaName}\\s*=\\s*z\\.object\\(\\{([\\s\\S]*?)\\}\\)`, 'i');
  const match = regex.exec(content);
  if (!match) return null;
  
  const mockBody = {};
  for (const line of match[1].split('\n')) {
    const clean = line.trim();
    if (!clean || clean.startsWith('//')) continue;
    const keyMatch = clean.match(/^([a-zA-Z0-9_]+)\s*:/);
    if (keyMatch) {
      const key = keyMatch[1];
      if (clean.includes('z.string()')) mockBody[key] = 'string_value';
      else if (clean.includes('z.number()')) mockBody[key] = 123;
      else if (clean.includes('z.boolean()')) mockBody[key] = true;
      else if (clean.includes('z.array()')) mockBody[key] = [];
      else mockBody[key] = 'any_value';
    }
  }
  return Object.keys(mockBody).length > 0 ? mockBody : null;
};

// 3. Extract Queries via Regex Fallback
const extractQueryParams = (moduleDir, controllerName) => {
  if (!controllerName || controllerName.includes('(')) return [];
  const controllerFiles = fs.readdirSync(moduleDir).filter(f => f.endsWith('.controllers.ts'));
  if (controllerFiles.length === 0) return [];
  const content = fs.readFileSync(path.join(moduleDir, controllerFiles[0]), 'utf8');
  
  const regex = new RegExp(`(?:export\\s+)?const\\s+${controllerName}\\s*=[\\s\\S]*?req\\.query([\\s\\S]*?);`, 'i');
  const match = regex.exec(content);
  if (!match) return [];
  
  const qStr = match[0];
  const queryKeys = [];
  const destructureMatch = qStr.match(/const\s+\{([^}]+)\}\s*=\s*req\.query/);
  if (destructureMatch) {
    destructureMatch[1].split(',').map(k => k.replace(/[:=].*/, '').trim()).filter(Boolean).forEach(k => queryKeys.push(k));
  }
  if (qStr.includes('page') && !queryKeys.includes('page')) queryKeys.push('page');
  if (qStr.includes('limit') && !queryKeys.includes('limit')) queryKeys.push('limit');
  if (qStr.includes('searchTerm') && !queryKeys.includes('searchTerm')) queryKeys.push('searchTerm');
  if (qStr.includes('targetId') && !queryKeys.includes('targetId')) queryKeys.push('targetId');
  if (qStr.includes('targetType') && !queryKeys.includes('targetType')) queryKeys.push('targetType');
  
  return [...new Set(queryKeys)];
};

// 4. Parse all routes into a Map
const routeMap = {};
walkSync(modulesDir).forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const moduleDir = path.dirname(file);
  const routeRegex = /\.route\(['"`](.*?)['"`]\)/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    const block = content.slice(match.index + match[0].length).split(/\.route\(/)[0];
    
    ['get', 'post', 'patch', 'put', 'delete'].forEach(method => {
      // Find where this method starts
      const methodIndex = block.toLowerCase().indexOf(`.${method}(`);
      if (methodIndex !== -1) {
        // Find where it ends (the next method, or end of block)
        let nextMethodIndex = block.length;
        ['get', 'post', 'patch', 'put', 'delete'].forEach(m => {
          if (m === method) return;
          const idx = block.toLowerCase().indexOf(`.${m}(`);
          if (idx !== -1 && idx > methodIndex && idx < nextMethodIndex) {
            nextMethodIndex = idx;
          }
        });
        
        const methodBlock = block.slice(methodIndex, nextMethodIndex);
        
        let schemaName = null;
        const schemaMatch = methodBlock.match(/validateReqBody\(\s*([a-zA-Z0-9_]+)\s*\)/);
        if (schemaMatch) schemaName = schemaMatch[1];
        
        let querySchemaName = null;
        const querySchemaMatch = methodBlock.match(/validateReqQuery\(\s*([a-zA-Z0-9_]+)\s*\)/);
        if (querySchemaMatch) querySchemaName = querySchemaMatch[1];
        
        let controllerName = null;
        const controllerMatch = methodBlock.match(/([a-zA-Z0-9_]+Controller)/);
        if (controllerMatch) controllerName = controllerMatch[1];
        
        const pathParams = routePath.split('/').filter(p => p.startsWith(':')).map(p => p.substring(1));
        
        let body = null;
        if (schemaName && ['POST', 'PATCH', 'PUT'].includes(method.toUpperCase())) {
          const mock = extractZodSchemaMock(moduleDir, schemaName);
          if (mock) {
            body = {
              mode: 'raw',
              raw: JSON.stringify(mock, null, 2),
              options: { raw: { language: 'json' } }
            };
          }
        }
        
        let queryParams = [];
        if (method.toUpperCase() === 'GET') {
          // Priority 1: Zod Query Schema
          if (querySchemaName) {
            const queryMock = extractZodSchemaMock(moduleDir, querySchemaName);
            if (queryMock) {
              Object.keys(queryMock).forEach(k => {
                let val = 'REPLACE_ME';
                if (k === 'page') val = '1';
                if (k === 'limit') val = '10';
                if (k === 'search' || k === 'searchTerm') val = '';
                queryParams.push({ key: k, value: val, description: 'From Zod Schema' });
              });
            }
          } 
          // Priority 2: Controller Regex
          else if (controllerName) {
            extractQueryParams(moduleDir, controllerName).forEach(k => {
              let val = 'REPLACE_ME';
              if (k === 'page') val = '1';
              if (k === 'limit') val = '10';
              if (k === 'searchTerm') val = '';
              if (k === 'targetType') val = 'BusinessProfile';
              queryParams.push({ key: k, value: val, description: 'Extracted from Controller' });
            });
          }
        }
        
        const key = method.toUpperCase() + ' ' + routePath;
        routeMap[key] = { body, queryParams, pathParams };
      }
    });
  }
});

// 5. Inject into existing Postman items
let injectedCount = 0;
function injectIntoExisting(items) {
  if (!items) return;
  for (const item of items) {
    if (item.item) {
      injectIntoExisting(item.item);
    } else if (item.request && item.request.url) {
      const urlRaw = item.request.url.raw || (typeof item.request.url === 'string' ? item.request.url : '');
      const method = item.request.method.toUpperCase();
      const baseUrl = urlRaw.split('?')[0].replace('{{DEVELOPMENT_SERVER}}', '').replace('{{PRODUCTION_SERVER}}', '');
      
      const key = method + ' ' + baseUrl;
      const mappedData = routeMap[key];
      
      if (mappedData) {
        // Inject URL Path Variables
        if (mappedData.pathParams.length > 0) {
          if (!item.request.url.variable) item.request.url.variable = [];
          mappedData.pathParams.forEach(p => {
            if (!item.request.url.variable.find(v => v.key === p)) {
              item.request.url.variable.push({ key: p, value: `REPLACE_ME_${p.toUpperCase()}` });
            }
          });
        }
        
        // Inject Query Params
        if (mappedData.queryParams.length > 0) {
          if (!item.request.url.query) item.request.url.query = [];
          mappedData.queryParams.forEach(q => {
            if (!item.request.url.query.find(v => v.key === q.key)) {
              item.request.url.query.push(q);
            }
          });
          // Update raw URL to include queries if missing
          if (!item.request.url.raw.includes('?')) {
            item.request.url.raw += '?' + mappedData.queryParams.map(q => `${q.key}=${q.value}`).join('&');
          }
        }
        
        // Inject Body
        if (mappedData.body) {
          // Only inject if it doesn't already have a body configured
          if (!item.request.body || !item.request.body.raw || item.request.body.raw.trim() === '') {
            item.request.body = mappedData.body;
            // Also ensure headers include Content-Type application/json
            if (!item.request.header) item.request.header = [];
            if (!item.request.header.find(h => h.key === 'Content-Type')) {
              item.request.header.push({ key: 'Content-Type', value: 'application/json', type: 'text' });
            }
          }
        }
        
        injectedCount++;
      }
    }
  }
}

injectIntoExisting(postmanData.item);
fs.writeFileSync(postmanFile, JSON.stringify(postmanData, null, 2));
console.log(`Successfully mapped and injected into ${injectedCount} endpoints.`);
