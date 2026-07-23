import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { NodePath, PluginObj, PluginPass } from '@babel/core';
import type { JSXOpeningElement } from '@babel/types';

type BabelPluginApi = {
  types: typeof import('@babel/types');
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react({ babel: { plugins: [
function __dualiteSourceLoc({ types: t }: BabelPluginApi): PluginObj<PluginPass> {
  return { visitor: { JSXOpeningElement(path: NodePath<JSXOpeningElement>, state: PluginPass) {
    var fn = state.filename || '';
    if (!fn || fn.includes('node_modules')) return;
    var name = path.node.name;
    var reactSpecials = ['Fragment', 'StrictMode', 'Suspense', 'Profiler'];
    var isReactSpecial = (t.isJSXIdentifier(name) && reactSpecials.indexOf(name.name) !== -1) ||
      (t.isJSXMemberExpression(name) && t.isJSXIdentifier(name.object) && name.object.name === 'React' && reactSpecials.indexOf(name.property.name) !== -1) ||
      (t.isJSXMemberExpression(name) && (name.property.name === 'Provider' || name.property.name === 'Consumer'));
    if (isReactSpecial) return;
    var attrs = path.node.attributes;
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'data-ds') return;
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
