import { ValidationAcceptor, ValidationChecks } from 'langium';
import { ReqSpecAstType, Person } from './generated/ast';
import type { ReqSpecServices } from './req-spec-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ReqSpecServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ReqSpecValidator;
    const checks: ValidationChecks<ReqSpecAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ReqSpecValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
