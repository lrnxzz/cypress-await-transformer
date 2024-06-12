import * as types from '@babel/types';

export function isAsyncFunction(node: types.Node): boolean {
    return (types.isFunctionDeclaration(node) || types.isArrowFunctionExpression(node)) && node.async === true;
}

export function createCallbackExpression(returnArgument: types.Node): types.Expression {
    if (!types.isExpression(returnArgument)) {
        throw new Error("arguments need to be an expression");
    }

    const statement = types.expressionStatement(returnArgument);
    return types.callExpression(
        types.memberExpression(types.identifier('cy'), types.identifier('then')),
        [types.arrowFunctionExpression([types.identifier('n')], statement.expression)]
    );
}

export function isCypressCommand(node: types.Node): boolean {
    return types.isCallExpression(node) &&
        types.isMemberExpression(node.callee) &&
        types.isIdentifier(node.callee.object, { name: 'cy' });
}
