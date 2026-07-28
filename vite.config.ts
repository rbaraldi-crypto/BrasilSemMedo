import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Minimal structural types for the inline Babel plugin below. Declared locally so
 * this config does not depend on transitive @types/babel__* packages being hoisted.
 */
interface BabelNode {
  type: string;
  name: any;
  object?: any;
  property?: any;
  attributes: any[];
  loc?: { start: { line: number; column: number } } | null;
}
interface BabelPath {
  node: BabelNode;
}
interface BabelState {
  filename?: string;
}
interface BabelTypesApi {
  jsxAttribute: (name: any, value: any) => any;
  jsxIdentifier: (name: string) => any;
  stringLiteral: (value: string) => any;
}

export default defineConfig({
  plugins: [react({ babel: { plugins: [
function __dualiteSourceLoc({ types: t }: { types: BabelTypesApi }) {
  return { visitor: { JSXOpeningElement(path: BabelPath, state: BabelState) {
    var fn = state.filename || '';
    if (!fn || fn.includes('node_modules')) return;
    var name = path.node.name;
    var reactSpecials = ['Fragment', 'StrictMode', 'Suspense', 'Profiler'];
    var isReactSpecial = (name.type === 'JSXIdentifier' && reactSpecials.indexOf(name.name) !== -1) ||
      (name.type === 'JSXMemberExpression' && name.object && name.object.name === 'React' && name.property && reactSpecials.indexOf(name.property.name) !== -1) ||
      (name.type === 'JSXMemberExpression' && name.property && (name.property.name === 'Provider' || name.property.name === 'Consumer'));
    if (isReactSpecial) return;
    var attrs = path.node.attributes;
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].type === 'JSXAttribute' && attrs[i].name && attrs[i].name.name === 'data-ds') return;
    }
    var loc = path.node.loc;
    if (!loc) return;
    var wd = '/home/project/';
    var rel = fn.startsWith(wd) ? fn.slice(wd.length) : fn;
    attrs.push(t.jsxAttribute(t.jsxIdentifier('data-ds'), t.stringLiteral(rel + ':' + loc.start.line + ':' + loc.start.column)));
  } } };
}
] } })],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
