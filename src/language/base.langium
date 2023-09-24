CategoryDefinition:
    ('category' | 'cat') (name=ID);

CategoryReference:
    'category' '{{' refs+=[CategoryDefinition:ID] (',' refs+=[CategoryDefinition:ID])* '}}';

Description:
    ('desc' | 'description') desc=STRING;

VariableDefinition:
    'var' NameTitle UnitReference;

Reference:
    {infer VariableReference} |
    {infer CategoryReference};

VariableReference:
    'var' '{{' refs+=[VariableDefinition:ID] (',' refs+=[VariableDefinition:ID])* '}}';

UnitType:
    'unit' 'type' 

UnitDefinition:
    ;

UnitReference:
    ;

fragment NameTitle:
    name=ID (':' title=STRING)?;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal QUALIFIED_NAME: ID ("." ID)*;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;