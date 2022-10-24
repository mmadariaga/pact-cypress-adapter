import { AliasType, AnyObject, PactConfigType, InterceptOptionType } from 'types';
declare global {
    namespace Cypress {
        interface Chainable {
            usePactIntercept: (option: InterceptOptionType, alias: string) => Chainable;
            usePactWait: (alias: AliasType) => Chainable;
            usePactRequest: (option: AnyObject, alias: string) => Chainable;
            usePactGet: (alias: string, pactConfig: PactConfigType) => Chainable;
            setupPact: (consumerName: string, providerName: string) => Chainable<null>;
            setupPactHeaderBlocklist: (headers: string[]) => Chainable<null>;
        }
    }
}
