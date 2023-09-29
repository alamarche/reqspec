grammar ReqSpec

import './common'

entry RequirementsModel:
    items+=Version items+=(
                            Requirement | 
                            // RequirementTemplate |
                            RequirementSet | 
                            // RequirementSetTemplate |
                            RequirementDoc |
                            // RequirementDocTemplate |
                            Goal | 
                            // GoalTemplate |
                            GoalSet | 
                            // GoalSetTemplate |
                            GoalDoc |
                            // GoalDocTemplate |
                            Category
                           )*;

// GoalDocTemplate:
//     /* TODO implement rule */ {infer GoalDocTemplate};

// GoalSetTemplate:
//     /* TODO implement rule */ {infer GoalSetTemplate};

// GoalTemplate:
//     /* TODO implement rule */ {infer GoalTemplate};

// RequirementDocTemplate:
//     /* TODO implement rule */ {infer RequirementDocTemplate};

// RequirementSetTemplate:
//     /* TODO implement rule */ {infer RequirementSetTemplate};

// RequirementTemplate:
//     /* TODO implement rule */ {infer RequirementTemplate};

RequirementDoc:
    /* TODO implement rule */ {infer RequirementDoc};

GoalDoc:
    /* TODO implement rule */ {infer GoalDoc};

GoalSet:
    /* TODO implement rule */ {infer GoalSet};

RequirementSet:
    /* TODO implement rule */ {infer RequirementSet};

/*
 * Version is used to help handle changes to the DSL over time and to indicate the type of reqspec document being created
 * 
 * * `basic` - indicates a barebones form of ReqSpec for beginner users. Physical architecture and functional architecture 
 * are baked into the same reqspec file
 * * `advanced` - indicates a form of reqspec that interacts with a dedicated physical architecture DSL
 * * `aadl` meant to interface with AADL language artifacts
 */
Version:
    'reqspec' 'v' number=Float type='basic'|'advanced'|'aadl';

Goal:
    'goal' NameTitle;

Requirement:
    ('req'|'requirement') NameTitle RequirementBlock?;

fragment RequirementBlock:
    '{'
        TargetElement?
        UniqueID?     //uuid
        (('cats' | 'categories') categories+=[Category] (',' categories+=[Category])* )?
        Description
        // Constant
        // In Modes
        Rationale?
        MitigateHazard?
        ('refines' 'reqs'? refinesReqs+=[Requirement] (',' refinesReqs+=[Requirement])* )?
        ('decomposes' 'reqs'? decomposesReqs+=[Requirement] (',' decomposesReqs+=[Requirement])* )?
        ('inherits' 'reqs'? inheritsReqs+=[Requirement] (',' inheritsReqs+=[Requirement])* )?
        Dropped?
        ('see' 'goals' relatedGoals+=[Goal] (',' relatedGoals+=[Goal])* )?
        ('see' 'docs' relatedDoc+=STRING (',' relatedDocs+=STRING)* )?
        (('issues' | 'defects') issues+=STRING (',' issues+=STRING)* )?

    '}';

fragment Rationale:
    'rationale' rationale=STRING;

fragment MitigateHazard:
    'mitigates' hazards+=[Hazard];

fragment Dropped:
    'dropped' droppedReasons+=STRING;

Category:
    ('cat'|'category') NameTitle ('{' subCategories+=Category+ '}')?;
    

// Variable:
//     'var' NameTitle '{'
//         units=[VariableUnits:QualifiedName] 
//         value=Float
//     '}';

// VariableUnits:
//     'unit' NameTitle a=STRING;

