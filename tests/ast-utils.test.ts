import * as types from '@babel/types';
import { isCypressObject, isCypressCommand, isCypressAwaitExpression, isCypressExpression } from '../src/ast-utils';

describe('ast-utils', () => {
  describe('isCypressObject', () => {
    it('should return true for a Cypress object', () => {
      const node = types.memberExpression(types.identifier('cy'), types.identifier('get'));
      expect(isCypressObject(node)).toBe(true);
    });

    it('should return false for a non-Cypress object', () => {
      const node = types.memberExpression(types.identifier('notCy'), types.identifier('get'));
      expect(isCypressObject(node)).toBe(false);
    });
  });

  describe('isCypressCommand', () => {
    it('should return true for a Cypress command', () => {
      const node = types.callExpression(
        types.memberExpression(types.identifier('cy'), types.identifier('click')),
        []
      );
      expect(isCypressCommand(node)).toBe(true);
    });

    it('should return false for a non-Cypress command', () => {
      const node = types.callExpression(
        types.memberExpression(types.identifier('notCy'), types.identifier('click')),
        []
      );
      expect(isCypressCommand(node)).toBe(false);
    });
  });

  describe('isCypressAwaitExpression', () => {
    it('should return true for a Cypress await expression', () => {
      const node = types.awaitExpression(
        types.callExpression(
          types.memberExpression(types.identifier('cy'), types.identifier('get')),
          [types.stringLiteral('#button')]
        )
      );
      expect(isCypressAwaitExpression(node)).toBe(true);
    });

    it('should return false for a non-Cypress await expression', () => {
      const node = types.awaitExpression(
        types.callExpression(
          types.memberExpression(types.identifier('notCy'), types.identifier('get')),
          [types.stringLiteral('#button')]
        )
      );
      expect(isCypressAwaitExpression(node)).toBe(false);
    });
  });

  describe('isCypressExpression', () => {
    it('should return true for a Cypress expression', () => {
      const node = types.callExpression(
        types.memberExpression(types.identifier('cy'), types.identifier('find')),
        [types.stringLiteral('input')]
      );
      expect(isCypressExpression(node)).toBe(true);
    });

    it('should return false for a non-Cypress expression', () => {
      const node = types.callExpression(
        types.memberExpression(types.identifier('notCy'), types.identifier('find')),
        [types.stringLiteral('input')]
      );
      expect(isCypressExpression(node)).toBe(false);
    });
  });
});