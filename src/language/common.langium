
/*
 * Architecture rules & fragments used across the grammar
 * -------------------------------------------------------
 */
ArchitecturalElement:
    Component | Func | Interface;

Component:
    ('comp' | 'component') NameTitle ComponentBlock?;

fragment ComponentBlock:
    '{'
        Description
    '}';

Func:
    ('func' | 'function') NameTitle FunctionBlock?;

FunctionBlock:
    /* TODO implement rule */ {infer FunctionBlock};

Interface:
    ('intfc' | 'ifc') NameTitle InterfaceBlock?;

InterfaceBlock:
    /* TODO implement rule */ {infer InterfaceBlock};



/*
 * Hazard spec rules & fragments used across the grammar
 * -------------------------------------------------------
 */
Hazard:
    'hazard' NameTitle;

/*
 * Fragments used across all grammars
 * ----------------------------------
 */
fragment NameTitle:
    name=QualifiedName ':' title=STRING;

fragment UniqueID:
    'id' uuid=UUID;

fragment Description:
    ('desc'|'description') desc=STRING;

fragment TargetElement:
    'for' element=[ArchitecturalElement];

/*
 * Data type rules used elsewhere
 */
Float returns number:
    INT ('.' INT)?;

QualifiedName returns string:
    ID ('.' ID)?;

// Uuid returns string:
//     FOURHEX FOURHEX '-' 
//     FOURHEX '-'
//     FOURHEX '-'
//     FOURHEX '-'
//     FOURHEX FOURHEX FOURHEX;

hidden terminal WS: /\s+/;
terminal UUID returns string: /[a-fA-F0-9]{8}/; //-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;