import { ValidationAcceptor, ValidationChecks } from 'langium';
import { ReqSpecAstType, Requirement } from './generated/ast';
import type { ReqSpecServices } from './req-spec-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ReqSpecServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ReqSpecValidator;
    const checks: ValidationChecks<ReqSpecAstType> = {
        Requirement: validator.checkRequirementStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ReqSpecValidator {

    checkRequirementStartsWithCapital(req: Requirement, accept: ValidationAcceptor): void {
        if (req.name) {
            const firstChar = req.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Requirement name should start with a capital.', { node: req, property: 'name' });
            }
        }
    }

}
