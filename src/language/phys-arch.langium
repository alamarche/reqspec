
grammar PhysArch

import './base'

entry PhysArchModel:
    items+=PhysicalFeature*;

PhysicalFeature:
    Component | Port | Func | Flow;

Component:
    ('comp'|'component') NameTitle;

Port:
    'port' NameTitle;

Func: 
    ('function'|'func') NameTitle;

// How functions are connected
Flow:
    'flow' NameTitle;