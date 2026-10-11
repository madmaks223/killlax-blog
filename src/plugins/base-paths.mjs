function shouldPrefix(value, base) {
  return base && typeof value === 'string'
    && value.startsWith('/')
    && !value.startsWith('//')
    && value !== base
    && !value.startsWith(base + '/');
}

function walk(node, base) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'element' && node.properties) {
    for (const property of ['href', 'src', 'poster']) {
      if (shouldPrefix(node.properties[property], base)) node.properties[property] = `${base}${node.properties[property]}`;
    }
  }
  if (Array.isArray(node.children)) node.children.forEach((child) => walk(child, base));
}

export default function basePaths(options = {}) {
  const base = options.base || '';
  return (tree) => walk(tree, base);
}
