grammar ReqSpec

/*
 * == Model Summary (pulled from CMU/SEI 2016) =====================
 * ReqSpec distinguishes between stakeholder requirements, referred to as goals, 
 * and system requirements, referred to as requirements. Goals express stakeholder
 * intent and may conflict with each other, while system requirements represent a 
 * contract that a system implementation is expected to meet. 
 * 
 * The ReqSpec notation accommodates several capabilities. First, it supports an architecture-led 
 * requirement specification (ALRS) process. In this process, stakeholder goals are turned into 
 * verifiable system requirement specifications by annotating an AADL model of the system of interest
 * in its operational environment and, as appropriate, elements of the system architecture. The report 
 * Requirements and Architecture Specification of the Joint Multi-Role (JMR) Joint Common Architecture (JCA)
 * Demonstration System introduced this process [Feiler 2015].
 */



entry Model:
    items+=(
                Requirement | RequirementSet | RequirementDocument |
                Goal | GoalSet | GoalDocument |
                Category | 
                Personnel |
                Component | Hazard | CompFunction
            )*;

// 
// == Goal section =================================================
// 


GoalDocument:
    'goal' ('doc'|'document') NameTitle GoalDocumentBlock?;

fragment GoalDocumentBlock:    
    '{'
        (
            Id |
            Description |
            Issues | 
            (declaredRequirements+=Requirement) |
            ('ref'|'references') 'goals' referencedGoals+=[Goal:ID] (',' referencedGoals+=[Goal:ID])* |
            ('ref'|'references') 'goal' 'sets' referencedGoalSets+=[GoalSet:ID] (',' referencedGoalSets+=[GoalSet:ID])*
        )*
    '}'; 

GoalSet:
    'goal' 'set' NameTitle GoalSetBlock?;

fragment GoalSetBlock:
    '{'
        (
            // AllocatingArchitecturalElement
            // UseConstantSet
            Id |
            Description |
            (declaredGoals+=Goal) |
            ( ('refs'|'references') ('goals') referencedGoals+=[Goal:ID] (',' referencedGoals+=[Goal:ID])* ) |
            Issues
        )*
    '}';

Goal:
    'goal' NameTitle GoalBlock?;

fragment GoalBlock:
    '{'
        (
            ReqGoalStmt |
            GoalCriticality |
            // Constant
            // WhenCondition
            
            ( 'refines' refines+=[Goal:ID] (',' refines+=[Goal:ID])*                  ) |
            ( 'conflicts' 'with' conflicting+=[Goal:ID] (',' conflicting+=[Goal:ID])* ) |
            ( 'evolves' evolves+=[Goal:ID] (',' evolves+=[Goal:ID])*                   ) 
            // see requirement  (see if we can embed markdown for hyperlinks?)
            // see document     (see if we can embed markdown for hyperlinks?)
        )*
    '}';

fragment GoalReference:
    'see' 'goal' references+=[Goal:ID] (',' references+=[Goal:ID])*;

// 
// == Requirement section =================================================
// 

Requirement:
    ('req' | 'requirement') NameTitle RequirementBlock?;

fragment RequirementBlock:
    '{'
        (
            ReqGoalStmt |
            ReqCriticality |
            // AllocatingArchitecturalElement
            // Variable |
            // WhenCondition |
            // Predicate |
            MitigatesHazard |
            ( 'refines' refines+=[Requirement:ID]       (',' refines+=[Requirement:ID])*    ) |
            ( 'decomposes' decomposes+=[Requirement:ID] (',' decomposes+=[Requirement:ID])* ) |
            ( 'inherits' inherits+=[Requirement:ID]     (',' inherits+=[Requirement:ID])*   ) |
            ( 'conflicts' 'with' conflicting+=[Requirement:ID] (',' conflicting+=[Requirement:ID])* ) |
            ( 'evolves' evolves+=[Requirement:ID]       (',' evolves+=[Requirement:ID])*    )
            // see requirement  (see if we can embed markdown for hyperlinks?)
            // see document     (see if we can embed markdown for hyperlinks?)
        )*
    '}';

RequirementSet:
    ('req'|'requirement') 'set' NameTitle RequirementSetBlock?; // ConstantSet

fragment RequirementSetBlock:
    '{'
        (
            Id |
            Description |
            // see document     (see if we can embed markdown for hyperlinks?)
            GoalReference |
            // VariableReference
            (declaredRequirements+=Requirement) |
            ('ref'|'references') ('req'|'requirement') referencedRequirements+=[Requirement:ID] (',' referencedRequirements+=[Requirement:ID])* |
            Issues
        )*
    '}';

RequirementDocument:
    ('req'|'requirement') ('doc'|'document') NameTitle RequirementDocumentBlock?;

fragment RequirementDocumentBlock:    
    '{'
        (
            Id |
            Description |
            Issues | 
            (declaredRequirements+=Requirement) |
            ('ref'|'references') ('req'|'requirement') referencedRequirements+=[Requirement:ID] (',' referencedRequirements+=[Requirement:ID])*
        )*
    '}'; 

// 
// == Items common between goals, requirements, etc. ==============================
// 

// Common between reqs and goals
fragment ReqGoalStmt:
    Id | CategoryRef | Description | Rationale |
    Dropped | StakeholderReference | OwnerReference | GoalReference |
    Issues;

fragment ReqCriticality:
    ('crit' | 'criticality') criticality=('MUST_HAVE' | 'SHOULD_HAVE' | 'NOT_NEEDED');

fragment GoalCriticality:
    ('crit' | 'criticality') criticality=FLOAT;

fragment Dropped:
    'dropped' reason=STRING;

fragment Issues:
    'issues' issueDescription+=STRING (',' issueDescription+=STRING)*;

fragment Rationale:
    'rationale' rationale=STRING;

// -- Items referring to people ----------------------------------------------------
Personnel:
    {infer Stakeholder} 'stakeholder' name=ID PersonnelBlock? |
    {infer Developer} 'developer' name=ID PersonnelBlock?;

fragment PersonnelBlock:
    '{'
        (
            Id |
            ('name' personName=STRING) |
            ('title' title=STRING) |
            Description |
            ('role' role=STRING) |
            ('email' email=STRING) |
            ('phone' phone=STRING)
            // supervisor - seems unnecessary
        )*
    '}';

fragment OwnerReference:
    'owned' 'by'? owner=[Developer:ID];

fragment StakeholderReference:
    'stakeholder' involvedStakeholders+=[Stakeholder:ID] (',' involvedStakeholders+=[Stakeholder:ID])*;

// == Items likely belonging to other hazard analysis DSL ==================
// == and physical architecture DSL but referenced within reqspec ========== 

/* 
 * Need to look into the EMV2 reference to define a hazard - also consider looking at AdvoCATE
 */

Component:
    /* TODO - Populate Here */ ('comp'|'component') NameTitle ComponentBlock?;

fragment ComponentBlock:
    '{'
        (
            Description |
            Id |
            Issues |
            functions+=CompFunction | CompFunctionRef |
            hazards+=Hazard | HazardRef
        )*
    '}';

fragment HazardRef:
    ('ref'|'references') ('haz'|'hazard') referencedHazards+=[Hazard:ID] (',' referencedHazards+=[Hazard:ID])*;

fragment CompFunctionRef:
    ('ref'|'references') ('func'|'function') referencedFunctions+=[CompFunction:ID] (',' referencedFunctions+=[CompFunction:ID])*;

CompFunction:
    /* TODO - Populate Here */ 'func' NameTitle;// FuncBlock?;

// fragment FuncBlock:
//     '{'

//     '}';

Hazard:
    'hazard' NameTitle;

fragment MitigatesHazard:
    'mitigates' mitigatedHazards+=[Hazard:ID];

// 
// == Things that are likely better off in config files ============================
// 
Category:
    ('cat'|'category') NameTitle;

// 
// == Stuff that'll probably end up in common.langium ==============================
// 
fragment Id:
    'id' id=UUID;

fragment NameTitle:
    name=ID (':' title=STRING)?;

fragment Description:
    'desc' description=STRING;

fragment CategoryRef:
    ('cat'|'category') categories+=[Category:ID] (',' categories+=[Category:ID])*;

hidden terminal WS: /\s+/;
terminal UUID: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal FLOAT returns number: INT (. INT)?;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
