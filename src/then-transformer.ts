import { types } from "@babel/core";
import { isCypressAwaitExpression, isCypressExpression } from "./ast-utils";
import { throwErrorIf } from "./utils";

const ERRORS = {
    NOT_AWAIT_EXPR: 'Node is not a Cypress await expression',
    NOT_CYPRESS_EXPR: 'Await expression is not a Cypress expression',
    NOT_CALL_EXPR: 'Argument of the await expression is not a call expression',
    NOT_MEMBER_EXPR: 'Callee of the argument node is not a member expression',
    INVALID_CALLEE_OBJECT: 'The callee object is neither an identifier nor a valid member expression for assignment'
};

const CONSTANTS = {
    THEN_METHOD: 'then',
    TEMP_VAR: '___val'
};

/**
 * Transforms a Cypress await expression into a call expression with error handling.
 * This function specifically checks if the provided node is a valid Cypress await expression
 * and transforms it into a 'then' call expression which is commonly used in Cypress for chaining commands.
 *
 * @param {types.AwaitExpression} node - The await expression node to be transformed.
 * @returns {types.CallExpression} - A new transformed call expression suitable for Cypress chaining.
 * @throws {Error} - Throws an error if the node does not meet the necessary criteria, detailing the specific issue.
 */
export function transformAwaitExpression(node: types.AwaitExpression): types.CallExpression {
    throwErrorIf(!isCypressAwaitExpression(node), ERRORS.NOT_AWAIT_EXPR);
    const argumentNode = node.argument;
    throwErrorIf(!isCypressExpression(argumentNode), ERRORS.NOT_CYPRESS_EXPR);
    throwErrorIf(!types.isCallExpression(argumentNode), ERRORS.NOT_CALL_EXPR);

    const variableName = types.identifier(CONSTANTS.TEMP_VAR);

    if (types.isCallExpression(argumentNode)) {
        return createThenCallExpression(argumentNode, variableName);
    } else {
        throw new Error('The argument is not a valid call expression.');
    }
}

/**
 * Creates a 'then' call expression using the provided call expression and a temporary variable.
 * This function constructs a new call expression that assigns the result of the original call expression
 * to a temporary variable and then uses this variable within a Cypress 'then' method.
 *
 * @param {types.CallExpression} argumentNode - The original call expression from the await expression.
 * @param {types.Identifier} variableName - The temporary variable used to capture the result.
 * @returns {types.CallExpression} - A new call expression that incorporates the 'then' method.
 */
function createThenCallExpression(argumentNode: types.CallExpression, variableName: types.Identifier): types.CallExpression {
    const callee = argumentNode.callee;
    if (!types.isMemberExpression(callee)) {
        throw new Error(ERRORS.NOT_MEMBER_EXPR);
    }

    const calleeObject = callee.object;
    throwErrorIf(!types.isIdentifier(calleeObject) && !types.isMemberExpression(calleeObject), ERRORS.INVALID_CALLEE_OBJECT);

    if (!types.isLVal(calleeObject)) {
        throw new Error('The callee object must be a valid LVal.');
    }

    return types.callExpression(
        types.memberExpression(argumentNode, types.identifier(CONSTANTS.THEN_METHOD)),
        [
            types.arrowFunctionExpression(
                [variableName],
                types.blockStatement([
                    types.expressionStatement(
                        types.assignmentExpression(
                            '=',
                            calleeObject,
                            variableName
                        )
                    ),
                ])
            ),
        ]
    );
}
