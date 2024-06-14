import * as types from '@babel/types';

export const isCypressObject = (node: types.Node): boolean => {
  return types.isMemberExpression(node) && 
         types.isIdentifier(node.object, { name: 'cy' });
};

export const isCypressCommand = (node: types.Node): boolean => {
  return types.isCallExpression(node) &&
         types.isMemberExpression(node.callee) &&
         types.isIdentifier(node.callee.object) &&
         node.callee.object.name === 'cy';
};

export const isCypressAwaitExpression = (node: types.Node): boolean => {
  if (!types.isAwaitExpression(node)) return false;
  const argument = node.argument;
  
  return types.isCallExpression(argument) && isCypressCommand(argument);
};

export const isCypressExpression = (node: types.Node): boolean => {
  return types.isCallExpression(node) &&
         types.isMemberExpression(node.callee) &&
         types.isIdentifier(node.callee.object, { name: 'cy' });
};