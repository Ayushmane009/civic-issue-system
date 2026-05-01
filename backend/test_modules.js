const fs = require('fs');
const results = [];

// Test 1: Department Mapping (no DB dependency)
try {
  const m = require('./utils/departmentMapping');
  results.push('departmentMapping: OK');
  results.push('  infrastructure -> ' + m.getDepartmentIdFromCategory('infrastructure'));
  results.push('  sanitation -> ' + m.getDepartmentIdFromCategory('sanitation'));
  results.push('  safety -> ' + m.getDepartmentIdFromCategory('safety'));
  results.push('  transport -> ' + m.getDepartmentIdFromCategory('transport'));
} catch(e) {
  results.push('departmentMapping: FAIL - ' + e.message);
}

// Test 2: Auth Middleware (has DB dep but should parse fine)
try {
  const auth = require('./middleware/authMiddleware');
  results.push('authMiddleware verifyToken: ' + (typeof auth.verifyToken === 'function' ? 'OK' : 'MISSING'));
  results.push('authMiddleware isAdmin: ' + (typeof auth.isAdmin === 'function' ? 'OK' : 'MISSING'));
  results.push('authMiddleware isDeptAdmin: ' + (typeof auth.isDeptAdmin === 'function' ? 'OK' : 'MISSING'));
} catch(e) {
  results.push('authMiddleware: FAIL - ' + e.message);
}

// Test 3: Controllers
try {
  const ic = require('./controllers/issueController');
  const fns = ['reportIssue','getAllIssues','getIssuesByDepartment','getIssueById','updateIssueStatus','updateIssuePriority','addRemarks','deleteIssue','addComment','toggleUpvote'];
  fns.forEach(fn => results.push('issueController.' + fn + ': ' + (typeof ic[fn] === 'function' ? 'OK' : 'MISSING')));
} catch(e) {
  results.push('issueController: FAIL - ' + e.message);
}

try {
  const dc = require('./controllers/deptController');
  const fns = ['getDepartments','createDepartment','getDeptIssues','assignAdminToDept','getDeptStats','getDeptAdmins'];
  fns.forEach(fn => results.push('deptController.' + fn + ': ' + (typeof dc[fn] === 'function' ? 'OK' : 'MISSING')));
} catch(e) {
  results.push('deptController: FAIL - ' + e.message);
}

try {
  const uc = require('./controllers/userController');
  const fns = ['registerUser','loginUser','getUserUpvotes'];
  fns.forEach(fn => results.push('userController.' + fn + ': ' + (typeof uc[fn] === 'function' ? 'OK' : 'MISSING')));
} catch(e) {
  results.push('userController: FAIL - ' + e.message);
}

// Test 4: Routes
try { require('./routes/issueRoutes'); results.push('issueRoutes: OK'); } catch(e) { results.push('issueRoutes: FAIL - ' + e.message); }
try { require('./routes/deptRoutes'); results.push('deptRoutes: OK'); } catch(e) { results.push('deptRoutes: FAIL - ' + e.message); }
try { require('./routes/userRoutes'); results.push('userRoutes: OK'); } catch(e) { results.push('userRoutes: FAIL - ' + e.message); }

results.push('DONE');
fs.writeFileSync('test_results.txt', results.join('\n'), 'utf8');
// Force exit even if DB connection is open
setTimeout(() => process.exit(0), 1000);
