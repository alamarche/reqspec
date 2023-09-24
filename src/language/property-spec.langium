grammar PropertySpec

import './base'

entry PropertyModel:
    items+=(Property|Constant)*;

Property:
    'prop' name=ID;

Constant:
    'const' name=ID;