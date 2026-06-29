const fs = require('fs');
const path = require('path');

const postmanFile = path.join(__dirname, '../docs/BLACKTRIUM _ HIDGIBOD_v1_postman_collection.json');
const modulesDir = path.join(__dirname, '../server/src/app/modules');

let postmanData;
try {
  postmanData = JSON.parse(fs.readFileSync(postmanFile, 'utf8'));
} catch (err) {
  console.error("Failed to read Postman file:", err);
  process.exit(1);
}

// 1. Extract existing URLs to avoid duplicates
const existingUrls = new Set();
const extractExisting = (items) => {
  for (const item of items) {
    if (item.item) {
      extractExisting(item.item);
    } else if (item.request && item.request.url) {
      const urlRaw = item.request.url.raw || (typeof item.request.url === 'string' ? item.request.url : '');
      const method = item.request.method.toUpperCase();
      const baseUrl = urlRaw.split('?')[0].replace('{{DEVELOPMENT_SERVER}}', '').replace('{{PRODUCTION_SERVER}}', '');
      existingUrls.add(`${method} ${baseUrl}`);
    }
  }
};
extractExisting(postmanData.item);

// 2. Parse all routes using a robust strategy
const parsedRoutes = [];

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (file.endsWith('.routes.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const routeFiles = walkSync(modulesDir);

// Human-readable mapping helper
const generateFriendlyName = (method, routePath) => {
  let action = '';
  switch (method.toLowerCase()) {
    case 'get': action = 'Get'; break;
    case 'post': action = 'Create'; break;
    case 'patch': action = 'Update'; break;
    case 'put': action = 'Replace'; break;
    case 'delete': action = 'Delete'; break;
    default: action = method;
  }

  // Remove parameters like :id for the name parsing, but keep them for context
  let cleanPath = routePath.replace(/\//g, ' ').replace(/:[a-zA-Z]+/g, '').trim();
  if (cleanPath === '') cleanPath = 'Index';
  
  // Specific Overrides for prettier names
  if (method === 'POST' && routePath.endsWith('login')) return 'Login';
  if (method === 'POST' && routePath.endsWith('register')) return 'Register';
  if (method === 'GET' && routePath.endsWith('me')) return 'Get My Profile';
  if (method === 'PATCH' && routePath.endsWith('me')) return 'Update My Profile';

  // Capitalize words
  const titlePath = cleanPath.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `${action} ${titlePath}`.replace(/\s+/g, ' ').trim();
};

routeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Regex to match .route('...')
  const routeRegex = /\.route\(['"`](.*?)['"`]\)/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    
    // To find chained methods, we look at the string immediately following this route match
    // until the next .route or the end of the file.
    const remainingContent = content.slice(match.index + match[0].length);
    const nextRouteMatch = remainingContent.search(/\.route\(/);
    const block = nextRouteMatch !== -1 ? remainingContent.slice(0, nextRouteMatch) : remainingContent;
    
    const methods = ['get', 'post', 'patch', 'put', 'delete'];
    methods.forEach(method => {
      // Look for .get( or .post(
      const methodRegex = new RegExp(`\\.${method}\\(`, 'i');
      if (methodRegex.test(block)) {
        parsedRoutes.push({
          path: routePath,
          method: method.toUpperCase(),
          module: path.basename(path.dirname(file)),
          name: generateFriendlyName(method, routePath)
        });
      }
    });
  }
});

// 3. Construct missing items
let addedCount = 0;

const createPostmanItem = (route) => {
  return {
    name: route.name,
    request: {
      method: route.method,
      header: [],
      url: {
        raw: `{{DEVELOPMENT_SERVER}}${route.path}`,
        host: ["{{DEVELOPMENT_SERVER}}"],
        path: route.path.split('/').filter(Boolean)
      },
      auth: {
        type: "bearer",
        bearer: [
          {
            key: "token",
            value: "{{accessToken}}",
            type: "string"
          }
        ]
      }
    },
    response: []
  };
};

parsedRoutes.forEach(route => {
  const checkKey = `${route.method} ${route.path}`;
  if (!existingUrls.has(checkKey)) {
    const isAdmin = route.path.includes('/admin/');
    const topFolderName = isAdmin ? 'Admin' : 'User';
    const moduleFolderName = route.module.charAt(0).toUpperCase() + route.module.slice(1);
    
    let topFolder = postmanData.item.find(i => i.name === topFolderName);
    if (!topFolder) {
      topFolder = { name: topFolderName, item: [] };
      postmanData.item.push(topFolder);
    }
    
    let moduleFolder = topFolder.item.find(i => i.name.toLowerCase().replace(/\s/g, '') === route.module.toLowerCase());
    if (!moduleFolder) {
      moduleFolder = { name: moduleFolderName, item: [] };
      topFolder.item.push(moduleFolder);
    }
    
    moduleFolder.item.push(createPostmanItem(route));
    existingUrls.add(checkKey);
    addedCount++;
  }
});

fs.writeFileSync(postmanFile, JSON.stringify(postmanData, null, 2));
console.log(`Successfully added ${addedCount} beautifully formatted endpoints to Postman collection.`);
