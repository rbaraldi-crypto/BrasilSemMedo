import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({ babel: { plugins: [
function __dualiteSourceLoc({ types: t }) {
  return { visitor: { JSXOpeningElement(path, state) {
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
] },
      babel: {
        plugins: [
          function dualiteSourceLoc({ types: t }: { types: any }) {
            return {
              visitor: {
                JSXOpeningElement(
                  nodePath: any,
                  state: { filename?: string }
                ) {
                  const fn: string = state.filename || '';
                  if (!fn || fn.includes('node_modules')) return;
                  const name = nodePath.node.name;
                  const reactSpecials = ['Fragment', 'StrictMode', 'Suspense', 'Profiler'];
                  const isReactSpecial =
                    (name.type === 'JSXIdentifier' && reactSpecials.includes(name.name)) ||
                    (name.type === 'JSXMemberExpression' &&
                      name.object?.name === 'React' &&
                      reactSpecials.includes(name.property?.name)) ||
                    (name.type === 'JSXMemberExpression' &&
                      (name.property?.name === 'Provider' ||
                        name.property?.name === 'Consumer'));
                  if (isReactSpecial) return;
                  const attrs = nodePath.node.attributes;
                  for (let i = 0; i < attrs.length; i++) {
                    if (
                      attrs[i].type === 'JSXAttribute' &&
                      attrs[i].name?.name === 'data-ds'
                    )
                      return;
                  }
                  const loc = nodePath.node.loc;
                  if (!loc) return;
                  const wd = '/home/project/';
                  const rel = fn.startsWith(wd) ? fn.slice(wd.length) : fn;
                  attrs.push(
                    t.jsxAttribute(
                      t.jsxIdentifier('data-ds'),
                      t.stringLiteral(
                        rel + ':' + loc.start.line + ':' + loc.start.column
                      )
                    )
                  );
                },
              },
            };
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
