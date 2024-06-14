import { transformAwaitExpression } from '../src/then-transformer';
import { types } from '@babel/core';

describe('transformAwaitExpression', () => {
    it('deve transformar corretamente uma expressão de espera do Cypress', () => {
        const inputNode = types.awaitExpression(
            types.callExpression(
                types.memberExpression(
                    types.identifier('cy'),
                    types.identifier('get')
                ),
                [types.stringLiteral('#button')]
            )
        );

        jest.mock('../src/ast-utils', () => ({
            isCypressAwaitExpression: () => true,
            isCypressExpression: () => true
        }));

        const outputNode = transformAwaitExpression(inputNode);
        expect(types.isCallExpression(outputNode)).toBeTruthy();

        const callExpressionNode = outputNode as types.CallExpression;

        if (types.isMemberExpression(callExpressionNode.callee) && types.isIdentifier(callExpressionNode.callee.property)) {
            expect(callExpressionNode.callee.property.name).toBe('then');
        } else {
            throw new Error('Callee is not a MemberExpression or property is not an Identifier');
        }
    });
});