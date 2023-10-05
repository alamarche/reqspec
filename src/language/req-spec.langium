grammar ReqSpec

entry Model:
    items+=(
                Requirement | Goal |
                Category | 
                Personnel
            )*;

// 
// == Goal section =================================================
// 

GoalSet:
    'goal' 'set' NameTitle GoalSetBlock?;

fragment GoalSetBlock:
    '{'
        // AllocatingArchitecturalElement
        // UseConstantSet
        Description?
        'goals' declaredGoals+=Goal*
        'reuses' ('goals') referencedGoals+=[Goal:ID]*
        Issues?
    '}';

Goal:
    'goal' NameTitle GoalBlock?;

fragment GoalBlock:
    '{'
        (
            ReqGoalStmt |
            // Constant
            // WhenCondition
            
            ( 'refines' refinesGoals+=[Goal:ID] (',' refinesGoals+=[Goal:ID])*                  ) |
            ( 'conflicts' 'with' conflictingGoals+=[Goal:ID] (',' conflictingGoals+=[Goal:ID])* ) |
            ( 'evolves' evolvesGoals+=[Goal:ID] (',' evolveGoals+=[Goal:ID])*                   ) 
            // see requirement  (see if we can embed markdown for hyperlinks?)
            // see document     (see if we can embed markdown for hyperlinks?)
        )*
    '}';

fragment GoalReference:
    'see' 'goal' referencedGoal+=[Goal:ID] (',' referencedGoal+=[Goal:ID])*;

// 
// == Requirement section =================================================
// 

Requirement:
    ('req' | 'requirement') NameTitle RequirementBlock?;

// Common between reqs and goals
fragment ReqGoalStmt:
    Id | CategoryRef | Description | Rationale |
    Dropped | StakeholderReference | OwnerReference | GoalReference |
    Issues;

fragment RequirementBlock:
    '{'
        (
            ReqGoalStmt |
            // AllocatingArchitecturalElement
            // Variable |
            // WhenCondition |
            // Predicate |
            MitigatesHazard |
            ( 'refines' refinesReqs+=[Requirement:ID]       (',' refinesReqs+=[Requirement:ID])*    ) |
            ( 'decomposes' decomposesReqs+=[Requirement:ID] (',' decomposesReqs+=[Requirement:ID])* ) |
            ( 'inherits' inheritsReqs+=[Requirement:ID]     (',' inheritsReqs+=[Requirement:ID])*   ) |
            ( 'evolves' evolvesReqs+=[Requirement:ID]       (',' evolvesReqs+=[Requirement:ID])*    )
            // see requirement  (see if we can embed markdown for hyperlinks?)
            // see document     (see if we can embed markdown for hyperlinks?)
        )*
    '}';

RequirementSet:
    ('req'|'requirement') 'set' NameTitle RequirementSetBlock?; // ConstantSet

fragment RequirementSetBlock:
    '{'
        Description?
        // see document     (see if we can embed markdown for hyperlinks?)
        GoalReference?
        // VariableReference
        'reqs'|'requirements' declaredRequirements+=Requirement*
        'reuses' ('reqs'|'requirements') referencedRequirements+=[Requirement:ID]*
        Issues?
    '}';

RequirementDocument:
    ('req' | 'requirement') ('doc'|'document') NameTitle; 

// 
// == Items common between goals, requirements, etc. ==============================
// 

fragment Dropped:
    'dropped' reason=STRING;

fragment Issues:
    'issues' issueDescription+=STRING;

fragment Rationale:
    'rationale' rationale=STRING;

// -- Items referring to people ----------------------------------------------------
Personnel:
    {infer Stakeholder} 'stakeholder' name=ID PersonnelBlock? |
    {infer Developer} 'developer' name=ID PersonnelBlock?;

fragment PersonnelBlock:
    '{'
        ('name' personName=STRING)?
        ('title' title=STRING)?
        Description?
        ('role' role=STRING)?
        ('email' email=STRING)?
        ('phone' phone=STRING)?
        // supervisor - seems unnecessary
    '}';

fragment OwnerReference:
    'owned' 'by'? owner=[Developer:ID];

fragment StakeholderReference:
    'stakeholder' involvedStakeholders+=[Stakeholder:ID] (',' evolvesReqs+=[Requirement:ID])*;

// -- Items likely belonging to other DSLs but referenced within reqspec ---------- 

/* 
 * Need to look into the EMV2 reference to define a hazard - also consider looking at AdvoCATE
 */
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
    'id' name=UUID;

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
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
