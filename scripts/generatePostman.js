const fs = require('fs');
const path = require('path');

const postmanFile = path.join(__dirname, '../docs/BLACKTRIUM _ HIDGIBOD_v1_postman_collection.json');
const modulesDir = path.join(__dirname, '../server/src/app/modules');

// 1. Read existing Postman JSON
let postmanData;
try {
  postmanData = JSON.parse(fs.readFileSync(postmanFile, 'utf8'));
} catch (err) {
  console.error("Failed to read Postman file:", err);
  process.exit(1);
}

// Extract existing URLs to avoid duplicates
const existingUrls = new Set();
const extractExisting = (items) => {
  for (const item of items) {
    if (item.item) {
      extractExisting(item.item);
    } else if (item.request && item.request.url) {
      const urlRaw = item.request.url.raw || (typeof item.request.url === 'string' ? item.request.url : '');
      const method = item.request.method.toUpperCase();
      // Clean up url for exact matching (remove query params for comparison)
      const baseUrl = urlRaw.split('?')[0].replace('{{DEVELOPMENT_SERVER}}', '').replace('{{PRODUCTION_SERVER}}', '');
      existingUrls.add(`${method} ${baseUrl}`);
    }
  }
};
extractExisting(postmanData.item);

// 2. Parse all routes
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

routeFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // We'll use a regex to capture .route('path') followed by .method(...)
  // Note: this is a simple regex that assumes standard formatting.
  const routeRegex = /\.route\(['"`](.*?)['"`]\)[\s\S]*?(?=\.route|$)/g;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const routePath = match[1];
    const block = match[0];
    
    // Find methods in this block
    const methods = ['get', 'post', 'patch', 'put', 'delete'];
    methods.forEach(method => {
      // Look for .get( or .post(
      const methodRegex = new RegExp(`\\.${method}\\(`, 'i');
      if (methodRegex.test(block)) {
        parsedRoutes.push({
          path: routePath,
          method: method.toUpperCase(),
          module: path.basename(path.dirname(file)) // folder name
        });
      }
    });
  }
});

// 3. Construct missing items
let addedCount = 0;

const createPostmanItem = (route) => {
  const nameParts = route.path.split('/').filter(Boolean);
  const name = nameParts.length > 0 ? nameParts[nameParts.length - 1].replace(/-/g, ' ') : route.module;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  return {
    name: `${capitalizedName} [Auto]`,
    request: {
      method: route.method,
      header: [],
      url: {
        raw: `{{DEVELOPMENT_SERVER}}${route.path}`,
        host: ["{{DEVELOPMENT_SERVER}}"],
        path: route.path.split('/').filter(Boolean)
      }
    },
    response: []
  };
};

parsedRoutes.forEach(route => {
  const checkKey = `${route.method} ${route.path}`;
  if (!existingUrls.has(checkKey)) {
    // Add it
    const isAdmin = route.path.includes('/admin/');
    const topFolderName = isAdmin ? 'Admin' : 'User';
    const moduleFolderName = route.module.charAt(0).toUpperCase() + route.module.slice(1);
    
    // Find or create top folder
    let topFolder = postmanData.item.find(i => i.name === topFolderName);
    if (!topFolder) {
      topFolder = { name: topFolderName, item: [] };
      postmanData.item.push(topFolder);
    }
    
    // Find or create module folder
    let moduleFolder = topFolder.item.find(i => i.name.toLowerCase().replace(/\s/g, '') === route.module.toLowerCase());
    if (!moduleFolder) {
      moduleFolder = { name: moduleFolderName, item: [] };
      topFolder.item.push(moduleFolder);
    }
    
    // Add item
    moduleFolder.item.push(createPostmanItem(route));
    existingUrls.add(checkKey); // Mark as added
    addedCount++;
  }
});

// 4. Save file
fs.writeFileSync(postmanFile, JSON.stringify(postmanData, null, 2));
console.log(`Successfully added ${addedCount} missing endpoints to Postman collection.`);
