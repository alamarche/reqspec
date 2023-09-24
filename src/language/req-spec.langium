/*
 * Copyright (c) 2023 Andrew LaMarche
 * All rights reserved
 * 
 * See repository license for details
 * 
 * This grammar takes inspiration from Feiler et. al. 2016 - "A Requirement Specification Language for AADL"
 * https://insights.sei.cmu.edu/documents/1263/2016_005_001_464378.pdf
 * 
 * It is not meant to be a direct copy of the ReqSpec format, as this is not intended to function with
 *  AADL at present
 */ 

grammar ReqSpec

import './base'
import './func-spec'
import './hazard-spec'
import './phys-arch'

// Entry point to the reqspec DSL
entry RequirementsModel: // Currently arranged for either Goals or Requirements
    (
        requirementSets+=RequirementDefinition
        goalSets+=GoalDefinition
        requirementDocs+=RequirementDocument
        goalDocs+=GoalDocument 
    )*;

RequirementDefinition:
    ('req'|'requirement') NameTitle RequirementBlock?;

RequirementBlock:
    '{'
        FeatureAllocation
        CategoryReference
        Description?
        VariableReference?
        RelevantCondition?
        Predicate?
        Rationale? 
        MitigatedHazard?
        RefinedReq?
        DecomposedReq?
        InheritsReq?
        EvolvesReq?
        Dropped?
        StakeholderOwner?
        RelatedGoal?
        RelatedRequirement?
        RelatedDocument?
        Issues?
        ChangeUncertainty?
    '}';

RelevantCondition:
    ;

Predicate:
    ;

Rationale:
    ;

MitigatedHazard:
    ;

RefinedReq:
    ;

DecomposedReq:
    ;

InheritsReq:
    ;

EvolvesReq:
    ;

Dropped:
    ;

StakeholderOwner:
    ;

RelatedGoal:
    ;

RelatedRequirement:
    ;

RelatedDocument:
    ;

Issues:
    ;

ChangeUncertainty:
    ;


/* ReqSpec uses the Goal construct to represent individual stakeholder requirements. Stakeholder 
 *  goals can be organized in two ways: 
 *  • by the StakeholderGoalSet construct, to represent a collection of goals for a particular system 
 *      that is represented as an AADL component
 *  • by the GoalsDocument construct that contains goals, possibly organized into a (nested) 
 *      DocumentSection to reflect the structure of an existing textual stakeholder requirement document
 */

/* In the case of this DSL, the notion of a goal set is considered redundant with goal definitions.
 * If a user wants to reference a set of goals, they can simply be nested and downstream interpreting
 * will infer the type.
 */ 
GoalDefinition:
    'goal' NameTitle;

// GoalSetDefinition:
//     'goal' 'set' NameTitle;

GoalDocument:
    'goal' 'document' NameTitle;

/* ReqSpec uses the SystemRequirement construct to represent an individual requirement for a specific system. 
 * A system requirement is intended to be verifiable and not in conflict with other requirements. System 
 * requirement documents are modeled by the RequirementsDocument construct (see Section 2.2.3). When representing 
 * system requirements in an AADL model of the system and its operational context, users employ the 
 * SystemRequirementSet construct to represent a collection of requirements for a particular system. 
 * 
 * Users can also define requirements that are not specific to a particular system but are applicable to 
 * any component or components of a specified set of component categories. Such a GlobalRequirementSet can then 
 * be included in a SystemRequirementSet declaration as a set or as individual requirements through an include 
 * statement. 
 * 
 * We proceed by describing the SystemRequirement, SystemRequirementSet, and GlobalRequirementSet constructs 
 * in turn. Note that the term system in system requirements is not limited to the 
 * AADL system component category. A system may be represented by other categories as well, 
 * such as abstract or device. 
 */

RequirementSetDefinition:
    ('req' | 'requirement') 'set' NameTitle;

RequirementDocument:
    ('req' | 'requirement') 'document' NameTitle;


/*
 * Fragments useful for redundant aspects of ReqSpec
 */
fragment FeatureAllocation:
    ('for' targets+=PhysicalFeature+|'all' )?;

/*
 * Anything below this point belongs in Physical Architecture DSL
 */

