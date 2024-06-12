import * as types from '@babel/types';
import { isAsyncFunction, createCallbackExpression, isCypressCommand } from '../src/ast-utils';

describe('AST Utils', () => {
  describe('isAsyncFunction', () => {
    test('identifies async functions correctly', () => {
      const asyncFunctionNode = types.functionDeclaration(
        types.identifier('test'),
        [],
        types.blockStatement([]),
        false,
        true
      );
      expect(isAsyncFunction(asyncFunctionNode)).toBe(true);

      const regularFunctionNode = types.functionDeclaration(
        types.identifier('test'),
        [],
        types.blockStatement([]),
        false
      );
      expect(isAsyncFunction(regularFunctionNode)).toBe(false);
    });
  });

  describe('createCallbackExpression', () => {
    test('throws error for non-expression arguments', () => {
      const nonExpressionNode = types.objectPattern([]);
      expect(() => createCallbackExpression(nonExpressionNode)).toThrow("arguments need to be an expression");
    });
  });

  describe('isCypressCommand', () => {
    test('identifies Cypress commands correctly', () => {
      const cypressCommandNode = types.callExpression(
        types.memberExpression(types.identifier('cy'), types.identifier('click')),
        []
      );
      expect(isCypressCommand(cypressCommandNode)).toBe(true);

      const nonCypressCommandNode = types.callExpression(
        types.memberExpression(types.identifier('notCy'), types.identifier('click')),
        []
      );
      expect(isCypressCommand(nonCypressCommandNode)).toBe(false);
    });
  });
});