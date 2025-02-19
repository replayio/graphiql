import { version } from 'graphql';

describe('Errors', () => {
  it('Should show an error when the HTTP request fails', () => {
    cy.visit('/?http-error=true');
    cy.assertQueryResult({
      errors: [
        {
          /**
           * The exact error message can differ depending on the browser and
           * its JSON parser. This is the error you get in Electron (which
           * we use to run the tests headless), the error in the latest Chrome
           * version is different!
           */
          message: 'Unexpected token B in JSON at position 0',
          stack: 'SyntaxError: Unexpected token B in JSON at position 0',
        },
      ],
    });
  });
  it('Should show an error when introspection fails', () => {
    cy.visit('/?graphql-error=true');
    cy.assertQueryResult({
      errors: [{ message: 'Something unexpected happened...' }],
    });
  });
  it('Should show an error when the schema is invalid', () => {
    cy.visit('/?bad=true');
    /**
     * We can't use `cy.assertQueryResult` here because the stack contains line
     * and column numbers of the `graphiql.min.js` bundle which are not stable.
     */
    cy.get('section.result-window').should(element => {
      expect(element.get(0).innerText).to.contain(
        version.startsWith('16.')
          ? 'Names must only contain [_a-zA-Z0-9] but \\"<img src=x onerror=alert(document.domain)>\\" does not.'
          : 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but \\"<img src=x onerror=alert(document.domain)>\\" does not.',
      );
    });
  });
  it('Should show an error when sending an invalid query', () => {
    cy.visitWithOp({ query: '{thisDoesNotExist}' });
    cy.clickExecuteQuery();
    cy.assertQueryResult({
      errors: [
        {
          message: 'Cannot query field "thisDoesNotExist" on type "Test".',
          locations: [{ line: 1, column: 2 }],
        },
      ],
    });
  });
  // Disable tests that started failing after the update to Cypress v8
  // it('Should show an error when sending an invalid subscription', () => {
  //   cy.visitWithOp({ query: 'subscription {thisDoesNotExist}' });
  //   cy.clickExecuteQuery();
  //   cy.assertQueryResult({
  //     errors: [
  //       {
  //         message:
  //           'Cannot query field "thisDoesNotExist" on type "SubscriptionType".',
  //         locations: [{ line: 1, column: 15 }],
  //       },
  //     ],
  //   });
  // });
});
