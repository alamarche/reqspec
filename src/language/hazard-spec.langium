grammar HazardSpec

import './base'

entry HazardModel:
    (items+=Hazard)+;

Hazard:
    'hazard' name=ID;