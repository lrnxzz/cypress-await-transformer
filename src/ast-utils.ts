import * as types from '@babel/types';

/**
 * Checks if a node is a Cypress object.
 * A Cypress object is identified by the presence of an identifier named 'cy'.
 * 
 * @param {types.Node} node - The node to check.
 * @returns {boolean} Returns true if the node is a Cypress object, false otherwise.
 */
export const isCypressObject = (node: types.Node): boolean => {
  return types.isMemberExpression(node) && 
         types.isIdentifier(node.object, { name: 'cy' });
};

/**
 * Checks if a node is a Cypress command.
 * A Cypress command is a call expression where the callee's object is an identifier 'cy'.
 * 
 * @param {types.Node} node - The node to check.
 * @returns {boolean} Returns true if the node is a Cypress command, false otherwise.
 */
export const isCypressCommand = (node: types.Node): boolean => {
  return types.isCallExpression(node) &&
         types.isMemberExpression(node.callee) &&
         types.isIdentifier(node.callee.object) &&
         node.callee.object.name === 'cy';
};

/**
 * Checks if a node is a Cypress await expression.
 * A Cypress await expression is an 'AwaitExpression' whose argument is a Cypress command.
 * 
 * @param {types.Node} node - The node to check.
 * @returns {boolean} Returns true if the node is a Cypress await expression, false otherwise.
 */
export const isCypressAwaitExpression = (node: types.Node): boolean => {
  if (!types.isAwaitExpression(node)) return false;
  const argument = node.argument;
  return types.isCallExpression(argument) && isCypressCommand(argument);
};

/**
 * Checks if a node is a Cypress expression.
 * A Cypress expression is a call expression where the callee's object is an identifier 'cy'.
 * 
 * @param {types.Node} node - The node to check.
 * @returns {boolean} Returns true if the node is a Cypress expression, false otherwise.
 */
export const isCypressExpression = (node: types.Node): boolean => {
  return types.isCallExpression(node) &&
         types.isMemberExpression(node.callee) &&
         types.isIdentifier(node.callee.object, { name: 'cy' });
};