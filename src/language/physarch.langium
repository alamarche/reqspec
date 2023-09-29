/*
 * Grammar appears intentionally sparse because ReqSpec largely references
 * everything going on here
 * 
 */

grammar PhysArch

import './common'

entry PhysicalModel:
    items+=(ArchitecturalElement)*;